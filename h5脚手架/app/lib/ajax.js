import axios from 'axios';
import qs from 'qs';
import urlConfig from '../config/environment';

// 不规则success
const irregularParse = (str) => {
  let nstr = str;
  if (/success/.test(str) !== /"success"/.test(str)) {
    nstr = str.replace(/success/, '"success"');
  }
  return JSON.parse(nstr);
};

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = data => qs.stringify(data);

axios.defaults.timeout = 75000;

function Ajax(url, param) {
  param['queryParam.channelCode'] = '4'; // 交易渠道(手机银行)
  if (param) {
    const request = qs.stringify(
      /queryAccGroup|querySysParam|tradeQuery|queryNews|queryTerms|queryAvailBal|queryPrice|tradingPVW|queryCoreAccounts|tradeConfirm|mobilePayPwdVerify|queryLocalTrades|certificateDown/.test(url) ? {
        reqJson: JSON.stringify({
          request: param,
        }),
      } :
        {
          reqJson: JSON.stringify(param)
        }
    );

    return axios({
      url: `${urlConfig.baseUrl}${url}`,
      method: 'post',
      data: request,
      timeout: 360000,
      transformRequest: [function (data) {
        const origin = JSON.parse(qs.parse(data).reqJson);
        // origin.testUrlName = sessionGet('tmpTestUrl');
        // TODO 这里加上其他逻辑操作请求数据origin
        const newData = qs.stringify({
          reqJson: JSON.stringify(origin),
          // serverTime: sessionGet('serverTime'),
          // traceId:sessionGet('traceId')||commonTool.getChannelKey(new Date()),
          // pubkey,
          // origtxt,
          // loginFlag
        });
        return newData;
      }],
    }).then((res) => {
      let data = res.data;
      if (typeof data !== 'object') {
        try {
          data = irregularParse(data);
        } catch (error) {
          throw new Error('[format error]please check you response data');
        }
      }
      return data;
   
    });
  }

  else {
    return axios.get(`${urlConfig.baseUrl}${url}`).then((res) => {
      if (res.urlConfig.url.indexOf('txt') !== -1) {
        return res;
      } else {
        let data = res.data;
        if (typeof data !== 'object') {
          try {
            data = irregularParse(data);
          } catch (error) {
            throw new Error('[format error]please check you response data');
          }
        }
        if (typeof data.data.response !== 'object') {
          data.data.response = JSON.parse(data.data.response);
        }
        return data;
      }
    });
  }
}

const nativeAjaxParamsTran = params => Object.keys(params).map(x => `${x}=${params[x]}`).join('&');
function nativeAjax(u, data = '') {
  const url = `${urlConfig.baseUrl}${u}`;
  data['queryParam.channelCode'] = '4'; // 交易渠道(手机银行)
  return new Promise((resolve, reject) => {
    if (typeof data === 'object') {
      data = nativeAjaxParamsTran(data);
    }
    console.log(`${url}参数:`, data);
    const ajaxSettings = {
      url,
      async: true,
      timeout: 15000,
      type: 'POST',
      data,
      success: (res) => {
        if (!/iP(ad|hone|od)/.test(navigator.userAgent)) {
          if (url.indexOf('random.action?base64=true') < 0) {
            res = JSON.parse(res[0]);
          } else {
            res = res[0];
          }
        }
        // if (!res.success) {
        //   checkNoLogin(res);
        // }
        resolve(res);
      },
      error(res) {
        console.log('====== 请求失败 =======');
        console.log(res);
        reject(res);
      },
    };
    window.plus.httpEngine.httpReq(ajaxSettings);
  });
}

// export default urlConfig.dev ? Ajax : nativeAjax;
export default  Ajax;

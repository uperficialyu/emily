/**
 * @description: 招银避险交易平台主入口
 * @author: 梁珊珊
 */
import React, { Component } from 'react';
import { sessionEachSet, sessionSet, sessionGet, storageClear } from 'storage';
import Ajax from 'ajax';
import {inject} from 'mobx-react';
import commonTool from 'utils/commonTool';
import heartFormat from 'utils/heartFormat';
import SpinLoading from './components/SpinLoading/SpinLodaing';
import AppRouter from './router';
import { commonWebnet } from './store/commonWebnetStore';
import { channelWebnet } from './store/channelWebnetStore';
import { createHashHistory } from 'history';
import Mask from './components/Mask/Mask';
import XFUNDSMessage from './components/XFUNDSMessage/XFUNDSMessage';
import { quotationWebnet } from './store/quotationWebnet';

const message = new XFUNDSMessage();
const debugYesFalse = 'no';
@inject('quoteStore')
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signReady: false,
      paramAllReady: false,
      showMask: false
    };
  }

  componentDidMount() {
    // 签到，本系统第一个异步请求
    // 开始显示遮罩层遮罩整个界面
    const self = this;
    self.setState({ showMask: true }, () => {
      self.sign();
    });
    // this.getCommonDatas()

    this.changeToFixed();

  }

  changeToFixed = () => {
    Number.prototype.toFixed = function (len) {
      if (len > 20 || len < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
      }
      // .123转为0.123
      var number = Number(this);
      if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
      }
      if (typeof (len) == 'undefined' || len == 0) {
        return (Math.round(number)).toString();
      }
      var result = number.toString(),
        numberArr = result.split('.');

      if (numberArr.length < 2) {
        //整数的情况
        return padNum(result);
      }
      var intNum = numberArr[0], //整数部分
        deciNum = numberArr[1],//小数部分
        lastNum = deciNum.substr(len, 1);//最后一个数字

      if (deciNum.length == len) {
        //需要截取的长度等于当前长度
        return result;
      }
      if (deciNum.length < len) {
        //需要截取的长度大于当前长度 1.3.toFixed(2)
        return padNum(result)
      }
      //需要截取的长度小于当前长度，需要判断最后一位数字
      result = intNum + '.' + deciNum.substr(0, len);
      if (parseInt(lastNum, 10) >= 5) {
        //最后一位数字大于5，要进位
        var times = Math.pow(10, len); //需要放大的倍数
        var changedInt = Number(result.replace('.', ''));//截取后转为整数
        var fu = 1/changedInt < 0;// 为true 时，则 changedInt < 0 或者 changedInt = -0,否则为正数或等于0
        if(fu){
          changedInt--;//整数进位
        }else{
          changedInt++;//整数进位
        }
        changedInt /= times;//整数转为小数，注：有可能还是整数
        result = padNum(changedInt + '');
      }
      return result;
      //对数字末尾加0
      function padNum(num) {
        var dotPos = num.indexOf('.');
        if (dotPos === -1) {
          //整数的情况
          num += '.';
          for (var i = 0; i < len; i++) {
            num += '0';
          }
          return num;
        } else {
          //小数的情况
          var need = len - (num.length - dotPos - 1);
          for (var j = 0; j < need; j++) {
            num += '0';
          }
          return num;
        }
      }
    }
  }

  sign = () => {
    // 存储页面初始路径，刷新时候根据此路径进行跳转
    let innerDebugYesFalse = 'no';
    if( location&&location.hostname){
      const innerHost = String(location.hostname);
      if(innerHost.indexOf){
        if (innerHost.indexOf("127.0.0.1")!==-1||innerHost.indexOf("localhost")!==-1){
          innerDebugYesFalse = 'yes';
        }
      }
    }
    storageClear(true);
    storageClear(false);
    sessionSet('fromLoaction', location.href);
    sessionSet('approve', 'N');
    sessionSet('mgnFlag', 'N');
    sessionSet('medalFlag', 'N');
    sessionSet('mobile', '');
    sessionSet('shenName', '');
    sessionSet('sysStartFlag', 'start');
    sessionSet('traceId', '');
    sessionSet('debug', innerDebugYesFalse);
    if(location&&location.search&&location.search.indexOf("?mytest=yes")!==-1){
      sessionSet('debug', 'yes');
    }
    if (innerDebugYesFalse==='yes'){
        sessionSet('tmpTestUrl', "http://55.11.24.121:8085");
      //sessionSet('tmpTestUrl', "http://xfunds-new-dev.paas.cmbchina.cn");
    }
    sessionSet('rmbTradeCodeJson', []);
    sessionSet('rmbBigAndLitteJson', []);
    sessionSet('rmbSaleUseStr', {});
    let parsed = {};
    parsed.debug = sessionGet('debug') || 'no';
    try {
      sessionSet('serverTime', '');// 服务器时间,重新登录或刷新重set
      sessionSet('serverTimeOut', 20);// 服务器时间,重新登录或刷新重set
      sessionSet('isTimeOut', 'no');// 超时时间
    } catch (error) {
      console.log(error);
    }
     //http://99.12.74.52/bank/app/index.html

    // http://127.0.0.1:8081/bank/app/index.html?mytest=yes
    //http://127.0.0.1:8081/index.html?mytest=yes

    if(location&&location.search&&location.search.indexOf("?mytest=yes")!==-1){
      const debugData = {};
      debugData.userId = 'testcust';// 前缀一定要用test开头 N003271929 N002436882 N002436873  N111648616 N111648607
      debugData.userName = 'testcust';
      // N111190318  N111190309 274 N221190292 N111601324
      debugData.custId = 'testcust'; // '1279000084';?//571900449 0?7699000000
      debugData.custNo = 'testcust';// '1279000084';?7699000000  7559190574 N111648616  7699000186
      debugData.reqtim = '5454545';
      debugData.loginUserName = 'testCust';
      debugData.signStr = '';
      debugData.loginFlag = 'N';
      debugData.usrtyp = 'P'; // P管理员S非管理员
      parsed.debugData = debugData;

    }else{
      if (parsed.debug && parsed.debug === 'yes') {
        const debugData = {};
        debugData.userId = 'N111648607';// 前缀一定要用test开头 N003271929 N002436882 N002436873  N111648616 N111648607
        debugData.userName = 'N111648607';
        // N111190318  N111190309 274 N221190292 N111601324
        debugData.custId = '7699000186'; // '1279000084';?//571900449 0?7699000000
        debugData.custNo = '7699000186';// '1279000084';?7699000000  7559190574 N111648616  7699000186
        debugData.reqtim = '5454545';
        debugData.loginUserName = 'zjx';
        debugData.signStr = '';
        debugData.loginFlag = 'N';
        debugData.usrtyp = 'P'; // P管理员S非管理员
        parsed.debugData = debugData;
      } else {
        parsed = this.parse(location.search);
        if (parsed && parsed['approve'] && parsed['approve'] === 'Y') {
          sessionSet('approve', 'Y');
        }
      }
    }
    const url = '/base/xdex_encrypLoginData.bankact';
    Ajax(url, {
      reqJson: JSON.stringify(parsed),
    }).then((response) => {
      if (response.success) {
        if (response.userId === undefined || response.userId === null
          || response.userName === undefined || response.userName === null
          || response.custId === undefined || response.custId === null) {
          this.setState({
            error: response.message,
            showMask: false
          });
          return;
        }
        this.initBaseInfo(response);
        this.setState({
          signReady: true
        });
      } else {
        sessionSet('sysStartFlag', 'fail');
        this.setState({
          error: response.message,
          showMask: false
        });
      }
    });
  }

  parse = (param) => {
    if (param === undefined || param === null || param === '' || param.length <= 5) {
      return {};
    }
    const puerParam = param.substring(1);
    const data = {};
    if (puerParam.indexOf('&') !== -1) {
      const p = puerParam.split('&');
      for (let i = 0, len = p.length; i < len; i++) {
        const d = p[i].split('=');
        data[d[0]] = d[1];
      }
    } else if (puerParam.indexOf('=') !== -1) {
      const p = puerParam.split('=');
      data[p[0]] = p[1];
    }
    return data;
  }

  /**
   * @description 初始化从宿主环境传递过来的公用数据
   * */
  initBaseInfo = (data) => {
    // 暂时模拟已经签到了
    if (data === undefined || data === null) {
      this.setState({
        error: '数据错误',
        showMask: false
      });
      return;
    }

    if (data&&data.custId&&data.custId==='testcust'){
      sessionSet('clientno', 'testcust'); // 加ClinetNo
    }else{
      sessionSet('clientno', data.clientno||''); // 加ClinetNo
    }
    sessionSet('userId', data.userId); // 企业用户ID
    sessionSet('userName', data.userName); // 企业用户名称
    sessionSet('custId', data.custId); // 客户号
    sessionSet('custNo', data.custNo); // 企业编号
    sessionSet('reqtim', data.reqtim); // 登录时间
    sessionSet('loginUserName', data.loginUserName); // 登录用户
    sessionSet('signStr', data.signStr || ''); // 加签请求
    sessionSet('loginFlag', data.loginFlag || 'N'); // 证书用户
    sessionSet('serverTimeOut', data.severTimeOut || 20); // 超时时间
    sessionSet('severTime', '');
    sessionSet('isTimeOut', 'no'); // 超时时间
    sessionSet('fromclient', data.fromclient); // 登陆方式 0-web 1-客户端
    sessionSet('usrtyp', data.usrtyp || 'S'); // P 管理员 S 非管理员
    sessionSet('mobile', data.mobile || '');
    sessionSet('shenName', data.shenName || '');
    sessionSet('traceId', data.userId+"("+data.custId+")");
    this.getCommonDatas();
  }

  /**
   * @description 公共参数查询
   * 本地session存储Key说明，获取通过sessionGet('key')即可，举例：sessionGet('clientInfo')：
   * clientInfo  客户信息对像
   * sysParamList 系统参数列表
   * currList 货币列表
   * currPariList  货币对列表
   * termList 远期期限列表
   * swapTermList 掉期期限列表
   * spotRateList 即期全价列表
   * forwardRateList 远期全价列表
   * swapRateList 掉期全价列表
   * */
  getCommonDatas = () => {
    const url = '/base/xdex_queryCommonDatas.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        custId: sessionGet('custId')
      }
    };
    return Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        const commonData = {};
        commonData.currList = commonTool.arrToObjReSerialize(  response.data.currList, 'chsName1');
        commonData.currPariList = commonTool.arrToObjReSerialize(  response.data.currPariList, 'rateCode');
        commonData.currPariGoldList = commonTool.arrToObjReSerialize(  response.data.currPariGoldList, 'rateCode');
        commonData.termList = commonTool.arrToObjReSerialize(  response.data.termList, 'termId');
        commonData.sysParamList = commonTool.arrToObjReSerialize(  response.data.sysParamList, 'name');
        commonData.clientinfo = response.data.clientinfo;
        sessionEachSet(commonData);

        if (commonTool.getSysParamName("PRICECONFLG")==='1'){
          this.props.quoteStore.gInitPriceWebnetAjax().then((ok) => {
            if (ok){
              quotationWebnet();
              if (commonTool.getSysParamName("RMKCONFLG")==='1'){
                sessionSet('pubParam', {
                  userId: sessionGet('userId'),
                  custId: sessionGet('custId'),
                  userName: sessionGet('userName'),
                  custNo: sessionGet('custNo'),
                  reqtim: sessionGet('reqtim'),
                  loginUserName: sessionGet('loginUserName')
                });
                this.getCommonDatasNext();
              }else{
                this.getRmkConFromServer();
              }
            }else{
              sessionSet('sysStartFlag', 'fail');
              console.log(`初始价格出错`);
              this.setState({ showMask: false });
            }
          });
        } else {
          if (commonTool.getSysParamName('RMKCONFLG') === '1'){
            sessionSet('pubParam', {
              userId: sessionGet('userId'),
              custId: sessionGet('custId'),
              userName: sessionGet('userName'),
              custNo: sessionGet('custNo'),
              reqtim: sessionGet('reqtim'),
              loginUserName: sessionGet('loginUserName'),
            });
            this.getCommonDatasNext();
          }else{
            this.getRmkConFromServer();
          }
        }
      } else {
        this.setState({ showMask: false });
        sessionSet('sysStartFlag', 'fail');
        console.log(`获取公共基础参数出错${commonTool.transformErrMsg(response.message)}`);
      }
    });
  }
  // 从后台获取大小项
  getRmkConFromServer = () => {
    const url = '/base/xdex_queryRmbInfoCommonDatas.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        custId: sessionGet('custId')
      }
    };
    Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        if (response.data.rmbBigAndLitteJson !== undefined && response.data.rmbBigAndLitteJson !== null
          && response.data.rmbBigAndLitteJson !== '') {
          sessionSet('rmbBigAndLitteJson', JSON.parse(response.data.rmbBigAndLitteJson));
        }
        if (response.data.rmbSaleUseStr !== undefined && response.data.rmbSaleUseStr !== null
          && response.data.rmbSaleUseStr !== '') {
          sessionSet('rmbSaleUseStr', JSON.parse(response.data.rmbSaleUseStr));
        }
        if (response.data.rmbTradeCodeJson !== undefined && response.data.rmbTradeCodeJson !== null
          && response.data.rmbTradeCodeJson !== '') {
          sessionSet('rmbTradeCodeJson', commonTool.chgTranCode(JSON.parse(response.data.rmbTradeCodeJson)));
        }
        sessionSet('pubParam', {
          userId: sessionGet('userId'),
          custId: sessionGet('custId'),
          userName: sessionGet('userName'),
          custNo: sessionGet('custNo'),
          reqtim: sessionGet('reqtim'),
          loginUserName: sessionGet('loginUserName'),
        });
        this.getCommonDatasNext();
      } else {
        sessionSet('sysStartFlag', 'fail');
        this.setState({ showMask: false });
        console.log(`获取大小项出错${commonTool.transformErrMsg(response.message)}`);
      }
    });
  }

  // 账户信息查询
  getCommonDatasNext = () => {
    const url = '/base/xdex_queryCommonDatasNext.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        custId: sessionGet('custId')
      }
    };
    Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        const commonDatasNext = response.data;
        sessionSet('eleContractFlag', commonDatasNext.eleContractFlag);
        sessionSet('showFloowContractFlag', commonDatasNext.showFloowContractFlag);
      //  commonDatasNext.medalList = commonTool.arrToObjReSerialize(commonDatasNext.medalList, 'cyCode', 'medalNo');// 根据币种,mod by zjx
        commonDatasNext.countextList = commonTool.arrToObjArrReSerialize(commonDatasNext.countextList, 'appId', 'rateCode');// 优惠列表
        if (data.pubParam.custId==='testcust'){
          commonDatasNext.mgnAccountList = [];
          commonDatasNext.mgnAccountList[0]={
            "defaultFlag":"1",
            "availableAmount":10000000.00,
            "marginType":"1",
            "instrumentId":"0",
            "accountNo":"testmgncny",
            "cyCode":"CNY",
            "businessType":"1",
            "COUNTNUM":0,
            "depositType":"1",
            "ROW_ID":0
          }
        }
       commonDatasNext.mgnAccountList = commonTool.arrToObjReSerialize(commonDatasNext.mgnAccountList, 'cyCode', 'accountNo');// 保证金账号列表
       delete commonDatasNext['medalList'];
       delete commonDatasNext['mgnAccountList'];
        this.formateBussModlist(commonDatasNext);
        sessionEachSet(commonDatasNext);
        if (sessionGet('approve') === 'Y') {
          createHashHistory().push('/ApproveEventManage');
        }
        // 随心展公共参数查询
        this.getHeartShowCommonDatas();
      } else {
        sessionSet('sysStartFlag', 'fail');
        console.log(`公共信息查询出错${commonTool.transformErrMsg(response.message)}`);
        this.setState({ showMask: false });
      }
    });
  }

  // 随心展公共参数查询
  getHeartShowCommonDatas = () => {
    const url = '/heartshow/xdex_queryHeartshowCommonDatas.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        customerId: sessionGet('custId')
      }
    };
    Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        const heartShowDatas = response.data;
        const defaultAccountList = commonTool.arrToObjReSerialize(heartShowDatas.defaultAccountList, 'type', 'currency');
        const heartshowBusinessMode = heartShowDatas.heartshowBusinessMode[0] || {};
        const heartshowRateCodeFollow = heartShowDatas.heartshowRateCodeFollow[0] || {};
        const heartshowTermIdFollowList = commonTool.arrToObjReSerialize(heartShowDatas.heartshowTermIdFollowList, 'rateCode') || {};
        const showAndOneDayList = heartFormat.objectShowAndOneDayList(heartShowDatas.ShowAndOneDayList) || {};
        const businessMode = heartshowBusinessMode.businessMode || '';
        const rateCodeStr = heartshowRateCodeFollow.rateCode || '';
        const reteCodeArr = rateCodeStr && rateCodeStr.split('|') || [];
        const showCustPointList = commonTool.arrToObjReSerialize(heartShowDatas.showCustPointList, 'rateCode') || {};
        const todayIsHoliday = heartShowDatas.todayIsHolidayMap && heartShowDatas.todayIsHolidayMap.todayIsHoliday || false;
        const showShiborList = commonTool.arrToObjReSerialize(heartShowDatas.showShiborList, 'rateCode', 'shiborCode') || {};
        const openList = commonTool.arrToObjReSerialize(heartShowDatas.openList, 'appId') || {};
        sessionSet('starRateCode', reteCodeArr);
        sessionSet('starTermId', heartshowTermIdFollowList);
        sessionSet('defaultBusinessMode', businessMode);
        sessionSet('defaultAccountList', defaultAccountList);
        sessionSet('showAndOneDayList', showAndOneDayList);
        sessionSet('initHeartShow', 'firstInit');
        sessionSet('showCustPointList', showCustPointList);
        sessionSet('todayIsHoliday', todayIsHoliday);
        sessionSet('showShiborList', showShiborList);
        sessionSet('openList', openList);
        this.getShowCouponList();
      } else {
        sessionSet('sysStartFlag', 'fail');
        console.log(`随心展公共参数查询失败${commonTool.transformErrMsg(response.message)}`);
        this.setState({ showMask: false });
      }
    });
  }

  // 优惠卷有用列表查询
  getShowCouponList = () => {
    /*
          const testData= {
            "map":{
              "validList":[
                {
                 couponNo:'dfdfdffd1',
                 customerId:sessionGet('custId'),
                 inputChannel:9,
                 productType:11,
                 delaFlag:0,
                 point:20,
                 amountLimit:1000,
                 expDate:20201101,
                 couponStatus:1,
                 couponType:2
                },
                {
                  couponNo:'dfdfdffd2',
                  customerId:sessionGet('custId'),
                  inputChannel:9,
                  productType:11,
                  point:25,
                  delaFlag:0,
                  amountLimit:1000,
                  expDate:20201101,
                  couponStatus:1,
                  couponType:2
                 },
                 {
                  couponNo:'dfdfdffd3',
                  customerId:sessionGet('custId'),
                  inputChannel:9,
                  productType:11,
                  delaFlag:0,
                  point:10,
                  amountLimit:1000,
                  expDate:20201101,
                  couponStatus:1,
                  couponType:2
                 },
                 {
                  couponNo:'dfdfdffd4',
                  customerId:sessionGet('custId'),
                  inputChannel:9,
                  productType:10,
                  point:3,
                  delaFlag:1,
                  amountLimit:1000,
                  expDate:20201101,
                  couponStatus:1,
                  couponType:2
                 },
                 {
                  couponNo:'dfdfdffd4',
                  customerId:sessionGet('custId'),
                  inputChannel:9,
                  productType:1000,
                  point:5,
                  delaFlag:1,
                  amountLimit:10,
                  expDate:20201101,
                  couponStatus:1,
                  couponType:2
                 },

              ]
            }
          };

          const couponList1 =testData&&testData.map&&testData.map.validList&&commonTool.arrToObjReSerialize(testData.map.validList, 'productType','couponNo') || {};
          sessionSet('couponList', couponList1);
         // console.log('couponList1=',couponList1);
          this.getHolidayExList();
          return ;
    */
    const url = '/heartshow/xdex_showcouponList.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        custId: sessionGet('custId')
      },
      queryParam:{
        customerId: sessionGet('custId'),
        couponStatus:1,
        couponNo:''
      }
    };
    Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        const couponDatas = response.data;
        const couponList =couponDatas&&couponDatas.map&&couponDatas.map.validList&&commonTool.arrToObjReSerialize(couponDatas.map.validList, 'productType','couponNo') || {};
        sessionSet('couponList', couponList);
        this.getHolidayExList();
      } else {
        sessionSet('sysStartFlag', 'fail');
        console.log(`优惠卷查询出错${commonTool.transformErrMsg(response.message)}`);
        this.setState({ showMask: false });
      }
    });
  }

  // 节假日查询
  getHolidayExList = () => {
    const url = '/base/xdex_queryHolidayEx.bankact';
    const data = {
      pubParam: {
        userId: sessionGet('userId'),
        custId: sessionGet('custId')
      }
    };
    Ajax(url, {
      reqJson: JSON.stringify(data)
    }).then((response) => {
      if (response.success) {
        const holidayDatas = response.data;
        const holidaylist = commonTool.arrToObjReSerialize(holidayDatas.holidaylist.datals, 'holidayId','holidayDate') || {};
        sessionSet('holidaylist', holidaylist);
        // 开启公共参数推送
        if (!(commonTool.getSysParamName("PRICECONFLG")==='1')){
          this.props.quoteStore.gInitPriceWebnetAjax().then((ok) => {
            if (ok){
              quotationWebnet();
              commonWebnet();
              channelWebnet();
              this.setState({
                paramAllReady: true,
                showMask: false
              });
              const showFloowContractFlag = sessionGet('showFloowContractFlag');
              if (showFloowContractFlag === undefined || showFloowContractFlag === null || String(showFloowContractFlag) === '0') {
                message.warn('您尚未线上确认《“随心展”产品协议》，请在协议管理中查看并重新签约，否则无法正常交易，谢谢',15);
              }
              if (String(showFloowContractFlag) === '2') {
                message.warn('您线上签约的《“随心展”产品协议》已过期，请在协议管理中查看并重新签约，否则将无法正常交易，谢谢',15);
              }
              sessionSet('sysStartFlag', 'ok');
            }else{
              sessionSet('sysStartFlag', 'fail');
              console.log(`初始价格出错`);
              this.setState({ showMask: false });
            }
          });
        }else{
          commonWebnet();
          channelWebnet();
          this.setState({
            paramAllReady: true,
            showMask: false
          });
          const showFloowContractFlag = sessionGet('showFloowContractFlag');
          if (showFloowContractFlag === undefined || showFloowContractFlag === null || String(showFloowContractFlag) === '0') {
            message.warn('您尚未线上确认《“随心展”产品协议》，请在协议管理中查看并重新签约，否则无法正常交易，谢谢',15);
          }
          if (String(showFloowContractFlag) === '2') {
            message.warn('您线上签约的《“随心展”产品协议》已过期，请在协议管理中查看并重新签约，否则将无法正常交易，谢谢',15);
          }
          sessionSet('sysStartFlag', 'ok');
        }
      } else {
        sessionSet('sysStartFlag', 'fail');
        console.log(`节假日查询出错${commonTool.transformErrMsg(response.message)}`);
        this.setState({ showMask: false });
      }
    });
  }

  formateBussModlist = (commonDatasNext) => {
    const bussModList = commonTool.arrToObjReSerialize(commonDatasNext.bussModList, 'zBusMod');
    const custId = sessionGet('custId');
    for (const i in bussModList) {
       if (custId==='testcust'){
        bussModList[i].accountList=[];
        bussModList[i].accountList[0]={defaultFlag:"1", instrumentId:"0", marginType:"0", accountNo:"testusd"+i, DepositType: "1",cyCode: "USD",AvailableAmount:10000000.00,businessType: "1"};
        bussModList[i].accountList[1]={defaultFlag:"1", instrumentId:"0", marginType:"0", accountNo:"testcny"+i, DepositType: "1",cyCode: "CNY",AvailableAmount:10000000.00,businessType: "1"};
       }
      bussModList[i].accountList = commonTool.arrToObjReSerialize(bussModList[i].accountList, 'cyCode', 'accountNo');
    }
    commonDatasNext.bussModList = bussModList;
  }

  render() {
    const { signReady, paramAllReady } = this.state;
    return (
      <div>
        <Mask showMask={this.state.showMask} />
        {signReady
          ? <AppRouter paramAllReady={paramAllReady} />
          : <SpinLoading />}
      </div>
    );
  }
}

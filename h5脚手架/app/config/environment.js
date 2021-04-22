
const dev = process.env.NODE_ENV === 'development';

const action = '/egate/jsonGateWay.action';
// const action = '/api/user/text'; // 本地自己node服务


const server = 'http://192.168.30.8:8083';

const root = '/egate/jsonGateWay.action'; // 接口名

const mobile = 'https://45.123.203.201/js/dqs';

// const host = dev ? 'root' : (server + root);
const host = dev ? action : (server + action);

const urlConfig = {
  dev,
  server,
  root,
  mobile,
  baseUrl: host, //'http://192.168.70.65:12345',
  channel: '0',
  pdfUrl: server + '/pages/test.pdf',
};

export default urlConfig;
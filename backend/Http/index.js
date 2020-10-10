/**
 * @file axios封装
 */

const axios = require('axios').default;

const _axios = axios.create();

_axios.interceptors.response.use(res => {
  return res.data;
}, err => {
  throw new Error(err);
});

module.exports = _axios;
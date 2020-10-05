/**
 * @file axios封装
 */

import axios, {AxiosResponse} from 'axios';
import {notification} from 'antd';
import {baseURL} from '@/config';

export const requestList: Function[] = [];
const _axios = axios.create({
  baseURL
});

_axios.interceptors.response.use(
  (res: AxiosResponse) => {
    return res.data;
  },
  (err: any): any => {
    if (axios.isCancel(err)) {
      console.warn('页面取消请求', err.message);
      return Promise.reject(err);
    }
    else {
      let data = {
        message: '网络请求错误',
        description: err.message,
        duration: 1
      };
      if (err.response) {
        data.message = err.response.status;
      }
      notification.error(data);
      return Promise.reject(err);
    }
  }
);

export default _axios;

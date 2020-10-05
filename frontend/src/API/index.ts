/**
 * @file 接口主文件
 */

import {CancelToken} from 'axios';

export type APIProps<T> = {
  payload: T,
  cancelToken?: CancelToken
};

export type API = Promise<any>;

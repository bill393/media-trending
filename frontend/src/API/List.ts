import axios from '@/utils/http';
import {APIProps, API} from './index';

export type GetList = {
  name: string
};

export const getList = (props: APIProps<GetList>): API => {
  const data = {
    params: props.payload,
    cancelToken: props.cancelToken
  };
  return axios.get('/name', data);
};

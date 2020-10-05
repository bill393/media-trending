import axios, {CancelToken, Canceler} from 'axios';

export type Source = {
  token: CancelToken,
  cancel: Canceler
};

export const useCancelAxios = (): [Source] => {
  const source = axios.CancelToken.source();
  return [source];
};
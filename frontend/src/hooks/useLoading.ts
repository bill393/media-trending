/**
 * @file hooks 对象
 */

import {useState} from 'react';

export interface LoadingState {
  [propName: string]: boolean
};

export const useLoading = (loadingState: LoadingState): [LoadingState, Function] => {
  const [loading, setLoading] = useState(loadingState);
  const _setLoading = (state: LoadingState): void => {
      const _loading = JSON.parse(JSON.stringify(loading));
      for (const key in state) {
          _loading[key] = state[key];
      }
      setLoading(_loading);
  };
  return [loading, _setLoading];
};

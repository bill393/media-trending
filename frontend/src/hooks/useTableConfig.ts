/**
 * @file hooks table配置
 */

import {useState} from 'react';

export interface TableConfigState {
  count: number,
  page: number,
  size: number
};
export const useTableConfig = (tableConfigState: TableConfigState): [TableConfigState, Function] => {
  const [tableConfig, setTableConfig] = useState(tableConfigState);
  const _setTableConfig = (state: {
      [propName: string]: number
  }): void => {
      const _tableConfig = JSON.parse(JSON.stringify(tableConfig));
      for (const key in state) {
          _tableConfig[key] = state[key];
      }
      setTableConfig(_tableConfig);
  };
  return [tableConfig, _setTableConfig];
};

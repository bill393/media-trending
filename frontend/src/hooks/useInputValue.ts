/**
 * @file hooks 输入框值
 */

import {useState, useCallback} from 'react';

export type ChangeEvent = {
  target: {value: string}
};

export type UseInputValue = [
  string,
  (e: ChangeEvent) => void
];

export const useInputValue = (defaultValue: string = ''): UseInputValue => {
  const [value, setValue] = useState(defaultValue);
  const onChange = useCallback((event: ChangeEvent) => {
    setValue(event.target.value);
  }, []);
  return [value, onChange];
};

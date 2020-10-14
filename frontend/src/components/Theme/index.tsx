/**
 * @file 主题context
 */

import React, {useState} from 'react';
import themeContext, {Theme, themes} from './theme';

export type ThemeComponentProps = {
  children: React.ReactNode
};

const ThemeComponent: React.FC<ThemeComponentProps> = props => {
  const [theme, setTheme] = useState<Theme>(themes.light);
  return (
    <themeContext.Provider value={{theme, setTheme}}>
      {props.children}
    </themeContext.Provider>
  );
};

export default ThemeComponent;

/**
 * @file 主题
 */

import React from 'react';

export type Theme = {
  backgroundColor: string,
  color: string
};

export type Themes = {
  [key: string]: Theme
};

export const themes: Themes = {
  light: {backgroundColor: '#f7d639', color: '#fff'}
};

export type ThemeContext = {
  setTheme: Function,
  theme: Theme
};

const themeContext = React.createContext<ThemeContext>({
  theme: themes.light,
  setTheme: () => {}
});
themeContext.displayName = 'theme';

export default themeContext;

/**
 * @file 主页面
 */

import React, {useState, useCallback} from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import './index.less';

export type NavStyle = 'default' | 'mini';

const App: React.FC = () => {
  const [navStyle, setNavStyle] = useState<NavStyle>('default');
  const changeNavStyle = useCallback(() => {
    setNavStyle(navStyle === 'default' ? 'mini' : 'default');
  }, [navStyle, setNavStyle]);
  return (
    <div className="app">
      <Header navStyle={navStyle} changeNavStyle={changeNavStyle}></Header>
      <Content navStyle={navStyle}></Content>
      <Footer></Footer>
    </div>
  );
};

export default App;

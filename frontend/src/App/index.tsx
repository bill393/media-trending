/**
 * @file 主页面
 */

import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import './index.less';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header></Header>
      <Content></Content>
      <Footer></Footer>
    </div>
  );
};

export default App;

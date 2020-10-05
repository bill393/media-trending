/**
 * @file 主页面
 */

import React from 'react';
import Header from './components/Header';
import Content from './components/Content';

const App: React.FC<{title: string}> = () => {
  return (
    <div className="app">
      <Header></Header>
      <Content></Content>
    </div>
  );
};

export default App;

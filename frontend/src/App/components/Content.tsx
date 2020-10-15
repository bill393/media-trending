/**
 * @file 内容组件
 */

import React from 'react';
import {Switch, Route} from 'react-router-dom'
import {NavStyle} from '../index';
import './index.less';

const Home = React.lazy(() => import('@/pages/Home'));

export type ContentProps = {
  navStyle: NavStyle
};

const Content: React.FC<ContentProps> = ({navStyle}) => {
  return (
    <div className={`content${navStyle === 'mini' ? ' content-small' : ''}`}>
      <React.Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route path="/home" component={Home}></Route>
        </Switch>
      </React.Suspense>
    </div>
  );
};

export default Content;
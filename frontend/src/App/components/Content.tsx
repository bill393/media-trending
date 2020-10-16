/**
 * @file 内容组件
 */

import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import LazyLoad, {SuspenseLoading} from '@/components/LazyLoad';
import {NavStyle} from '../index';
import './index.less';

const Home = LazyLoad(() => import('@/pages/Home'));

export type ContentProps = {
  navStyle: NavStyle
};

const Content: React.FC<ContentProps> = ({navStyle}) => {
  return (
    <div className={`content${navStyle === 'mini' ? ' content-small' : ''}`}>
      <SuspenseLoading size="large">
        <Redirect from="/" to="/home"></Redirect>
        <Switch>
          <Route path="/home" component={Home}></Route>
        </Switch>
      </SuspenseLoading>
    </div>
  );
};

export default Content;
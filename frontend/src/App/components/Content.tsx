/**
 * @file 内容组件
 */

import React from 'react';
import {Divider} from 'antd';
import {NavStyle} from '../index';
import './index.less';

export type ContentProps = {
  navStyle: NavStyle
};

const Content: React.FC<ContentProps> = ({navStyle}) => {
  return (
    <div className={`content${navStyle === 'mini' ? ' content-small' : ''}`}>
      <Divider className="content-divider" plain>各大媒体平台热搜榜</Divider>
    </div>
  );
};

export default Content;
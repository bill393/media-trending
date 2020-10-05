/**
 * @file 内容组件
 */

import React from 'react';
import {Divider} from 'antd';
import './index.less';

const Content: React.FC = () => {
  return (
    <div className="content">
      <Divider className="content-divider" plain>各大媒体平台热搜榜</Divider>
    </div>
  );
};

export default Content;
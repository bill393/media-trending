/**
 * @file iconfont图标组件
 */

import React from 'react';

export type IconProps = {
  id: string,
  className?: string
};

const Icon: React.FC<IconProps> = ({id, className}) => {
  return (
    <svg className={className ? `${className} icon` : 'icon'} aria-hidden="true">
      <use xlinkHref={`#${id}`}></use>
    </svg>
  );
};

export default Icon;

/**
 * @file 外链
 */

import React from 'react';

export type OutlinkProps = {
  href: string,
  style?: {
    [key: string]: string | number
  },
  className?: string,
  props?: {
    [key: string]: string
  },
  children?: React.ReactNode
};

const Outlink: React.FC<OutlinkProps> = ({style = {}, href, className, children, props = {}}) => {
  return (
    <a style={style} className={className} href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

export default Outlink;

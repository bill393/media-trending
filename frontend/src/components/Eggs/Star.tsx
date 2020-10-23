/**
 * @file 彩蛋组件 星星
 */

import React, {useEffect, useState} from 'react';
import './index.less';

export type StarProps = {
  top: number,
  left: number,
  defaultValue?: boolean,
  unblinkColor?: string,
  blinkColor?: string
};

export const StarComponent: React.FC<StarProps> = ({top, left, defaultValue = false, unblinkColor = '#fff', blinkColor = '#3d98ce'}) => {
  const [blink, setBlink] = useState<boolean>(false);
  const color: string = blink ? blinkColor : unblinkColor;
  const clickStar = () => {
    setBlink(!blink);
  };
 
  useEffect(() => {
    if (defaultValue) {
      window.requestAnimationFrame(() => {
        setBlink(true);
      });
    }
  }, []);

  return (
      <div
        style={{
          top,
          left
        }}
        className="star"
        onClick={clickStar}>
        <div style={{borderRightColor: color}} className="star-fragment star-fragment-left"></div>
        <div style={{borderLeftColor: color}} className="star-fragment star-fragment-right"></div>
      </div>
  );
};

export const Star = React.memo(StarComponent);

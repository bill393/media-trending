/**
 * @file 顶部栏
 */

import React, {useCallback, useContext, useEffect} from 'react';
import {Input} from 'antd';
import {useInputValue} from '@/hooks';
import {getScrollTop} from '@/utils';
import {NavStyle} from '../index';
import themeContext, {ThemeContext} from '@/components/Theme/theme';
import {Star} from '@/components/Eggs';
import './index.less';

export type HeaderProps = {
  navStyle: NavStyle,
  changeNavStyle: Function
};

const stars = [
  {top: 80, left: 182},
  {top: 50, left: 430},
  {top: 150, left: 70}
];

const Header: React.FC<HeaderProps> = ({navStyle, changeNavStyle}) => {
  const [searchText, onChange] = useInputValue();
  const {theme} = useContext<ThemeContext>(themeContext);
  const isDefaultNavStyle = navStyle === 'default';
  const navClass = isDefaultNavStyle ? 'nav' : 'nav-small';
  const onSearch = useCallback((value: string) => {
    console.log(value);
  }, []);

  useEffect(() => {
    let lock: boolean = false;
    const onScrollInnerEvent = (): void => {
      const scrollTop: number = getScrollTop();
      if (
        (scrollTop >= 50 && navClass === 'nav')
          || (scrollTop <= 0 && navClass === 'nav-small')
      ) {
        changeNavStyle();
      }
      lock = false;
    };
    const onScrollEvent = (): void => {
      if (!lock) {
        window.requestAnimationFrame(onScrollInnerEvent);
        lock = true;
      }
    };
    window.addEventListener('scroll', onScrollEvent);
    return () => {
      window.removeEventListener('scroll', onScrollEvent);
    };
  }, [navClass, changeNavStyle]);

  return (
    <nav style={theme} className={`nav-default ${navClass}`}>
      <div className="nav-logo">
        <span className="nav-logo-first">T</span>
        <span>rending</span>
        <span className="nav-logo-desc">世界尽收眼底</span>
        {
          isDefaultNavStyle && (
            stars.map(starProps => <Star defaultValue unblinkColor={theme.backgroundColor} blinkColor={theme.color} {...starProps}></Star>)
          )
        }
      </div>
      <div className="nav-body">
        <div className="nav-body-container">
          <Input.Search className="search-input" value={searchText} size={navClass === 'nav' ? 'large' : 'middle'} onChange={onChange} onSearch={onSearch}></Input.Search>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Header);

/**
 * @file 顶部栏
 */

import React, {useState, useCallback, useContext, useEffect} from 'react';
import {Input} from 'antd';
import {useInputValue} from '@/hooks';
import {getScrollTop} from '@/utils';
import themeContext, {ThemeContext} from '@/components/Theme/theme';
import './index.less';

const Header: React.FC = () => {
  const [navClass, setNavClass] = useState<string>('nav');
  const [searchText, onChange] = useInputValue();
  const {theme} = useContext<ThemeContext>(themeContext);
  const onSearch = useCallback((value: string) => {
    console.log(value);
  }, []);

  useEffect(() => {
    const scrollEvent = (): void => {
      const scrollTop: number = getScrollTop();
      if (scrollTop >= 150 && navClass === 'nav') {
        setNavClass('nav-small');
      }
      else if (scrollTop < 100 && navClass === 'nav-small') {
        setNavClass('nav');
      }
    };
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [navClass, setNavClass]);

  return (
    <nav style={theme} className={navClass}>
      <div className="nav-logo">
        <span className="nav-logo-first">T</span>
        <span>rending</span>
        <span className="nav-logo-desc">世界尽收眼底</span>
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

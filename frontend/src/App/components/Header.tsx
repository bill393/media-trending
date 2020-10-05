/**
 * @file 顶部栏
 */

import React, {useCallback} from 'react';
import {Input} from 'antd';
import {useInputValue} from '@/hooks';
import './index.less';

const Header: React.FC = () => {
  const [searchText, onChange] = useInputValue();
  const onSearch = useCallback((value: string) => {
    console.log(value);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-logo">MEDIA TRENDING</div>
      <div className="nav-body">
        <Input.Search className="search-input" value={searchText} onChange={onChange} onSearch={onSearch}></Input.Search>
      </div>
    </nav>
  );
};

export default Header;

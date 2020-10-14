import React, {useContext} from 'react';
import themeContext, {ThemeContext} from '@/components/Theme/theme';
import './index.less';

const links = [
  {label: '博客', value: 'http://www.ruofee.cn'},
  {label: '网易云数据分析', value: 'http://cloudmusic.ruofee.cn'},
  {label: '控制台小游戏', value: 'http://loggame.ruofee.cn/'}
];

const Footer: React.FC = () => {
  const {theme} = useContext<ThemeContext>(themeContext);
  console.log('theme');
  return (
    <div style={theme} className="footer">
      <div style={theme} className="footer-links-wrap">
        <div className="footer-links-header">相关链接</div>
        <ul className="footer-links-content">
          {
            links.map(link => {
              return (
                <li className="footer-link-wrap" key={link.value}>
                  <span>{link.label}: </span>
                  <a style={theme} href={link.value} target="_blank" rel="noopener noreferrer">{link.value}</a>
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Footer);

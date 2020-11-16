/**
 * @file 网站
 */

import React from 'react';
import {Website as WebsiteCardProps} from '@/API/Info';
import Outlink from '@/components/Outlink';
import Icon from '@/components/Icon';
import Ranking from './Ranking';
import './index.less';

const WebsiteCard: React.FC<WebsiteCardProps> = ({website, rankings}) => {
  return (
    <div className="website">
      <div className="website-title">
        <div className="icon-wrap">
          <Icon id={website.icon}></Icon>
        </div>
        <div className="website-title-text">{website.description}</div>
        <div className="link-wrap">
          <Outlink href={website.url}>
            <Icon id="icon-wailian"></Icon>
          </Outlink>
        </div>
      </div>
      <div className="website-rankings">
        {
          rankings.map(ranking => {
            return (
              <div className="website-ranking" key={ranking.desc.id}>
                <Ranking ranking={ranking}></Ranking>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default WebsiteCard;

/**
 * @file 排行榜
 */

import React from 'react';
import {Tooltip} from 'antd';
import {Desc, RankingItem} from '@/API/Info';
import Icon from '@/components/Icon';
import OutLink from '@/components/Outlink';

export type RankingProps = {
  ranking: {
    desc: Desc,
    list: Array<RankingItem>
  }
};

const defaultDesc: Desc = {
  id: 0,
  name: '',
  type: '',
  websiteId: 0
};
const defaultList: Array<RankingItem> = [];

type RankingRowType = 'head' | 'row';
const keyToClass = {
  top: 'ranking-item-top',
  content: 'ranking-item-content',
  project: 'ranking-item-content',
  other: 'ranking-item-box'
};
const keyToTitle = {
  content: '标题',
  project: '项目名',
  number: '数量',
  followCount: '关注数',
  answerCount: '回答数',
  score: '分数',
  member: '成员数',
  playNumber: '播放数',
  comment: '评论数',
  fork: 'Fork',
  star: 'Star'
};
const needKeys = Object.keys(keyToTitle);

// 每一行组件
const RankingRow: React.FC<{
  type: RankingRowType,
  data: RankingItem,
  top?: number
}> = ({type = 'row', data = {}, top}) => {
  type RankingItemKey = keyof RankingItem;
  type keyToTitleKey = keyof typeof keyToTitle;
  return (
    <li className="ranking-item">
      {<span className={keyToClass.top}>{top || '排名'}</span>}
      {
        needKeys.map(key => {
          const className = `${keyToClass[key as keyof typeof keyToClass] || keyToClass.other} ranking-item-common`;
          return (
            data[key as RankingItemKey]
              && (
                type === 'head'
                  ? <span className={className} key={key}>{keyToTitle[key as keyToTitleKey]}</span>
                  : <OutLink className={className} href={data.url || ''}>
                    <span key={key} title={`${data[key as RankingItemKey]}`}>{data[key as RankingItemKey]}</span>
                  </OutLink>
              )
          );
        })
      }
    </li>
  );
};

const Ranking: React.FC<RankingProps> = ({ranking}) => {
  const desc = ranking.desc || defaultDesc;
  const list = ranking.list || defaultList;
  return (
    <div className="ranking">
      <div className="ranking-title">
        <span>{desc.name}</span>
        <div className="ranking-menu">
          <Tooltip title="订阅">
            <div className="ranking-menu-icon-wrap">
              <Icon className="ranking-menu-icon" id="icon-star"></Icon>
            </div>
          </Tooltip>
          <Tooltip title="隐藏">
            <div className="ranking-menu-icon-wrap">
              <Icon className="ranking-menu-icon" id="icon-hulve"></Icon>
            </div>
          </Tooltip>
          <Tooltip title="更多">
            <div className="ranking-menu-icon-wrap">
              <OutLink href="http://ruofee.cn">
                <Icon className="ranking-menu-icon" id="icon-jiebantubiao-"></Icon>
              </OutLink>
            </div>
          </Tooltip>
        </div>
      </div>
      <ul className="ranking-list">
        {
          <RankingRow type="head" data={list[0]}></RankingRow>
        }
        {
          list.map((item, index) => {
            return (
              <RankingRow type="row" data={item} top={index + 1} key={item.id}></RankingRow>
            );
          })
        }
      </ul>
    </div>
  );
};

export default React.memo(Ranking);

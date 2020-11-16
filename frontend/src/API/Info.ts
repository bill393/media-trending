/**
 * @file 获取信息接口
 */

import axios from '@/utils/http';
import {APIProps, API} from './index';

export type Desc = {
  id: number
  name: string,
  type: string,
  websiteId: number
};

export type RankingItem = {
  id: number,
  content: string,
  date: Date | string,
  top: number,
  type: string,
  url: string,
  number: number | string,
  // 知乎
  followCount: number,
  answerCount: number,
  // 豆瓣
  score: number,
  // 百度
  member: number | string,
  // bilibili
  playNumber: number | string,
  comment: number | string,
  // github
  fork: number,
  star: number
};

export type Ranking = {
  desc: Desc,
  list: Array<RankingItem>
};

export type Website = {
  website: {
    id: number,
    name: string,
    url: string,
    description: string,
    icon: string
  },
  rankings: Array<Ranking>
};

export type GetWebsites = {
  page: number,
  size: number
};

export type GetWebsitesResponse = {
  count: number,
  list: Array<Website>
};

export const getWebsites = (props: APIProps<GetWebsites>): API<GetWebsitesResponse> => {
  const data = {
    params: props.payload,
    cancelToken: props.cancelToken
  };
  return axios.get('/v1/websites/ranking', data);
};
/**
 * @file 路由-首页
 */

import React, {useState, useEffect, useCallback} from 'react';
import {Divider, Spin} from 'antd';
import {useTableConfig, useLoading} from '@/hooks/index';
import {getWebsites as getWebsitesAPI, Website} from '@/API/Info';
import WebsiteCard from './components/WebsiteCard';
import './index.less';

const Home: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useLoading({websites: false});
  const [config, setConfig] = useTableConfig({page: 1, size: 10, count: 0});
  const getWebsites = useCallback(() => {
    const payload = {
      page: config.page,
      size: config.size
    };
    setLoading({websites: true});
    return getWebsitesAPI({payload})
      .then(({count = 0, list = []}) => {
        setWebsites(websites.concat(list));
        setConfig({count});
      }).finally(() => {
        setLoading({websites: false});
      });
  }, [websites, setConfig, setLoading, config.page, config.size]);

  useEffect(() => {
    getWebsites();
  }, []);

  return (
    <div className="home">
      <Divider className="content-divider" plain>各大平台热搜榜</Divider>
      <div className="websites">
        {
          loading.websites
            ? <div className="loading-wrap"><Spin size="large"></Spin></div>
            : (
              websites.map(website => <WebsiteCard {...website} key={website.website.id}></WebsiteCard>)
            )
        }
      </div>
    </div>
  );
};

export default Home;

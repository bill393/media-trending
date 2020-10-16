/**
 * @file 路由懒加载
 */

import React, {ComponentType, ReactNode, Suspense} from 'react';
import {Spin} from 'antd';
import './index.less';

type SpinSize = 'default' | 'small' | 'large';
type LoadingProps = {
    size: SpinSize
};
const Loading: React.FC<LoadingProps> = ({size}) => {
    return (
        <div className="loading">
            <Spin size={size}></Spin>
        </div>
    );
};

export type SuspenseLoadingProps = {
    children: ReactNode,
    size?: SpinSize
};
export const SuspenseLoading: React.FC<SuspenseLoadingProps> = ({children, size}) => {
    return <Suspense fallback={<Loading size={size || 'default'} />}>{children}</Suspense>;
};

type LazyComponent = {
    (): Promise<{default: ComponentType<any>}>
};
export default (component: LazyComponent) => {
    return React.lazy(component);
};


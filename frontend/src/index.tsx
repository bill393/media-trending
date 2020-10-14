import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import Theme from '@/components/Theme';
import store from '@/store';
import App from '@/App';
import * as serviceWorker from './serviceWorker';
import '@/assets/css/main.less';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Theme>
        <App></App>
      </Theme>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

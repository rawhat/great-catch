import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import reducers from './reducers/index';
import routes from './routes';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>
    </Provider>
, document.querySelector('#app'));

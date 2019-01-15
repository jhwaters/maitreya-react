import React from 'react';
import Root from './containers/Root';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

const App = () => <Root store={store} />

export default App;
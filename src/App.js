import React from 'react';
import Root from './containers/Root';
import { createStore } from 'redux';
import rootReducer from './reducers';
import initialize from './initialize'


const store = initialize(createStore(rootReducer));

const App = () => <Root store={store} />

export default App;
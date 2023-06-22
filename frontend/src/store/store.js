import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';

import mainReducer from './reducer';

const store = configureStore({
      reducer: {
        mainReducer
      }  
    },
    composeWithDevTools()
);

export default store;
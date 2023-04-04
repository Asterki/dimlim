import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';

import pageReducer from './pageSlice';

// const reducers = combineReducers({
// 	page: pageReducer,
// });

// const persistConfig = {
// 	key: 'root',
// 	storage,
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: {
		page: pageReducer,
	},
	devTools: process.env.NODE_ENV == 'development' ? true : false,
	middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
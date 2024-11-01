import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './features/auth';
import { contactsReducer } from './features/contacts';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../../../shared/types/models';

interface AuthState {
  currentUser: User | null;
  authStatus: 'authenticated' | 'unauthenticated' | 'loading' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  authStatus: 'unauthenticated',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.authStatus = 'authenticated';
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.authStatus = 'unauthenticated';
      state.error = null;
    },
    setAuthStatus: (state, action: PayloadAction<'authenticated' | 'unauthenticated' | 'loading' | 'error'>) => {
      state.authStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, login, logout, setAuthStatus, setError } = authSlice.actions;
export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { loadSession } from '../utils/authStorage';
import { authReducer, setCredentials } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const savedSession = loadSession();
if (savedSession?.accessToken && savedSession.user) {
  store.dispatch(setCredentials(savedSession));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

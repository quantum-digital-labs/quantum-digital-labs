import { configureStore } from '@reduxjs/toolkit';
import { restoreSession } from '../services/authApi';
import { supabase } from '../lib/supabaseClient';
import { authReducer, clearCredentials, setCredentials } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Restore any existing Supabase session on boot (e.g. a returning user with
// a valid refresh token, or landing here right after clicking an email
// confirmation link).
void restoreSession().then((session) => {
  if (session) {
    store.dispatch(setCredentials(session));
  }
});

// Keep the Redux auth state in sync with the real Supabase session for the
// lifetime of the app (sign-in elsewhere, token refresh, sign-out, etc.).
supabase.auth.onAuthStateChange((_event, session) => {
  if (!session?.user) {
    store.dispatch(clearCredentials());
    return;
  }
  void restoreSession().then((restored) => {
    if (restored) store.dispatch(setCredentials(restored));
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

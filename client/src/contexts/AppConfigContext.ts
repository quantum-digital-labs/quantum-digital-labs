import { createContext, useContext } from 'react';

export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
}

export const defaultAppConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050/api',
  appName: 'Quantum Digital Labs',
};

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig(): AppConfig {
  return useContext(AppConfigContext);
}

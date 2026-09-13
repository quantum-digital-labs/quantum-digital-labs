import { createContext, useContext } from 'react';

export interface AppConfig {
  appName: string;
}

export const defaultAppConfig: AppConfig = {
  appName: 'Quantum Digital Labs',
};

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig(): AppConfig {
  return useContext(AppConfigContext);
}

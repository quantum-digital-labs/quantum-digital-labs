import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AuthBootstrap } from './components/auth/AuthBootstrap';
import { AppConfigContext, defaultAppConfig } from './contexts';
import { MyApplicationsProvider } from './hooks';
import { AppRouter } from './routes';
import { store } from './store';
import { theme } from './theme';

function App() {
  return (
    <ReduxProvider store={store}>
      <AppConfigContext.Provider value={defaultAppConfig}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AuthBootstrap>
              <MyApplicationsProvider>
                <AppRouter />
              </MyApplicationsProvider>
            </AuthBootstrap>
          </BrowserRouter>
        </ThemeProvider>
      </AppConfigContext.Provider>
    </ReduxProvider>
  );
}

export default App;

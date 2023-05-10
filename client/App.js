import React from 'react';
import { hot } from 'react-hot-loader';
import MainRouter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from "../config/config";

const stripePromise = loadStripe(config.stripe_test_api_key);

const App = () => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Elements stripe={stripePromise}></Elements>
        <MainRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default hot(module)(App);

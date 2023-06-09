import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import template from './../template';
import devBundle from './devBundle';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import shopRoutes from './routes/shop.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes';
//server-side rendering
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import MainRouter from './../client/MainRouter';
import { ServerStyleSheets } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from './../client/theme';
import config from '../config/config';
//end
import Stripe from 'stripe';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

export const stripe = new Stripe(config.stripe_test_secret_key, {
  apiVersion: '2020-03-02',
});

// comment out before building
devBundle.compile(app);

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// // secure apps by setting various HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'",  'https://js.stripe.com'],
      workerSrc: ['blob:'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: [
        "'self'",
        'https://checkout.stripe.com',
      ],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
    },
  })
);
// enable CORS - Cross Origin Resource Sharing
app.use(cors({ origin: true }));

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

//mount routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', shopRoutes);
app.use('/', productRoutes);
app.use('/',orderRoutes);

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       'script-src': [
//         "'self'",
//         'https://js.stripe.com',
//         'https://js.stripe.com/v3/',
//       ],
//       'frame-src': [
//         "'self'",
//         'https://js.stripe.com',
//         'https://hooks.stripe.com',
//       ],
//       'connect-src': [
//         "'self'",
//         'https://api.stripe.com',
//         'https://maps.googleapis.com',
//       ],
//       'style-src': [
//         "'self'",
//         "'unsafe-inline'",
//         'https://fonts.googleapis.com',
//       ],
//       'font-src': ["'self'", 'https://fonts.gstatic.com'],
//     },
//   })
// );

app.get('*', (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheets.toString();
  res.status(200).send(
    template({
      markup: markup,
      css: css,
    })
  );
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});

export default app;

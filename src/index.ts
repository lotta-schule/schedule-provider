try {
    require('dotenv').config();
} catch {
    console.warn('.env config failed.');
}
import { init } from '@sentry/node';
import { App } from './App';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.APP_ENVIRONMENT ?? process.env.NODE_ENV
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new App();

app.listen(port);

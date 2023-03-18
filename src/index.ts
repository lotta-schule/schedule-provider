try {
  require("dotenv").config();
} catch {
  console.warn(".env config failed.");
}
import { init } from "@sentry/node";
import { App } from "./App";

const imageName = process.env.IMAGE_NAME || "test";

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.APP_ENVIRONMENT ?? process.env.NODE_ENV,
    release: imageName.split(":")[1],
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = new App();

app.listen(port);

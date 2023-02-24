// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
  export interface ProcessEnv {
    SENTRY_DSN?: string;
    APP_ENVIRONMENT?: string;
  }
}

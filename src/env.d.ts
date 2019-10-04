// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
    export interface ProcessEnv {
        HONEYBADGER_API_KEY?: string;
        APP_ENVIRONMENT?: string;
    }
}
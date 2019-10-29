import Express, { Application } from 'express';
import morgan from 'morgan';
import { createServer } from 'http';
import { Indiware } from './scheduleSources/Indiware';
import { ScheduleOptionsSource } from './model/ScheduleOptions';

export class App {
    private expressApp: Application = Express();

    public get app(): Application {
        return this.expressApp;
    }

    constructor() {
        if (process.env.HONEYBADGER_API_KEY) {
            // tslint:disable-next-line:no-var-requires
            const Honeybadger = require('honeybadger').configure({
                apiKey: process.env.HONEYBADGER_API_KEY,
                environment: process.env.APP_ENVIRONMENT
            });

            this.expressApp.use(Honeybadger.requestHandler);
            this.setMiddlewares();
            this.expressApp.use(Honeybadger.errorHandler);
        } else {
            this.setMiddlewares();
        }
    }

    public listen(port: number): void {
        createServer(this.app).listen(port);
    }

    private setMiddlewares() {
        this.expressApp.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { skip: () => process.env.NODE_ENV === 'test' }));
        this.expressApp.get('/schedule.json', async (request, response, next) => {
            const schoolId = request.query.schoolId;
            const username = request.query.username;
            const password = request.query.password;
            const className = request.query.class;
            const source = request.query.source as ScheduleOptionsSource;

            try {
                const schedule = await Indiware.getSchedule({
                    class: className,
                    source,
                    configuration: { schoolId, username, password }
                });
                response
                    .header('Content-Type', 'application/json')
                    .send(schedule);
            } catch (e) {
                response.sendStatus(400);
            }
        });
    };
}

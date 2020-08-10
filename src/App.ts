import Express, { Application } from 'express';
import * as Sentry from '@sentry/node';
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
        if (process.env.SENTRY_DSN) {
            this.expressApp.use(Sentry.Handlers.requestHandler());
            this.setMiddlewares();
            this.expressApp.use(Sentry.Handlers.errorHandler());
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
            const schoolId = request.query.schoolId as string;
            const username = request.query.username as string;
            const password = request.query.password as string;
            const className = request.query.class as string;
            const date = request.query.date as string; // date in format YYYYMMDD
            const source = request.query.source as ScheduleOptionsSource;

            try {
                const schedule = await Indiware.getSchedule({
                    class: className,
                    date,
                    source,
                    configuration: { schoolId, username, password }
                });
                response
                    .header('Content-Type', 'application/json')
                    .send(schedule);
            } catch (e) {
                console.error(e);
                response.sendStatus(400);
            }
        });
    };
}

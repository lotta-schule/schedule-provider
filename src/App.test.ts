import { App } from './App';
import request from 'supertest';
import { ScheduleOptionsSource } from './model/ScheduleOptions';
import { resolve } from 'path';
import nock from 'nock';

describe('web server', () => {
    const app = new App();
    it('should show a 404 on homepage', async done => {
        const res = await request(app.app)
            .get('/')
            .send();
        expect(res.status).toEqual(404);
        done();
    });

    it('should return a valid status 200 json schedule', async done => {
        nock('https://www.stundenplan24.de')
            .get('/10107295/mobil/mobdaten/Klassen.xml')
            .basicAuth({ user: 'schueler', pass: '123' })
            .replyWithFile(200, resolve(process.cwd(), 'test/mock/indiware/Klassen.xml'), {
                'Content-Type': 'application/xml'
            });
        const res = await request(app.app)
            .get('/schedule.json')
            .query({
                class: '5/4',
                source: ScheduleOptionsSource.INDIWARE_STUDENT,
                schoolId: '10107295',
                username: 'schueler',
                password: '123'
            })
            .send();
        expect(res.status).toEqual(200);
        done();
    });
});
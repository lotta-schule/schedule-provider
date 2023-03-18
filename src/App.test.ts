import { App } from './App';
import { ScheduleOptionsSource } from './model/ScheduleOptions';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import request from 'supertest';
import nock from 'nock';

describe('web server', () => {
  const app = new App();
  it('should show a 404 on homepage', async () => {
    const res = await request(app.app).get('/').send();
    expect(res.status).toEqual(404);
  });

  it('should return a valid status 200 json schedule', async () => {
    nock('https://www.stundenplan24.de')
      .get('/10107295/mobil/mobdaten/Klassen.xml')
      .basicAuth({ user: 'schueler', pass: '123' })
      .reply(
        200,
        readFileSync(resolve(process.cwd(), 'test/mock/indiware/Klassen.xml')),
        {
          'Content-Type': 'application/xml',
        }
      );
    const res = await request(app.app)
      .get('/schedule.json')
      .query({
        class: '5/4',
        source: ScheduleOptionsSource.INDIWARE_STUDENT,
        schoolId: '10107295',
        username: 'schueler',
        password: '123',
      })
      .send();
    expect(res.status).toEqual(200);
  });
});

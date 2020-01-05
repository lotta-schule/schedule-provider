import nock from 'nock';
import { resolve } from 'path';
import { Indiware } from './Indiware';
import { ScheduleOptionsSource } from '../model/ScheduleOptions';
import { readFileSync } from 'fs';

describe('Indiware Student', () => {
    beforeEach(() => {
        nock('https://www.stundenplan24.de')
            .get('/10107295/mobil/mobdaten/Klassen.xml')
            .basicAuth({ user: 'schueler', pass: '123' })
            .reply(200, readFileSync(resolve(process.cwd(), 'test/mock/indiware/Klassen.xml'), { encoding: 'utf8' }));
    });
    it('should return an object with head, body and footer', async done => {
        const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
        expect(vplan).toHaveProperty('head');
        expect(vplan).toHaveProperty('body');
        expect(vplan).toHaveProperty('footer');
        done();
    });

    describe('request specific date', () => {
        beforeEach(() => {
            nock('https://www.stundenplan24.de')
                .get('/10107295/mobil/mobdaten/PlanKl20200106.xml')
                .basicAuth({ user: 'schueler', pass: '123' })
                .reply(200, readFileSync(resolve(process.cwd(), 'test/mock/indiware/PlanKl20200106.xml'), { encoding: 'utf8' }));
        });
        it('should return an object with head, body and footer', async done => {
            const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '', date: '20200106', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            expect(vplan).toHaveProperty('head');
            expect(vplan.head.filename).toEqual('PlanKl20200106.xml');
            done();
        });
    });

    describe('header data', () => {
        it('should have header data', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { head } = schedule;
            expect(head).toBeDefined();
            expect(head.date).toBeTruthy();
            expect(head.timestamp).toBeTruthy();
            expect(head.type).toEqual('K');
            expect(head.filename).toBeTruthy();
            done();
        });

        it('should have property with dates to skip', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { head } = schedule;
            expect(head.skipDates).toBeTruthy();
            expect(head.skipDates).toEqual([
                new Date(2019, 7, 1).toUTCString(),
                new Date(2019, 7, 2).toUTCString(),
                new Date(2019, 7, 5).toUTCString(),
                new Date(2019, 7, 6).toUTCString(),
                new Date(2019, 7, 7).toISOString(),
                new Date(2019, 7, 8).toISOString(),
                new Date(2019, 7, 9).toISOString(),
                new Date(2019, 7, 12).toISOString(),
                new Date(2019, 7, 13).toISOString(),
                new Date(2019, 7, 14).toISOString(),
                new Date(2019, 7, 15).toISOString(),
                new Date(2019, 7, 16).toISOString(),
                new Date(2019, 9, 3).toISOString(),
                new Date(2019, 9, 14).toISOString(),
                new Date(2019, 9, 15).toISOString(),
                new Date(2019, 9, 16).toISOString(),
                new Date(2019, 9, 17).toISOString(),
                new Date(2019, 9, 18).toISOString(),
                new Date(2019, 9, 21).toISOString(),
                new Date(2019, 9, 22).toISOString(),
                new Date(2019, 9, 23).toISOString(),
                new Date(2019, 9, 24).toISOString(),
                new Date(2019, 9, 25).toISOString(),
                new Date(2019, 9, 31).toISOString(),
                new Date(2019, 10, 20).toISOString(),
                new Date(2019, 11, 23).toISOString(),
                new Date(2019, 11, 24).toISOString(),
                new Date(2019, 11, 25).toISOString(),
                new Date(2019, 11, 26).toISOString(),
                new Date(2019, 11, 27).toISOString(),
                new Date(2019, 11, 30).toISOString(),
                new Date(2019, 11, 31).toISOString(),
                new Date(2020, 0, 1).toISOString(),
                new Date(2020, 0, 2).toISOString(),
                new Date(2020, 0, 3).toISOString(),
                new Date(2020, 1, 10).toISOString(),
                new Date(2020, 1, 11).toISOString(),
                new Date(2020, 1, 12).toISOString(),
                new Date(2020, 1, 13).toISOString(),
                new Date(2020, 1, 14).toISOString(),
                new Date(2020, 1, 17).toISOString(),
                new Date(2020, 1, 18).toISOString(),
                new Date(2020, 1, 19).toISOString(),
                new Date(2020, 1, 20).toISOString(),
                new Date(2020, 1, 21).toISOString(),
                new Date(2020, 3, 10).toISOString(),
                new Date(2020, 3, 13).toISOString(),
                new Date(2020, 3, 14).toISOString(),
                new Date(2020, 3, 15).toISOString(),
                new Date(2020, 3, 16).toISOString(),
                new Date(2020, 3, 17).toISOString(),
                new Date(2020, 4, 1).toISOString(),
                new Date(2020, 4, 21).toISOString(),
                new Date(2020, 4, 22).toISOString(),
                new Date(2020, 5, 1).toISOString(),
                new Date(2020, 6, 20).toISOString(),
                new Date(2020, 6, 21).toISOString(),
                new Date(2020, 6, 22).toISOString(),
                new Date(2020, 6, 23).toISOString(),
                new Date(2020, 6, 24).toISOString(),
                new Date(2020, 6, 27).toISOString(),
                new Date(2020, 6, 28).toISOString(),
                new Date(2020, 6, 29).toISOString(),
                new Date(2020, 6, 30).toISOString(),
                new Date(2020, 6, 31).toISOString()
            ])
            done();
        });
    });

    describe('body data', () => {
        it('should have empty body data if class is not valid', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: 'something', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            expect(body).toEqual(null);
            done();
        });

        it('should have class data', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '6/3', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            expect(body.short).toEqual('6/3')
            done();
        });

        it('show if teacher has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '6/3', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 3);
            expect(deutschKurs.lessonName).toEqual('DE');
            expect(deutschKurs.teacherHasChanged).toEqual(true);
            done();
        });

        it('show if room has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '10/2', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 5);
            expect(deutschKurs.lessonName).toEqual('BIO');
            expect(deutschKurs.roomHasChanged).toEqual(true);
            done();
        });

        it('show if lessonName has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '5/1', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 5);
            expect(deutschKurs.lessonName).toEqual('MA');
            expect(deutschKurs.lessonNameHasChanged).toEqual(true);
            done();
        });

        it('show schedule comment', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '9/1', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 6);
            expect(deutschKurs.lessonName).toEqual('GE');
            expect(deutschKurs.comment).toBeDefined();
            expect(deutschKurs.comment).toMatch('fällt aus');
            done();
        });
    });

    it('should have footer data', async done => {
        const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '11', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
        const { footer } = schedule;
        expect(footer).toBeDefined();
        expect(footer.comments.length === 3);
        expect(footer.comments[0]).toMatch('Klassenstufe 6:');
        done();
    });
});

describe('Indiware Teachers', () => {
    beforeEach(() => {
        nock('https://www.stundenplan24.de')
            .get('/10107295/moble/mobdaten/Lehrer.xml')
            .basicAuth({ user: 'lehrer', pass: '123' })
            .reply(200, readFileSync(resolve(process.cwd(), 'test/mock/indiware/Lehrer.xml'), { encoding: 'utf8' }));
    });
    it('should return an object with head, body and footer', async done => {
        const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
        expect(vplan).toHaveProperty('head');
        expect(vplan).toHaveProperty('body');
        expect(vplan).toHaveProperty('footer');
        done();
    });

    describe('request specific date', () => {
        beforeEach(() => {
            nock('https://www.stundenplan24.de')
                .get('/10107295/moble/mobdaten/PlanLe20200106.xml')
                .basicAuth({ user: 'lehrer', pass: '123' })
                .reply(200, readFileSync(resolve(process.cwd(), 'test/mock/indiware/PlanLe20200106.xml'), { encoding: 'utf8' }));
        });
        it('should return an object with head, body and footer', async done => {
            const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '', date: '20200106', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            expect(vplan).toHaveProperty('head');
            expect(vplan.head.filename).toEqual('PlanLe20200106.xml');
            done();
        });
    });

    describe('header data', () => {
        it('should have header data', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { head } = schedule;
            expect(head).toBeDefined();
            expect(head.date).toBeTruthy();
            expect(head.timestamp).toBeTruthy();
            expect(head.type).toEqual('L');
            expect(head.filename).toBeTruthy();
            done();
        });

        it('should have property with dates to skip', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { head } = schedule;
            expect(head.skipDates).toBeTruthy();
            expect(head.skipDates).toEqual([
                new Date(2019, 7, 1).toUTCString(),
                new Date(2019, 7, 2).toUTCString(),
                new Date(2019, 7, 5).toUTCString(),
                new Date(2019, 7, 6).toUTCString(),
                new Date(2019, 7, 7).toUTCString(),
                new Date(2019, 7, 8).toUTCString(),
                new Date(2019, 7, 9).toUTCString(),
                new Date(2019, 7, 12).toUTCString(),
                new Date(2019, 7, 13).toUTCString(),
                new Date(2019, 7, 14).toUTCString(),
                new Date(2019, 7, 15).toUTCString(),
                new Date(2019, 7, 16).toUTCString(),
                new Date(2019, 9, 3).toUTCString(),
                new Date(2019, 9, 14).toUTCString(),
                new Date(2019, 9, 15).toUTCString(),
                new Date(2019, 9, 16).toUTCString(),
                new Date(2019, 9, 17).toUTCString(),
                new Date(2019, 9, 18).toUTCString(),
                new Date(2019, 9, 21).toUTCString(),
                new Date(2019, 9, 22).toUTCString(),
                new Date(2019, 9, 23).toUTCString(),
                new Date(2019, 9, 24).toUTCString(),
                new Date(2019, 9, 25).toUTCString(),
                new Date(2019, 9, 31).toUTCString(),
                new Date(2019, 10, 20).toUTCString(),
                new Date(2019, 11, 23).toUTCString(),
                new Date(2019, 11, 24).toUTCString(),
                new Date(2019, 11, 25).toUTCString(),
                new Date(2019, 11, 26).toUTCString(),
                new Date(2019, 11, 27).toUTCString(),
                new Date(2019, 11, 30).toUTCString(),
                new Date(2019, 11, 31).toUTCString(),
                new Date(2020, 0, 1).toUTCString(),
                new Date(2020, 0, 2).toUTCString(),
                new Date(2020, 0, 3).toUTCString(),
                new Date(2020, 1, 10).toUTCString(),
                new Date(2020, 1, 11).toUTCString(),
                new Date(2020, 1, 12).toUTCString(),
                new Date(2020, 1, 13).toUTCString(),
                new Date(2020, 1, 14).toUTCString(),
                new Date(2020, 1, 17).toUTCString(),
                new Date(2020, 1, 18).toUTCString(),
                new Date(2020, 1, 19).toUTCString(),
                new Date(2020, 1, 20).toUTCString(),
                new Date(2020, 1, 21).toUTCString(),
                new Date(2020, 3, 10).toUTCString(),
                new Date(2020, 3, 13).toUTCString(),
                new Date(2020, 3, 14).toUTCString(),
                new Date(2020, 3, 15).toUTCString(),
                new Date(2020, 3, 16).toUTCString(),
                new Date(2020, 3, 17).toUTCString(),
                new Date(2020, 4, 1).toUTCString(),
                new Date(2020, 4, 21).toUTCString(),
                new Date(2020, 4, 22).toUTCString(),
                new Date(2020, 5, 1).toUTCString(),
                new Date(2020, 6, 20).toUTCString(),
                new Date(2020, 6, 21).toUTCString(),
                new Date(2020, 6, 22).toUTCString(),
                new Date(2020, 6, 23).toUTCString(),
                new Date(2020, 6, 24).toUTCString(),
                new Date(2020, 6, 27).toUTCString(),
                new Date(2020, 6, 28).toUTCString(),
                new Date(2020, 6, 29).toUTCString(),
                new Date(2020, 6, 30).toUTCString(),
                new Date(2020, 6, 31).toUTCString()
            ])
            done();
        });
    });

    describe('body data', () => {
        it('should have empty body data if class is not valid', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'something', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { body } = schedule;
            expect(body).toEqual(null);
            done();
        });

        it('should have class data', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'All', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { body } = schedule;
            expect(body.short).toEqual('All')
            done();
        });

        it('show if teacher has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'Sat', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 5);
            expect(deutschKurs.lessonName).toEqual('EthK');
            expect(deutschKurs.teacherHasChanged).toEqual(true);
            done();
        });

        it('show if room has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'Brü', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 3);
            expect(deutschKurs.lessonName).toEqual('---');
            expect(deutschKurs.roomHasChanged).toEqual(true);
            done();
        });

        it('show if lessonName has changed', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'Grü', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { body } = schedule;
            const deutschKurs = body.schedule.find(schedule => schedule.lessonIndex === 3);
            expect(deutschKurs.lessonName).toEqual('---');
            expect(deutschKurs.lessonNameHasChanged).toEqual(true);
            done();
        });
    });

    describe('footer data', () => {
        it('should have footer data', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'Har', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { footer } = schedule;
            expect(footer).toBeDefined();
            done();
        });

        it('should have supervision data if there is any', async done => {
            const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: 'Har', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
            const { footer } = schedule;
            expect(footer.supervisions).toBeDefined();
            expect(footer.supervisions.length).toEqual(1);
            expect(footer.supervisions[0]).toEqual({ time: '13:00', location: 'Haus D' });
            expect(footer).toBeDefined();
            done();
        });

    });
});
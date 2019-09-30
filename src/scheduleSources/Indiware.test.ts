import nock from 'nock';
import { resolve } from 'path';
import { Indiware } from './Indiware';
import { ScheduleOptionsSource } from '../model/ScheduleOptions';

describe('Indiware Student', () => {
    beforeEach(() => {
        nock('https://www.stundenplan24.de')
            .get('/10107295/mobil/mobdaten/Klassen.xml')
            .basicAuth({ user: 'schueler', pass: '123' })
            .replyWithFile(200, resolve(process.cwd(), 'test/mock/indiware/Klassen.xml'), {
                'Content-Type': 'application/xml'
            });
    });
    it('should return an object with head, body and footer', async done => {
        const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_STUDENT, class: '', configuration: { schoolId: '10107295', username: 'schueler', password: '123' } });
        expect(vplan).toHaveProperty('head');
        expect(vplan).toHaveProperty('body');
        expect(vplan).toHaveProperty('footer');
        done();
    });

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
            .replyWithFile(200, resolve(process.cwd(), 'test/mock/indiware/Lehrer.xml'), {
                'Content-Type': 'application/xml'
            });
    });

    it('should return an object with head, body and footer', async done => {
        const vplan = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '11', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
        expect(vplan).toHaveProperty('head');
        expect(vplan).toHaveProperty('body');
        expect(vplan).toHaveProperty('footer');
        done();
    });

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

    it('should have footer data', async done => {
        const schedule = await Indiware.getSchedule({ source: ScheduleOptionsSource.INDIWARE_TEACHER, class: '11', configuration: { schoolId: '10107295', username: 'lehrer', password: '123' } });
        const { footer } = schedule;
        expect(footer).toBeDefined();
        done();
    });
});
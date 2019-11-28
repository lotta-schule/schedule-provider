import { ScheduleOptions, ScheduleOptionsSource } from '../model/ScheduleOptions';
import { parseStringPromise } from 'xml2js';
import { ScheduleResultHead, ScheduleResultBody, ScheduleResultFooter } from '../model/ScheduleResult';
import { ScheduleResult } from '../model/ScheduleResult';
import axios, { AxiosRequestConfig } from 'axios';

export interface IndiwareOptions {
    schoolId: string;
    username?: string;
    password?: string;
}

interface IndiwareResult {
    VpMobil: {
        Kopf: [{
            DatumPlan: [string];
            zeitstempel: [string];
            planart: [string];
            datei: [string];
        }];
        Klassen: [{
            Kl: [{
                Kurz: [string];
                Kurse: [{
                }];
                Unterricht: [{
                }];
                Pl: [{
                    Std: {
                        St: [string];
                        Fa: [string | { $: { [key: string]: string }; _: string; }];
                        Le: [string | { $: { [key: string]: string }; _: string; }];
                        Ra: [string | { $: { [key: string]: string }; _: string; }];
                        Nr: [string];
                        If: [string];
                    }[]
                }],
                Aufsichten: [{
                    Aufsicht: [{
                        AuUhrzeit: [string];
                        AuZeit: [string];
                        AuOrt: [string];
                    }]
                }]
            }]
        }];
        ZusatzInfo: [{
            ZiZeile: string[]
        }]
    }
}

export class Indiware {
    public static async getSchedule(options: ScheduleOptions<IndiwareOptions>): Promise<ScheduleResult> {
        const plan: IndiwareResult = await Indiware.call(options);
        return {
            head: Indiware.parseKopf(plan),
            body: Indiware.parseKlassen(plan, options),
            footer: Indiware.parseFooter(plan, options)
        };
    }

    private static parseKopf(plan: IndiwareResult): ScheduleResultHead {
        const { VpMobil: { Kopf } } = plan;
        return {
            date: Kopf[0].DatumPlan[0],
            timestamp: Kopf[0].zeitstempel[0],
            type: Kopf[0].planart[0],
            filename: Kopf[0].datei[0]
        }
    }

    private static parseKlassen(plan: IndiwareResult, options: ScheduleOptions<IndiwareOptions>): ScheduleResultBody {
        const { VpMobil: { Klassen } } = plan;
        const klasse = Klassen[0].Kl.find(Kl => Kl.Kurz[0] === options.class);
        if (klasse) {
            return {
                name: klasse.Kurz[0],
                short: klasse.Kurz[0],
                schedule: klasse.Pl[0].Std.map(Std => {
                    const [lessonName, lessonNameHasChanged] = typeof Std.Fa[0] === 'string' ?
                        [Std.Fa[0], false] : [Std.Fa[0]._, true];
                    const [teacher, teacherHasChanged] = typeof Std.Le[0] === 'string' ?
                        [Std.Le[0], false] : [Std.Le[0]._, true];
                    const [room, roomHasChanged] = typeof Std.Ra[0] === 'string' ?
                        [Std.Ra[0], false] : [Std.Ra[0]._, true];
                    return {
                        id: Std.Nr[0],
                        lessonIndex: Number(Std.St[0]),
                        lessonName,
                        lessonNameHasChanged,
                        teacher,
                        teacherHasChanged,
                        room,
                        roomHasChanged,
                        comment: Std.If && Std.If[0]
                    };
                })
            };
        } else {
            return null;
        }
    }

    private static parseFooter(plan: IndiwareResult, options: ScheduleOptions<IndiwareOptions>): ScheduleResultFooter {
        const { VpMobil: { ZusatzInfo } } = plan;
        return {
            comments: ZusatzInfo && ZusatzInfo[0].ZiZeile,
            supervisions: this.parseSupervisions(plan, options)
        };
    }

    private static parseSupervisions(plan: IndiwareResult, options: ScheduleOptions<IndiwareOptions>) {
        if (options.source === ScheduleOptionsSource.INDIWARE_STUDENT) {
            return null;
        }
        const { VpMobil: { Klassen } } = plan;
        const klasse = Klassen[0].Kl.find(Kl => Kl.Kurz[0] === options.class);
        if (klasse && klasse.Aufsichten) {
            return klasse.Aufsichten.map(aufsicht => aufsicht.Aufsicht?.[0] && ({
                time: aufsicht.Aufsicht[0].AuUhrzeit[0],
                location: aufsicht.Aufsicht[0].AuOrt[0],
            }));
        }
        return null;
    }

    private static call(options: ScheduleOptions<IndiwareOptions>): Promise<any> {
        const fileName = options.source === ScheduleOptionsSource.INDIWARE_TEACHER ? 'moble/mobdaten/Lehrer.xml' : 'mobil/mobdaten/Klassen.xml';
        const url = `https://www.stundenplan24.de/${options.configuration.schoolId}/${fileName}`;
        const axiosConfig: AxiosRequestConfig = { url };
        if (options.configuration.username) {
            axiosConfig.auth = {
                username: options.configuration.username,
                password: options.configuration.password
            };
        }
        return axios(axiosConfig)
            .then(result => parseStringPromise(result.data.toString(), {}));
    }
}
export enum ScheduleOptionsSource {
    INDIWARE_STUDENT = 'IndiwareStudent',
    INDIWARE_TEACHER = 'IndiwareTeacher'
}

export interface ScheduleOptions<T = any> {
    source: ScheduleOptionsSource;
    class: string;
    date?: string;
    configuration: T;
}
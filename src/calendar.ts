import {postMessageToNativeApp} from './post-message';

const msToS = (ms: number): number => Math.floor(ms / 1000);

export const createCalendarEvent = ({
    beginTime,
    endTime,
    title,
}: {
    beginTime: number;
    endTime: number;
    title: string;
}): Promise<void> =>
    postMessageToNativeApp({
        type: 'CREATE_CALENDAR_EVENT',
        payload: {
            beginTime: msToS(beginTime),
            endTime: msToS(endTime),
            title,
        },
    });

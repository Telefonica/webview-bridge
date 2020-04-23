import {createCalendarEvent} from '../calendar';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

test('set a calendar event', async (cb) => {
    expect.assertions(4);

    const t1 = 1000;
    const t2 = 2000;

    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('CREATE_CALENDAR_EVENT');
            expect(msg.payload.beginTime).toBe(1);
            expect(msg.payload.endTime).toBe(2);
        },
        getResponse: (msg) => ({
            type: 'CREATE_CALENDAR_EVENT',
            id: msg.id,
        }),
    });

    createCalendarEvent({
        beginTime: t1,
        endTime: t2,
        title: 'some title',
    }).then((res) => {
        expect(res).toBeUndefined();
        removeFakeAndroidPostMessage();
        cb();
    });
});

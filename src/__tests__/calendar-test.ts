import {createCalendarEvent} from '../calendar';

test('set a calendar event', async cb => {
    expect.assertions(4);

    const t1 = 1000;
    const t2 = 2000;

    window.tuentiWebView = {
        postMessage: jsonMessage => {
            const message = JSON.parse(jsonMessage);

            expect(message.type).toBe('CREATE_CALENDAR_EVENT');
            expect(message.payload.beginTime).toBe(1);
            expect(message.payload.endTime).toBe(2);

            window.__tuenti_webview_bridge!.postMessage(
                JSON.stringify({
                    type: 'CREATE_CALENDAR_EVENT',
                    id: message.id,
                }),
            );
        },
    };

    createCalendarEvent({
        beginTime: t1,
        endTime: t2,
        title: 'some title',
    }).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

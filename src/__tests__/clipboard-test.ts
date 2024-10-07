import {readTextFromClipboard, writeTextToClipboard} from '../../index';
import {createFakeWebKitPostMessage} from './fake-post-message';

test('read from clipboard', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('CLIPBOARD_READ_TEXT');
        },
        getResponse: (msg) => ({
            type: 'CLIPBOARD_READ_TEXT',
            payload: 'some text',
            id: msg.id,
        }),
    });

    const res = await readTextFromClipboard();

    expect(res).toEqual('some text');
});

test('write to clipboard', async () => {
    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('CLIPBOARD_WRITE_TEXT');
            expect(msg.payload).toBe('some text');
        },
        getResponse: (msg) => ({
            type: 'CLIPBOARD_WRITE_TEXT',
            id: msg.id,
        }),
    });

    await writeTextToClipboard('some text');
});

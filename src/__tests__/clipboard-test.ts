import {readTextFromClipboard, writeTextToClipboard} from '../../index';
import {createFakeWebKitPostMessage} from './fake-post-message';

const originalClipboard = navigator.clipboard;

const mockClipboardApi = () => {
    const readTextSpy = jest.fn();
    const writeTextSpy = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            readText: readTextSpy,
            writeText: writeTextSpy,
        },
        writable: true,
    });
    return {readTextSpy, writeTextSpy};
};

beforeEach(() => {
    (navigator as any).clipboard = originalClipboard;
});

test('read from clipboard when web api is available', async () => {
    const {readTextSpy} = mockClipboardApi();
    readTextSpy.mockResolvedValue('some text');

    const res = await readTextFromClipboard();

    expect(readTextSpy).toHaveBeenCalledTimes(1);
    expect(res).toEqual('some text');
});

test('write to clipboard when web api is available', async () => {
    const {writeTextSpy} = mockClipboardApi();
    writeTextSpy.mockResolvedValue(undefined);

    await writeTextToClipboard('some text');

    expect(writeTextSpy).toHaveBeenCalledWith('some text');
});

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

test('read from clipboard when web api throws', async () => {
    const {readTextSpy} = mockClipboardApi();

    readTextSpy.mockRejectedValue(new Error('Not allowed'));

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

test('write to clipboard when web api throws', async () => {
    const {writeTextSpy} = mockClipboardApi();

    writeTextSpy.mockRejectedValue(new Error('Not allowed'));

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

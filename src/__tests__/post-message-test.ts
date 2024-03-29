import '../post-message';
import {
    isWebViewBridgeAvailable,
    postMessageToNativeApp,
    onNativeEvent,
    NativeEventHandler,
} from '../post-message';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
    createFakeWebKitPostMessage,
    removeFakeWebKitPostMessage,
} from './fake-post-message';

const ANY_STRING = 'any-string';
const ANY_CODE = '432';

afterEach(() => {
    removeFakeWebKitPostMessage();
    removeFakeAndroidPostMessage();
});

test('web bridge is installed', () => {
    expect(typeof window.__tuenti_webview_bridge!.postMessage).toBe('function');
});

test('webview bridge unavailable', () => {
    expect(isWebViewBridgeAvailable()).toBe(false);
});

test.each`
    host         | mockHost
    ${'android'} | ${createFakeAndroidPostMessage}
    ${'webkit'}  | ${createFakeWebKitPostMessage}
`('$host webview bridge availability', ({mockHost}) => {
    mockHost();

    // Out of an iframe
    Object.defineProperty(window, 'frameElement', {
        get: () => null,
        configurable: true,
    });

    Object.defineProperty(window, 'top', {
        get: () => window,
    });
    expect(isWebViewBridgeAvailable()).toBe(true);

    // Inside an iframe that has no flag to enable it
    const hasNoDataEnableWebviewBridge = jest.fn(() => false);
    Object.defineProperty(window, 'frameElement', {
        get: () => ({
            hasAttribute: hasNoDataEnableWebviewBridge,
        }),
        configurable: true,
    });
    Object.defineProperty(window, 'top', {
        get: () => ({}),
    });
    expect(isWebViewBridgeAvailable()).toBe(false);
    expect(hasNoDataEnableWebviewBridge).toHaveBeenCalledWith(
        'data-enable-webview-bridge',
    );

    // Inside an iframe that has a flag to enable it
    const hasDataEnableWebviewBridge = jest.fn(() => true);
    Object.defineProperty(window, 'frameElement', {
        get: () => ({
            hasAttribute: hasDataEnableWebviewBridge,
        }),
        configurable: true,
    });

    expect(isWebViewBridgeAvailable()).toBe(true);
    expect(hasNoDataEnableWebviewBridge).toHaveBeenCalledWith(
        'data-enable-webview-bridge',
    );
});

test('post message to native app: no bridge', (done) => {
    expect(isWebViewBridgeAvailable()).toBe(false);

    postMessageToNativeApp({id: '1', type: 'PAGE_LOADED'}).catch((err) => {
        expect(err.code).toBe(500);
        done();
    });
});

test('post message to native app: error received', (done) => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            id: msg.id,
            type: 'ERROR',
            payload: {code: ANY_CODE, reason: ANY_STRING},
        }),
    });

    postMessageToNativeApp({id: '1', type: 'PAGE_LOADED'}).catch((err) => {
        expect(err.code).toBe(ANY_CODE);
        done();
    });
});

test('post message to native app: bad response type', (done) => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            id: msg.id,
            type: 'OTHER_TYPE',
            payload: {code: ANY_CODE, reason: ANY_STRING},
        }),
    });

    postMessageToNativeApp({id: '1', type: 'PAGE_LOADED'}).catch((err) => {
        expect(err.code).toBe(500);
        done();
    });
});

test('post message to native app: bad response type', (done) => {
    createFakeWebKitPostMessage({
        getResponse: (msg) => ({
            id: msg.id,
            type: 'OTHER_TYPE',
            payload: {code: ANY_CODE, reason: ANY_STRING},
        }),
    });

    postMessageToNativeApp({id: '1', type: 'PAGE_LOADED'}).catch((err) => {
        expect(err.code).toBe(500);
        done();
    });
});

test('malformed json throws', () => {
    expect(() => {
        window.__tuenti_webview_bridge!.postMessage('{bad;json}');
    }).toThrow();
});

test('onNativeEvent subscription', () => {
    const ANY_ID = '123';
    const ANY_EVENT_NAME = 'any-event-name';

    const request = {
        type: 'NATIVE_EVENT',
        id: ANY_ID,
        payload: {event: ANY_EVENT_NAME},
    };

    const expectedResponse = {
        type: 'NATIVE_EVENT',
        id: ANY_ID,
        payload: {action: 'default'},
    };

    createFakeWebKitPostMessage({
        checkMessage: (msg) => {
            expect(msg).toMatchObject(expectedResponse);
        },
    });

    const handler = jest.fn(({event}) => {
        expect(event).toBe(ANY_EVENT_NAME);
        return {action: 'default'};
    }) as NativeEventHandler;

    const unsubscribe = onNativeEvent(handler);

    window.__tuenti_webview_bridge!.postMessage(JSON.stringify(request));

    unsubscribe();

    window.__tuenti_webview_bridge!.postMessage(JSON.stringify(request));

    expect(handler).toHaveBeenCalledTimes(1);
});

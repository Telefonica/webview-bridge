import '../post-message';
import {
    isWebViewBridgeAvailable,
    postMessageToNativeApp,
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

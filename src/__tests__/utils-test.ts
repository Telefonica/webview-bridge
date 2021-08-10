import {
    attachToEmail,
    setWebViewTitle,
    notifyPageLoaded,
    updateNavigationBar,
    share,
    isABTestingAvailable,
    reportStatus,
    fetch,
} from '../utils';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';
import {isWebViewBridgeAvailable} from '../post-message';
import {getAppMetadata} from '../utils';

const ANY_STRING = 'any-string';
const ANY_OTHER_STRING = 'any-other-string';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('attach to email', (done) => {
    const PARAMS = {
        url: 'any-url',
        subject: 'any-subject',
        fileName: 'file-name',
        recipient: 'recipient',
        body: 'body',
    };

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('ATTACH_TO_EMAIL');
            expect(message.payload).toEqual(PARAMS);
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    attachToEmail(PARAMS).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('share', (done) => {
    const PARAMS = {
        url: 'any-url',
        fileName: 'file-name',
        text: 'any-text',
    };

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SHARE');
            expect(message.payload).toEqual(PARAMS);
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    share(PARAMS).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('set webview title', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual({title: ANY_STRING});
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    setWebViewTitle(ANY_STRING).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('set webview title fallbacks to document.title update', (done) => {
    document.title = '';

    setWebViewTitle(ANY_STRING).then((res) => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        done();
    });
});

test('update navigation bar, without options', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual({});
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    updateNavigationBar({}).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('update navigation bar, with options', (done) => {
    const options = {
        title: ANY_STRING,
        expandedTitle: ANY_OTHER_STRING,
        showBackButton: true,
        showReloadButton: true,
        showProfileButton: false,
        backgroundColor: '#AABBCC',
    };

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual(options);
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    updateNavigationBar(options).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('update navigation bar, without options and without bridge', (done) => {
    document.title = ANY_STRING;

    updateNavigationBar({}).then((res) => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        done();
    });
});

test('update navigation bar, without bridge', (done) => {
    document.title = '';

    const options = {
        title: ANY_STRING,
        expandedTitle: ANY_OTHER_STRING,
        showBackButton: true,
        showReloadButton: true,
        showProfileButton: false,
        backgroundColor: '#AABBCC',
    };

    updateNavigationBar(options).then((res) => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        done();
    });
});

test('notify page loaded', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('PAGE_LOADED');
            expect(message.payload).toBeUndefined();
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    notifyPageLoaded().then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('isABTestingAvailable happy case', async () => {
    const REMOTE_CONFIGURATION = {
        result: {
            key1: 'true',
            key2: 'false',
        },
    };

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('GET_REMOTE_CONFIG');
            expect(message.payload).toBeUndefined();
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: REMOTE_CONFIGURATION,
        }),
    });

    await isABTestingAvailable('key1').then((res) => {
        expect(res).toEqual(true);
    });
    await isABTestingAvailable('key2').then((res) => {
        expect(res).toEqual(false);
    });
});

test('isABTestingAvailable without bridge', async () => {
    expect(isWebViewBridgeAvailable()).toBe(false);

    await isABTestingAvailable('key3').then((res) => {
        expect(res).toEqual(false);
    });
    await isABTestingAvailable('key4').then((res) => {
        expect(res).toEqual(false);
    });
});

test('get remote config timeouts to false in 5s', (done) => {
    jest.useFakeTimers();
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('GET_REMOTE_CONFIG');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => new Promise(() => {}), // never respond
    });

    const promise = isABTestingAvailable('any key');
    jest.advanceTimersByTime(5000);
    promise.then((res) => {
        expect(res).toEqual(false);
        done();
    });
    jest.useRealTimers();
});

test('report account status', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('STATUS_REPORT');
            expect(message.payload).toEqual({
                feature: 'ACCOUNT',
                status: 'GOOD',
                reason: 'whatever reason',
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    reportStatus({
        feature: 'ACCOUNT',
        status: 'GOOD',
        reason: 'whatever reason',
    }).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('fetch happy case', async () => {
    const request = {
        url: 'https://example.com',
        method: 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    } as const;

    const response = {
        status: 200,
        headers: {key3: 'value3'},
        body: 'bye',
    };

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('FETCH');
            expect(message.payload).toEqual(request);
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: response,
        }),
    });

    await fetch(request).then((res) => {
        expect(res).toEqual(response);
    });
});

test('fetch without bridge', async () => {
    await fetch({
        url: 'https://example.com',
        method: 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    }).then((res) => {
        expect(res).toEqual({
            status: 500,
            headers: {},
            body: 'Bridge not available',
        });
    });
});

test('fetch call failure', async () => {
    const request = {
        url: 'https://example.com',
        method: 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    } as const;

    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('FETCH');
            expect(message.payload).toEqual(request);
        },
        getResponse: (message) => ({
            type: 'ERROR',
            id: message.id,
            payload: {reason: 'Unknown'},
        }),
    });

    await fetch(request).then((res) => {
        expect(res).toEqual({
            status: 500,
            headers: {},
            body: 'Bridge call failed',
        });
    });
});

import {checkPermissionStatus} from '../utils';

test('app has notifications permissions', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
            expect(msg.payload.params.channelId).toBe('default');
        },
        getResponse: (msg) => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: true},
        }),
    });

    checkPermissionStatus('notifications', {channelId: 'default'}).then(
        (res) => {
            expect(res).toBe(true);
            removeFakeAndroidPostMessage();
            done();
        },
    );
});

test('app has not notifications permissions', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
        },
        getResponse: (msg) => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: false},
        }),
    });

    checkPermissionStatus('notifications').then((res) => {
        expect(res).toBe(false);
        removeFakeAndroidPostMessage();
        done();
    });
});

test('get app metadata of installed application', async () => {
    const appToken = 'testToken';
    const marketUrl = 'testMarketurl';
    const appUrl = 'testAppUrl';
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_APP_METADATA');
            expect(msg.payload.appToken).toBe(appToken);
        },
        getResponse: (msg) => ({
            type: 'GET_APP_METADATA',
            id: msg.id,
            payload: {isInstalled: true, marketUrl, appUrl},
        }),
    });

    await getAppMetadata(appToken).then((res) => {
        expect(res).toMatchObject({isInstalled: true, marketUrl, appUrl});
        removeFakeAndroidPostMessage();
    });
});

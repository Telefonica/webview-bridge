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

const ANY_STRING = 'any-string';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('attach to email', cb => {
    const PARAMS = {
        url: 'any-url',
        subject: 'any-subject',
        fileName: 'file-name',
        recipient: 'recipient',
        body: 'body',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('ATTACH_TO_EMAIL');
            expect(message.payload).toEqual(PARAMS);
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    attachToEmail(PARAMS).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('share', cb => {
    const PARAMS = {
        url: 'any-url',
        fileName: 'file-name',
        text: 'any-text',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('SHARE');
            expect(message.payload).toEqual(PARAMS);
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    share(PARAMS).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('set webview title', cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual({title: ANY_STRING});
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    setWebViewTitle(ANY_STRING).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('set webview title fallbacks to document.title update', cb => {
    document.title = '';

    setWebViewTitle(ANY_STRING).then(res => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        cb();
    });
});

test('update navigation bar, without options', cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual({});
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    updateNavigationBar({}).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('update navigation bar, with options', cb => {
    const options = {
        title: ANY_STRING,
        showBackButton: true,
        showReloadButton: true,
        showProfileButton: false,
        backgroundColor: '#AABBCC',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('NAVIGATION_BAR');
            expect(message.payload).toEqual(options);
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    updateNavigationBar(options).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('update navigation bar, without options and without bridge', cb => {
    document.title = ANY_STRING;

    updateNavigationBar({}).then(res => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        cb();
    });
});

test('update navigation bar, without bridge', cb => {
    document.title = '';

    const options = {
        title: ANY_STRING,
        showBackButton: true,
        showReloadButton: true,
        showProfileButton: false,
        backgroundColor: '#AABBCC',
    };

    updateNavigationBar(options).then(res => {
        expect(res).toBeUndefined();
        expect(document.title).toBe(ANY_STRING);
        cb();
    });
});

test('notify page loaded', cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('PAGE_LOADED');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    notifyPageLoaded().then(res => {
        expect(res).toBeUndefined();
        cb();
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
        checkMessage: message => {
            expect(message.type).toBe('GET_REMOTE_CONFIG');
            expect(message.payload).toBeUndefined();
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: REMOTE_CONFIGURATION,
        }),
    });

    await isABTestingAvailable('key1').then(res => {
        expect(res).toEqual(true);
    });
    await isABTestingAvailable('key2').then(res => {
        expect(res).toEqual(false);
    });
});

test('isABTestingAvailable without bridge', async () => {
    expect(isWebViewBridgeAvailable()).toBe(false);

    await isABTestingAvailable('key3').then(res => {
        expect(res).toEqual(false);
    });
    await isABTestingAvailable('key4').then(res => {
        expect(res).toEqual(false);
    });
});

test('get remote config timeouts to false in 5s', cb => {
    jest.useFakeTimers();
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('GET_REMOTE_CONFIG');
            expect(message.payload).toBeUndefined();
        },
        getResponse: () => new Promise(() => {}), // never respond
    });

    const promise = isABTestingAvailable('any key');
    jest.advanceTimersByTime(5000);
    promise.then(res => {
        expect(res).toEqual(false);
        cb();
    });
    jest.useRealTimers();
});

test('report account status', cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('STATUS_REPORT');
            expect(message.payload).toEqual({
                feature: 'ACCOUNT',
                status: 'GOOD',
                reason: 'whatever reason',
            });
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
        }),
    });

    reportStatus({
        feature: 'ACCOUNT',
        status: 'GOOD',
        reason: 'whatever reason',
    }).then(res => {
        expect(res).toBeUndefined();
        cb();
    });
});

test('fetch happy case', async () => {
    const request = {
        url: 'https://example.com',
        method: 'GET' as 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    };

    const response = {
        status: 200,
        headers: {key3: 'value3'},
        body: 'bye',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('FETCH');
            expect(message.payload).toEqual(request);
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: response,
        }),
    });

    await fetch(request).then(res => {
        expect(res).toEqual(response);
    });
});

test('fetch without bridge', async () => {
    await fetch({
        url: 'https://example.com',
        method: 'GET' as 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    }).then(res => {
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
        method: 'GET' as 'GET',
        headers: {key1: 'value1', key2: 'value2'},
        body: 'hello',
    };

    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('FETCH');
            expect(message.payload).toEqual(request);
        },
        getResponse: message => ({
            type: 'ERROR',
            id: message.id,
            payload: {reason: 'Unknown'},
        }),
    });

    await fetch(request).then(res => {
        expect(res).toEqual({
            status: 500,
            headers: {},
            body: 'Bridge call failed',
        });
    });
});

import {checkPermissionStatus} from '../utils';

test('app has notifications permissions', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: msg => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
            expect(msg.payload.params.channelId).toBe('default');
        },
        getResponse: msg => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: true},
        }),
    });

    checkPermissionStatus('notifications', {channelId: 'default'}).then(res => {
        expect(res).toBe(true);
        removeFakeAndroidPostMessage();
        cb();
    });
});

test('app has not notifications permissions', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: msg => {
            expect(msg.type).toBe('OS_PERMISSION_STATUS');
            expect(msg.payload.feature).toBe('notifications');
        },
        getResponse: msg => ({
            type: 'OS_PERMISSION_STATUS',
            id: msg.id,
            payload: {granted: false},
        }),
    });

    checkPermissionStatus('notifications').then(res => {
        expect(res).toBe(false);
        removeFakeAndroidPostMessage();
        cb();
    });
});

import {getAppMetadata} from '../utils';

test.only('get app metadata of installed application', async () => {
    const appToken = 'testToken';
    const marketUrl = 'testMarketurl';
    const appUrl = 'testAppUrl';
    createFakeAndroidPostMessage({
        checkMessage: msg => {
            expect(msg.type).toBe('GET_APP_METADATA');
            expect(msg.payload.appToken).toBe(appToken);
        },
        getResponse: msg => ({
            type: 'GET_APP_METADATA',
            id: msg.id,
            payload: {isInstalled: true, marketUrl, appUrl},
        }),
    });

    await getAppMetadata(appToken).then(res => {
        expect(res).toMatchObject({isInstalled: true, marketUrl, appUrl});
        removeFakeAndroidPostMessage();
    });
});

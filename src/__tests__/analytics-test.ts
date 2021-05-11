import {
    logEvent,
    setScreenName,
    setUserProperty,
    logTiming,
    setCustomerHash,
    getCustomerHash,
    setTrackingProperty,
} from '../analytics';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const givenAndroidWebview = () => {
    const mock = {
        logEvent: jest.fn(),
        setScreenName: jest.fn(),
        setUserProperty: jest.fn(),
    };
    window.AnalyticsWebInterface = mock;
    return mock;
};

const givenIosWebview = () => {
    const mock = {
        postMessage: jest.fn(),
    };

    window.webkit = {
        messageHandlers: {
            firebase: mock,
        },
    };

    return mock;
};

const origWebkit = window.webkit;
const origAnalyticsWebInterface = window.AnalyticsWebInterface;

afterEach(() => {
    window.AnalyticsWebInterface = origAnalyticsWebInterface;
    window.webkit = origWebkit;
});

test('log event with default values', async () => {
    const anyWebviewMock = givenAndroidWebview();

    const DEFAULT_LABEL = 'null_label';
    const DEFAULT_VALUE = 0;

    await logEvent({
        category: 'anyCategory',
        action: 'anyAction',
    });

    expect(anyWebviewMock.logEvent).toBeCalledWith(
        'anyCategory',
        JSON.stringify({
            eventCategory: 'anyCategory',
            eventAction: 'anyAction',
            eventLabel: DEFAULT_LABEL,
            eventValue: DEFAULT_VALUE,
        }),
    );
});

test('accent marks are removed from event labels', async () => {
    const anyWebviewMock = givenAndroidWebview();
    const DEFAULT_VALUE = 0;

    await logEvent({
        category: 'anyCategory',
        action: 'anyAction',
        label: 'aeiou áéíóú àèìòù ÁÉÍÓÚ ÀÈÌÒÙ abcdefghijklmnñopeqrstuvwxyz',
    });

    expect(anyWebviewMock.logEvent).toBeCalledWith(
        'anyCategory',
        JSON.stringify({
            eventCategory: 'anyCategory',
            eventAction: 'anyAction',
            eventLabel:
                'aeiou aeiou aeiou AEIOU AEIOU abcdefghijklmnnopeqrstuvwxyz',
            eventValue: DEFAULT_VALUE,
        }),
    );
});

test('log event in Android', async () => {
    const androidFirebaseMock = givenAndroidWebview();

    const ANY_VALUE = 5;

    await logEvent({
        category: 'anyCategory',
        action: 'anyAction',
        label: 'anyLabel',
        value: ANY_VALUE,
        anyOtherParam: ANY_VALUE,
    });

    expect(androidFirebaseMock.logEvent).toBeCalledWith(
        'anyCategory',
        JSON.stringify({
            eventCategory: 'anyCategory',
            eventAction: 'anyAction',
            eventLabel: 'anyLabel',
            eventValue: ANY_VALUE,
            anyOtherParam: ANY_VALUE,
        }),
    );
});

test('log event in iOS', async () => {
    const iosFirebaseMock = givenIosWebview();

    const ANY_VALUE = 5;

    await logEvent({
        category: 'anyCategory',
        action: 'anyAction',
        label: 'anyLabel',
        value: ANY_VALUE,
        anyOtherParam: ANY_VALUE,
    });

    expect(iosFirebaseMock.postMessage).toBeCalledWith({
        command: 'logEvent',
        name: 'anyCategory',
        parameters: {
            eventCategory: 'anyCategory',
            eventAction: 'anyAction',
            eventLabel: 'anyLabel',
            eventValue: ANY_VALUE,
            anyOtherParam: ANY_VALUE,
        },
    });
});

test('set screen name in android', async () => {
    const androidFirebaseMock = givenAndroidWebview();

    const SCREEN_NAME = 'any-screen-name';

    await setScreenName(SCREEN_NAME);

    expect(androidFirebaseMock.setScreenName).toBeCalledWith(SCREEN_NAME);
});

test('set screen name in iOS', async () => {
    const iosFirebaseMock = givenIosWebview();

    const SCREEN_NAME = 'any-screen-name';

    await setScreenName(SCREEN_NAME);

    expect(iosFirebaseMock.postMessage).toBeCalledWith({
        command: 'setScreenName',
        name: SCREEN_NAME,
    });
});

test('set user property in android', async () => {
    const androidFirebaseMock = givenAndroidWebview();

    const PROPERTY_NAME = 'obIds';
    const PROPERTY_VALUE = 'any-value';

    await setUserProperty(PROPERTY_NAME, PROPERTY_VALUE);

    expect(androidFirebaseMock.setUserProperty).toBeCalledWith(
        PROPERTY_NAME,
        PROPERTY_VALUE,
    );
});

test('set user property in iOS', async () => {
    const iosFirebaseMock = givenIosWebview();

    const PROPERTY_NAME = 'obIds';
    const PROPERTY_VALUE = 'any-value';

    await setUserProperty(PROPERTY_NAME, PROPERTY_VALUE);

    expect(iosFirebaseMock.postMessage).toBeCalledWith({
        command: 'setUserProperty',
        name: PROPERTY_NAME,
        value: PROPERTY_VALUE,
    });
});

test('log timing does not track float values', async () => {
    const anyWebviewMock = givenAndroidWebview();

    const someFloatValue = 12.1234;
    const expectedValue = 12;

    await logTiming({
        variable: 'someVariable',
        value: someFloatValue,
    });

    expect(anyWebviewMock.logEvent).toBeCalledWith(
        'performance_timer',
        JSON.stringify({
            timingCategory: 'performance_timer',
            timingVar: 'someVariable',
            timingValue: expectedValue,
        }),
    );
});

test('set customer hash', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_CUSTOMER_HASH');
            expect(msg.payload.hash).toBe('ANY_HASH');
        },
        getResponse: (msg) => ({
            type: 'SET_CUSTOMER_HASH',
            id: msg.id,
        }),
    });

    const res = await setCustomerHash('ANY_HASH');

    expect(res).toBeUndefined();
    removeFakeAndroidPostMessage();
});

test('get customer hash', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('GET_CUSTOMER_HASH');
        },
        getResponse: (msg) => ({
            type: 'GET_CUSTOMER_HASH',
            id: msg.id,
            payload: {hash: 'ANY_HASH'},
        }),
    });

    await getCustomerHash().then((res) => {
        expect(res).toMatchObject({hash: 'ANY_HASH'});
        removeFakeAndroidPostMessage();
    });
});

test('set tracking property', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_TRACKING_PROPERTY');
            expect(msg.payload.system).toBe('any_system');
            expect(msg.payload.name).toBe('any_name');
            expect(msg.payload.value).toBe('any_value');
        },
        getResponse: (msg) => ({
            type: 'SET_TRACKING_PROPERTY',
            id: msg.id,
        }),
    });

    const res = await setTrackingProperty('any_system', 'any_name', 'any_value');

    expect(res).toBeUndefined();
    removeFakeAndroidPostMessage();
});

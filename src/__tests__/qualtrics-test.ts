import {
    displayQualtricsIntercept,
    isQualtricsInterceptAvailableForUser,
    setQualtricsProperties,
} from '../qualtrics';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('displayQualtricsIntercept', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('DISPLAY_QUALTRICS_INTERCEPT');
            expect(msg.payload).toEqual({interceptId: 'anyInterceptId'});
        },
        getResponse: (msg) => ({
            type: 'DISPLAY_QUALTRICS_INTERCEPT',
            id: msg.id,
            payload: {
                displayed: true,
            },
        }),
    });

    const res = await displayQualtricsIntercept({
        interceptId: 'anyInterceptId',
    });
    expect(res).toEqual({displayed: true});
});

test('setQualtricsProperties', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('SET_QUALTRICS_PROPERTIES');
            expect(msg.payload).toEqual({
                stringProperties: {stringKey: 'stringValue'},
                numberProperties: {numberKey: 42},
                dateTimePropertyKeys: ['dateTimeKey'],
            });
        },
        getResponse: (msg) => ({
            type: 'SET_QUALTRICS_PROPERTIES',
            id: msg.id,
        }),
    });

    const res = await setQualtricsProperties({
        stringProperties: {stringKey: 'stringValue'},
        numberProperties: {numberKey: 42},
        dateTimePropertyKeys: ['dateTimeKey'],
    });

    expect(res).toBeUndefined();
});

test('isQualtricsInterceptAvailableForUser', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('IS_QUALTRICS_INTERCEPT_AVAILABLE_FOR_USER');
            expect(msg.payload).toEqual({interceptId: 'anyInterceptId'});
        },
        getResponse: (msg) => ({
            type: 'IS_QUALTRICS_INTERCEPT_AVAILABLE_FOR_USER',
            id: msg.id,
            payload: {
                isAvailable: true,
            },
        }),
    });

    const res = await isQualtricsInterceptAvailableForUser({
        interceptId: 'anyInterceptId',
    });
    expect(res).toEqual({isAvailable: true});
});

import {requestAllowMeBiometrics, AllowMeSetupSdkError} from '../allow-me';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('requestAllowMeBiometrics', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_ALLOWME_BIOMETRICS');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_ALLOWME_BIOMETRICS',
            id: msg.id,
            payload: {
                result: '81gUpIN3UhXAZU2',
            },
        }),
    });

    const res = await requestAllowMeBiometrics();
    expect(res).toEqual({result: '81gUpIN3UhXAZU2'});
});

test('requestAllowMeBiometrics errors', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_ALLOWME_BIOMETRICS');
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: AllowMeSetupSdkError,
                description: 'Error setting up AllowMe SDK',
            },
        }),
    });

    expect(requestAllowMeBiometrics()).rejects.toEqual({
        code: AllowMeSetupSdkError,
        description: 'Error setting up AllowMe SDK',
    });
});

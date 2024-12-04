import {
    registerDatamobUser,
    requestDatamobDeviceAdmin,
    validateDatamobRequirements,
} from '../datamob';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('requestDatamobDeviceAdmin', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REQUEST_DATAMOB_DEVICE_ADMIN');
        },
        getResponse: (msg) => ({
            type: 'REQUEST_DATAMOB_DEVICE_ADMIN',
            id: msg.id,
            payload: {
                isAdmin: true,
            },
        }),
    });

    const res = await requestDatamobDeviceAdmin();
    expect(res).toEqual({isAdmin: true});
});

test('registerDatamobUser', async () => {
    const phoneNumber = '666112233';
    const tokenPassword = 'sometoken';
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REGISTER_DATAMOB_USER');
            expect(msg.payload).toEqual({phoneNumber, tokenPassword});
        },
        getResponse: (msg) => ({
            type: 'REGISTER_DATAMOB_USER',
            id: msg.id,
        }),
    });

    const res = await registerDatamobUser({phoneNumber, tokenPassword});
    expect(res).toBeUndefined();
});

test('registerDatamobUser error', async () => {
    const phoneNumber = '666112233';
    const tokenPassword = 'sometoken';
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('REGISTER_DATAMOB_USER');
            expect(msg.payload).toEqual({phoneNumber, tokenPassword});
        },
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {
                code: 500,
                reason: 'Registration error',
            },
        }),
    });

    await expect(
        registerDatamobUser({phoneNumber, tokenPassword}),
    ).rejects.toEqual({
        code: 500,
        reason: 'Registration error',
    });
});

test('validateDatamobRequirements', async () => {
    const phoneNumber = '666112233';
    const tokenPassword = 'sometoken';
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('VALIDATE_DATAMOB_REQUIREMENTS');
            expect(msg.payload).toEqual({phoneNumber, tokenPassword});
        },
        getResponse: (msg) => ({
            type: 'VALIDATE_DATAMOB_REQUIREMENTS',
            id: msg.id,
            payload: {
                requirements: {
                    deviceAdmin: true,
                    googleAccount: true,
                    lockPassword: true,
                    accessibilityOption: true,
                    invalidPhoneNumber: true,
                    invalidToken: true,
                },
            },
        }),
    });

    const res = await validateDatamobRequirements({phoneNumber, tokenPassword});

    expect(res).toEqual({
        requirements: {
            deviceAdmin: true,
            googleAccount: true,
            lockPassword: true,
            accessibilityOption: true,
            invalidPhoneNumber: true,
            invalidToken: true,
        },
    });
});

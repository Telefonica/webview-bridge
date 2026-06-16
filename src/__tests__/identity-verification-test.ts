import {verifyIdentity} from '../identity-verification';
import {createFakeAndroidPostMessage} from './fake-post-message';

test('verifyIdentity - success', async () => {
    createFakeAndroidPostMessage({
        checkMessage: (msg) => {
            expect(msg.type).toBe('VERIFY_IDENTITY');
            expect(msg.payload).toEqual({orderId: '123456789AAA'});
        },
        getResponse: (msg) => ({
            type: 'VERIFY_IDENTITY',
            id: msg.id,
        }),
    });

    const res = await verifyIdentity({orderId: '123456789AAA'});
    expect(res).toBeUndefined();
});

test('verifyIdentity - error', async () => {
    createFakeAndroidPostMessage({
        getResponse: (msg) => ({
            type: 'ERROR',
            id: msg.id,
            payload: {code: 204, reason: 'Flow was cancelled'},
        }),
    });

    await expect(verifyIdentity({orderId: '123456789AAA'})).rejects.toEqual({
        code: 204,
        reason: 'Flow was cancelled',
    });
});

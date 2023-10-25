import {openOnboarding} from '../open-onboarding';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('webapp requests to show the onboarding', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('OPEN_ONBOARDING');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    openOnboarding().then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

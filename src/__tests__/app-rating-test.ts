import {showAppRating} from '../app-rating';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('webapp requests user log out', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('SHOW_APP_RATING');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    showAppRating().then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

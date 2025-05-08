import {showAppRating, increaseAppRatingTrigger, resetAppRatingTrigger, appRatingRemindMeLater} from '../app-rating';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_TRIGGER_KEY = 'topupSuccess';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('webapp requests to show the app rating', (done) => {
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

test('webapp requests to increase an app rating trigger', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('INCREASE_APP_RATING_TRIGGER');
            expect(message.payload).toEqual({
                key: ANY_TRIGGER_KEY,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    increaseAppRatingTrigger({key: ANY_TRIGGER_KEY}).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('webapp requests to reset an app rating trigger', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('RESET_APP_RATING_TRIGGER');
            expect(message.payload).toEqual({
                key: ANY_TRIGGER_KEY,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    resetAppRatingTrigger({key: ANY_TRIGGER_KEY}).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('webapp notifies user "Remind me later" on app rating', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('APP_RATING_REMIND_ME_LATER');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    appRatingRemindMeLater().then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});
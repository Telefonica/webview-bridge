import {refreshNavBar} from '../navigation-tabs';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const MODULE_ID = 'bottombar';
const PRODUCT_ID = 'myProductId';

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('refresh navigation bars without params', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('REFRESH_NAV_BAR');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    refreshNavBar({}).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('refresh navigation bars with params', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('REFRESH_NAV_BAR');
            expect(message.payload).toEqual({
                moduleId: MODULE_ID,
                productId: PRODUCT_ID,
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    refreshNavBar({moduleId: MODULE_ID, productId: PRODUCT_ID}).then(
        (res) => {
            expect(res).toBeUndefined();
            done();
        },
    );
});

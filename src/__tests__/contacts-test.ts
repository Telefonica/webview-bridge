import {requestContact} from '../contacts';
import {
    createFakeAndroidPostMessage,
    removeFakeAndroidPostMessage,
} from './fake-post-message';

const ANY_CONTACT = {
    name: 'Homer J. Simpson',
    email: 'chunkylover53@aol.com',
    phoneNumber: '(939)-555-0113',
    address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        country: 'USA',
        postalCode: '49007',
    },
};

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('request contact', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('GET_CONTACT_DATA');
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: ANY_CONTACT,
        }),
    });

    requestContact().then(res => {
        expect(res).toEqual(ANY_CONTACT);
        cb();
    });
});

test('request contact filtered', async cb => {
    createFakeAndroidPostMessage({
        checkMessage: message => {
            expect(message.type).toBe('GET_CONTACT_DATA');
            expect(message.payload).toEqual({
                filter: 'email',
            });
        },
        getResponse: message => ({
            type: message.type,
            id: message.id,
            payload: ANY_CONTACT,
        }),
    });

    requestContact({
        filter: 'email',
    }).then(res => {
        expect(res).toEqual(ANY_CONTACT);
        cb();
    });
});

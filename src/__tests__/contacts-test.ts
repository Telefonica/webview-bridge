import {
    requestContact,
    fetchContactsByPhone,
    fetchPhoneNumbers,
    updatePhoneNumbers,
    addOrEditContact,
} from '../contacts';
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

const ANY_CONTACT_DATA_1 = {
    firstName: 'name',
    middleName: 'middlename',
    lastName: 'surname',
    encodedAvatar: 'avatar',
    phoneNumber: '123456',
};

const ANY_CONTACT_DATA_2 = {
    firstName: 'name',
    middleName: 'middlename',
    lastName: 'surname',
    encodedAvatar: 'avatar',
    phoneNumber: '789012',
};

const ANY_PHONE_NUMBER_1 = {
    id: '1',
    value: '1',
};

const ANY_PHONE_NUMBER_2 = {
    id: '2',
    value: '2',
};

afterEach(() => {
    removeFakeAndroidPostMessage();
});

test('request contact', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('GET_CONTACT_DATA');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: ANY_CONTACT,
        }),
    });

    requestContact().then((res) => {
        expect(res).toEqual(ANY_CONTACT);
        done();
    });
});

test('request contact filtered', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('GET_CONTACT_DATA');
            expect(message.payload).toEqual({
                filter: 'email',
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: ANY_CONTACT,
        }),
    });

    requestContact({
        filter: 'email',
    }).then((res) => {
        expect(res).toEqual(ANY_CONTACT);
        done();
    });
});

test('fetch contacts by phone', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('FETCH_CONTACTS_DATA');
            expect(message.payload).toEqual({
                phoneNumbers: ['123456', '789012'],
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: [ANY_CONTACT_DATA_1, ANY_CONTACT_DATA_2],
        }),
    });

    fetchContactsByPhone(['123456', '789012']).then((res) => {
        expect(res).toEqual([ANY_CONTACT_DATA_1, ANY_CONTACT_DATA_2]);
        done();
    });
});

test('fetch phone numbers', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('FETCH_PHONE_NUMBERS');
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: [ANY_PHONE_NUMBER_1, ANY_PHONE_NUMBER_2],
        }),
    });

    fetchPhoneNumbers().then((res) => {
        expect(res).toEqual([ANY_PHONE_NUMBER_1, ANY_PHONE_NUMBER_2]);
        done();
    });
});

test('update phone numbers', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('UPDATE_PHONE_NUMBERS');
            expect(message.payload).toEqual({
                phoneNumbers: [ANY_PHONE_NUMBER_1, ANY_PHONE_NUMBER_2],
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
        }),
    });

    updatePhoneNumbers([ANY_PHONE_NUMBER_1, ANY_PHONE_NUMBER_2]).then((res) => {
        expect(res).toBeUndefined();
        done();
    });
});

test('Add or update a contact by phone', (done) => {
    createFakeAndroidPostMessage({
        checkMessage: (message) => {
            expect(message.type).toBe('ADD_OR_EDIT_CONTACT');
            expect(message.payload).toEqual({
                phoneNumber: '123456',
            });
        },
        getResponse: (message) => ({
            type: message.type,
            id: message.id,
            payload: ANY_CONTACT_DATA_1,
        }),
    });

    addOrEditContact('123456').then((res) => {
        expect(res).toEqual(ANY_CONTACT_DATA_1);
        done();
    });
});

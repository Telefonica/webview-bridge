import {postMessageToNativeApp, NativeAppResponsePayload} from './post-message';

export const requestContact = ({
    filter = 'phone',
}: {filter?: 'phone' | 'email'} = {}) =>
    postMessageToNativeApp({type: 'GET_CONTACT_DATA', payload: {filter}});

export const fetchContactsByPhone = (
    phoneNumbers: Array<string>,
): Promise<NativeAppResponsePayload<'FETCH_CONTACTS_DATA'>> =>
    postMessageToNativeApp({
        type: 'FETCH_CONTACTS_DATA',
        payload: {phoneNumbers},
    });

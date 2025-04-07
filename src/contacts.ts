import {postMessageToNativeApp, NativeAppResponsePayload} from './post-message';

export const requestContact = ({
    filter = 'phone',
}: {filter?: 'phone' | 'email'} = {}): Promise<
    NativeAppResponsePayload<'GET_CONTACT_DATA'>
> => postMessageToNativeApp({type: 'GET_CONTACT_DATA', payload: {filter}});

export const fetchContactsByPhone = (
    phoneNumbers: ReadonlyArray<string>,
): Promise<NativeAppResponsePayload<'FETCH_CONTACTS_DATA'>> =>
    postMessageToNativeApp({
        type: 'FETCH_CONTACTS_DATA',
        payload: {phoneNumbers},
    });

export const fetchPhoneNumbers = (): Promise<
    NativeAppResponsePayload<'FETCH_PHONE_NUMBERS'>
> =>
    postMessageToNativeApp({
        type: 'FETCH_PHONE_NUMBERS',
    });

export const updatePhoneNumbers = (
    phoneNumbers: ReadonlyArray<{id: string; value: string}>,
): Promise<NativeAppResponsePayload<'UPDATE_PHONE_NUMBERS'>> =>
    postMessageToNativeApp({
        type: 'UPDATE_PHONE_NUMBERS',
        payload: {phoneNumbers},
    });

export const addOrEditContact = (
    phoneNumber: string,
): Promise<NativeAppResponsePayload<'ADD_OR_EDIT_CONTACT'>> =>
    postMessageToNativeApp({
        type: 'ADD_OR_EDIT_CONTACT',
        payload: {phoneNumber},
    });

import {postMessageToNativeApp, IncomingMessageMap} from './post-message';

export const requestContact = ({
    filter = 'phone',
}: {filter?: 'phone' | 'email'} = {}) =>
    postMessageToNativeApp({type: 'GET_CONTACT_DATA', payload: {filter}});

export const matchContactData = (
    numbers: Array<string>,
): Promise<IncomingMessageMap['MATCH_CONTACT_DATA']['payload']> =>
    postMessageToNativeApp({
        type: 'MATCH_CONTACT_DATA',
        payload: {numbers},
    });

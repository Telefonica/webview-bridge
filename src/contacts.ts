import {postMessageToNativeApp} from './post-message';

export const requestContact = () =>
    postMessageToNativeApp({type: 'GET_CONTACT_DATA'});

import {postMessageToNativeApp} from './post-message';

export const readTextFromClipboard = (): Promise<string> =>
    postMessageToNativeApp({type: 'CLIPBOARD_READ_TEXT'});

export const writeTextToClipboard = (text: string): Promise<void> =>
    postMessageToNativeApp({type: 'CLIPBOARD_WRITE_TEXT', payload: text});

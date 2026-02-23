import {postMessageToNativeApp} from './post-message';

/**
 * These functions try to use the Web Clipboard API if available, otherwise fall back to the bridge
 * implementation in native apps.
 *
 * According to the tests done, the Web Clipboard API works fine in iOS webviews but fails with a permissions
 * error in Android in some cases. Also, old versions of Chrome in Android may not have support for the Web
 * Clipboard API at all.
 *
 * We have decided to not implement the bridge method in iOS apps, as the Web Clipboard API works fine.
 */

export const readTextFromClipboard = (): Promise<string> =>
    (navigator.clipboard?.readText
        ? navigator.clipboard.readText()
        : Promise.reject()
    ).catch(() => postMessageToNativeApp({type: 'CLIPBOARD_READ_TEXT'}));

export const writeTextToClipboard = (text: string): Promise<void> =>
    (navigator.clipboard?.writeText
        ? navigator.clipboard.writeText(text)
        : Promise.reject()
    ).catch(() =>
        postMessageToNativeApp({
            type: 'CLIPBOARD_WRITE_TEXT',
            payload: text,
        }),
    );

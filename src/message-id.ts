let messageId = 1;
const webviewId = `${Date.now()}-${String(Math.random()).slice(-8)}`;

/**
 * Message ID generator. Ids should be unique.
 *
 * the "web" prefix indicates that the was originated from the web side.
 *
 * Using a timestamp as webviewId (assuming two webviews are not opened in the same millisecond),
 * but if that ever happens, the last part is a random number to avoid collisions.
 */
export const getId = (): string => `web-${messageId++}-${webviewId}`;

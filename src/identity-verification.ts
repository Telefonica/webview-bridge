import {postMessageToNativeApp} from './post-message';

/**
 * Starts the IDnow SDK identity verification flow for a given order ID.
 * Only available in Mein O2 and Mein Blau. All required permissions are
 * handled by the SDK itself.
 *
 * Error cases:
 * - 204: Flow was cancelled (e.g., closed manually by the user)
 * - 405: Feature not supported in current brand (only available in Mein Blau and Mein O2)
 * - 500: Internal error (e.g., unexpected error thrown by identity verification SDK)
 * - 505: Identity verification flow is not supported on this device (Android < 9)
 */
export const verifyIdentity = ({orderId}: {orderId: string}): Promise<void> =>
    postMessageToNativeApp({
        type: 'VERIFY_IDENTITY',
        payload: {orderId},
    });

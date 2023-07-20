<p align="center">
  <img width="75%" src="./doc/webview-bridge-logo.png"/>
</p>

[![GitHub tag](https://img.shields.io/github/tag/tef-dig/webview-bridge.svg)](https://github.com/tef-dig/webview-bridge)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/tef-dig/webview-bridge/blob/master/LICENSE)
![CI status](https://github.com/tef-dig/webview-bridge/workflows/CI/badge.svg)

JavaScript library to access to native functionality. Requires a webview with a
postMessage bridge.

Library size ~1.2 Kb (min + gzip)

[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD),
[UMD](https://github.com/umdjs/umd),
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE),
[ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
builds available (see
[package dist folder](https://unpkg.com/@tef-novum/webview-bridge/dist/)). Open
an issue if you need a different build.

## Usage

### NPM

We recommend to manage your dependencies using `npm` or `yarn` and use a bundler
like [webpack](https://webpack.js.org/) or [parcel](https://parceljs.org/). Once
configured, you can use
[ES imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

Install using `npm`:

```bash
npm i @tef-novum/webview-bridge
```

Install using `yarn`:

```bash
yarn add @tef-novum/webview-bridge
```

Import required function and use it:

```javascript
import {setWebViewTitle} from '@tef-novum/webview-bridge';

setWebViewTitle('Hello, world');
```

### CDN

Alternatively, you can import the library directly from a CDN:

```html
<script src="https://unpkg.com/@tef-novum/webview-bridge/dist/webview-bridge-iife.min.js"></script>

<script>
    webviewBridge.setWebViewTitle('Hello, world');
</script>
```

## API

### isWebViewBridgeAvailable

Returns true if WebView Bridge is available. Use this function to implement
fallbacks in case the bridge is not available.

```typescript
isWebViewBridgeAvailable: () => boolean;
```

#### Inside an `iframe`

By default, the bridge will be disabled inside an iframe. If you want to enable
it, add a `data-enable-webview-bridge` attribute to the host `iframe` element.

#### Example

```javascript
import {isWebViewBridgeAvailable, nativeAlert} from '@tef-novum/webview-bridge';

if (isWebViewBridgeAvailable()) {
    nativeAlert('Hello'); // use bridge
} else {
    myCustomAlert('Hello'); // use alternative implementation
}
```

You may want to detect if the page is displayed inside a regular browser or an
Android or iOS WebView.

```javascript
import {isWebViewBridgeAvailable} from '@tef-novum/webview-bridge';

/** Returns true if application is running inside a Novum App WebView */
const isWebView = () => isWebViewBridgeAvailable();

/** Returns true if application is running inside a Novum App WebView running on Android */
const isAndroidWebView = () =>
    isWebViewBridgeAvailable() && navigator.userAgent.includes('Android');

/** Returns true if application is running inside a Novum App WebView running on iOS */
const isIOSWebView = () =>
    isWebViewBridgeAvailable() && !navigator.userAgent.includes('Android');
```

### requestContact

Show native picker UI in order to let the user select a contact.

-   Android only: picker UI elements can be filtered by available phones
    (default) or emails. `filter` property is ignored by iOS devices

<img height="550" src="doc/webview-bridge-contact-ios.png"><img height="550" src="doc/webview-bridge-contact-android.png">

```typescript
requestContact: ({filter?: 'phone' | 'email'}) => Promise<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };
}>;
```

All fields in response object are optional

#### Example

```javascript
import {requestContact} from '@tef-novum/webview-bridge';

requestContact({filter: 'phone'}).then((contact) => {
    console.log(contact);
}).catch(err => {
    console.error(err);
};
```

### createCalendarEvent

Inserts an event in calendar

<img height="550" src="doc/webview-bridge-calendar-ios.png"><img height="550" src="doc/webview-bridge-calendar-android.png">

```typescript
createCalendarEvent: ({
    beginTime: number,
    endTime: number,
    title: string
}) => Promise<void>;
```

`beginTime` and `endTime` are timestamps with millisecond precision

#### Example

```javascript
import {createCalendarEvent} from '@tef-novum/webview-bridge';

createCalendarEvent({
    beginTime: new Date(2019, 10, 06).getTime(),
    endTime: new Date(2019, 10, 07).getTime(),
    title: "Peter's birthday",
}).then(() => {
    console.log('event created');
}).catch(err => {
    console.error(err);
};
```

### share

Invokes the native sharing mechanism of the device.

-   Available for app versions 10.7 and higher
-   Returning promise will be rejected if not supported (app versions lower than
    10.7)

```typescript
type ShareOptions =
    | {
          text: string;
      }
    | {
          url: string;
          fileName: string;
          text?: string;
      };

share: (options: ShareOptions) => Promise<void>;
```

-   If no `url` is present, `text` is used as item to share
-   If `url` param is present, it contains the URL to the shared file
-   `fileName` param is mandatory if `url` is set
-   If `url` and `text` are set, `text` is used as `Intent BODY` (if platform
    allows it)

#### Example

```javascript
import {share} from '@tef-novum/webview-bridge';

// sharing a text string
share({text: 'Hello, world!'});

// sharing a file
share({url: 'https://path/to/file', fileName: 'lolcats.png'});
```

### updateNavigationBar

Customize WebView NavigationBar properties

-   You can set one or more properties in a single call
-   Available for app versions 10.7 and higher
-   Returning promise will be rejected if not supported (app versions lower than
    10.7)

```typescript
updateNavigationBar = ({
    title?: string;
    expandedTitle?: string;
    showBackButton?: boolean;
    showReloadButton?: boolean;
    showProfileButton?: boolean;
    backgroundColor?: string;
}) => Promise<void>
```

-   `title`: updates NavigationBar title
-   `expandedTitle`: updates NavigationBar expandedTitle. If the value is an
    empty string, the expanded navigation bar will not be shown. Only available
    in native app versions >= 11.8
-   `showBackButton`: shows or hides back icon in NavigationBar
-   `showReloadButton`: shows or hides NavigationBar Reload button
-   `showProfileButton`: shows or hides NavigationBar Profile button (which
    navigates to user profile). Only available in native app versions >= 11.7
-   `backgroundColor`: change NavigationBar background color, use a hex color
    string (for example: `'#FF128A'`)

#### Examples

```javascript
import {updateNavigationBar} from '@tef-novum/webview-bridge';

// updates WebView NavigationBar title
updateNavigationBar({title: 'Hello, World!'});

// full featured example
updateNavigationBar({
    title: 'Hello',
    expandedTitle: 'Hello, World!',
    showBackButton: true,
    showReloadButton: false,
    showProfileButton: false,
    backgroundColor: '#FF0000', // red
});
```

### isABTestingAvailable

Returns true if A/B testing named with the key is available.

-   Available for app versions 10.8 and higher
-   Returning promise will be rejected if not supported (app versions lower than
    10.8)

```typescript
isABTestingAvailable: (key: string) => Promise<boolean>;
```

#### Example

```javascript
import {isABTestingAvailable} from '@tef-novum/webview-bridge';

isABTestingAvailable('key').then((isAvailable) => {
    console.log(isAvailable);
}).catch(err => {
    console.error(err);
};
```

### nativeConfirm

Show a native confirm dialog.

If the bridge is not present (eg. showing the page in browser), fallbacks to a
browser confirm.

<img height="550" src="doc/webview-bridge-confirm-ios.png"><img height="550" src="doc/webview-bridge-confirm-android.png">

```typescript
nativeConfirm: ({
    message: string;
    title?: string;
    acceptText: string;
    cancelText: string;
}) => Promise<boolean>;
```

#### Example

```javascript
import {nativeConfirm} from '@tef-novum/webview-bridge';

nativeConfirm({
    title: 'Confirm',
    message: 'Send message?',
    acceptText: 'Yes',
    cancelText: 'No',
}).then((res) => {
    if (res) {
        console.log('message sent');
    }
});
```

### nativeAlert

Show a native alert dialog.

If the bridge is not present (eg. showing the page in browser), fallbacks to a
browser alert.

<img height="550" src="doc/webview-bridge-alert-ios.png"><img height="550" src="doc/webview-bridge-alert-android.png">

```typescript
nativeAlert: ({
    message: string;
    title?: string;
    buttonText: string;
}) => Promise<void>;
```

#### Example

```javascript
import {nativeAlert} from '@tef-novum/webview-bridge';

nativeAlert({
    message: 'Purchase completed!',
    title: 'Ok!',
}).then((res) => {
    console.log('alert closed');
});
```

### nativeMessage

Show a native message dialog. Use it to display feedback messages.

If the bridge is not present (eg. showing the page in browser), fallbacks to a
browser alert.

-   `buttonText` property is ignored in iOS.

<img height="550" src="doc/webview-bridge-message-ios.png"><img height="550" src="doc/webview-bridge-message-android.png">

```typescript
nativeMessage: ({
        message: string;
        duration?: number; // milliseconds
        buttonText?: string; // Android only
        type?: 'INFORMATIVE' | 'CRITICAL' | 'SUCCESS';
}) => Promise<void>;
```

#### Example

Show a native "snackbar" with a configurable duration and optional close button

```javascript
import {nativeMessage} from '@tef-novum/webview-bridge';

nativeMessage({
    message: 'Operation finished!',
    buttonText: 'Ok',
    duration: 5000, // 5 seconds
}).then((res) => {
    console.log('alert closed');
});
```

### logEvent

Log an event to firebase

```typescript
logEvent: ({
    category: string; // Typically the object that was interacted with (e.g. 'Video')
    action: string; // The type of interaction (e.g. 'play')
    label?: string; // Useful for categorizing events (e.g. 'Fall Campaign')
    value?: number; // A numeric value associated with the event (e.g. 43)
}) => Promise<void>;
```

If you want to use new Google Analytics 4 event format you can use this method
too:

```typescript
logEvent: ({
    name: string; // The event name is mandatory
    [key: string]: any; // You can set any other event parameters
}, {
    sanitize?: boolean; // Whether to sanitize the event params, this only affects to FirebaseEvents. true by default.
}) => Promise<void>;
```

#### Example

```javascript
import {logEvent} from '@tef-novum/webview-bridge';

logEvent({
    category: 'topup-flow',
    action: 'topup',
}).then(() => {
    console.log('event logged');
});

// Or with GA4 format
logEvent({
    name: 'user_interaction',
    component_type: 'primary_button',
    component_copy: 'topup',
}).then(() => {
    console.log('event logged');
});
```

#### About event params sanitization

By default, GA4 event params are sanitized. The sanitization consists of
removing whitespaces and some special characters, lowercasing and trimming. This
allows us having a consistent event format accross events.

In some cases you may want to disable this behavior. To do so, you can set the
`sanitize` option to `false`:

```javascript
logEvent(yourEvent, {sanitize: false});
```

### setScreenName

Log the current screen name (or page name) to firebase

```typescript
setScreenName: (screenName: string, params?: {[key: string]: any}) => Promise<void>;
```

#### Example

```javascript
import {setScreenName} from '@tef-novum/webview-bridge';

setScreenName('Topup Flow').then(() => {
    console.log('screen name logged');
});
```

You can also send additional params with the screen name:

```javascript
setScreenName('Topup Flow', {someParam: 'some value'});
```

### setUserProperty

Set a user property to firebase

```typescript
setUserProperty: (name: string, value: string) => Promise<void>;
```

#### Example

```javascript
import {setUserProperty} from '@tef-novum/webview-bridge';

setUserProperty('obIds', 'any-value').then(() => {
    console.log('User property logged');
});
```

### reportStatus

Report a given feature status

-   Available for app versions 11.2 and higher

```typescript
reportStatus: ({feature: 'ACCOUNT', status: 'CRITICAL' | 'GOOD' | 'BAD', reason: string}) => Promise<void>;
```

#### Example

```javascript
import {reportStatus} from '@tef-novum/webview-bridge';

reportStatus({feature: 'ACCOUNT', status: 'GOOD', reason: 'whatever'});
```

### onNativeEvent

Listens to native app events

-   Available for app versions 11.3 and higher

```typescript
type NativeEventHandler = ({ event }: {event: string}) => {action: 'default'};

onNativeEvent: (handler: NativeEventHandler) => () => void;
```

#### Example

```typescript
onNativeEvent(({event}) => {
    if (event === 'tappedNavigationBarBackButton') {
        // do something
    }
    return {action: 'default'};
});
```

#### Available events

-   `tappedNavigationBarBackButton`: fired when the user taps on the back button
    of the native Navigation Bar. Allowed response actions: `default`

### checkPermissionStatus

Returns true if the app has the specific notifications permissions. You have to
pass feature and required params for this request.

-   Available for app versions 11.4 and higher

Avalaible features:

-   `notifications`
-   `read-contacts` (Available for app versions 13.10 and higher)
-   `write-contacts` (Available for app versions 13.10 and higher)

```typescript
checkPermissionStatus: (feature: string, params?: {[key: string]: string}) => Promise<boolean>;
```

#### Example

```javascript
import {checkPermissionStatus} from '@tef-novum/webview-bridge';

checkPermissionStatus('notifications', {channelId: 'default'}).then(
    (hasPermissions) => {
        console.log(hasPermissions);
    },
);
```

### internalNavigation

Init an internal and native navigation to a device specific feature

-   Available for app versions 11.4 and higher

Avalaible features:

-   `notification-settings`
-   `contact-settings` (Available for app versions 13.10 and higher)

```typescript
internalNavigation: (feature: string) => Promise<void>;
```

#### Example

```javascript
import {internalNavigation} from '@tef-novum/webview-bridge';

internalNavigation('notification-settings');
```

### dismiss

Dismiss the current webview and optionally navigate to another url

-   Available for app versions 11.5 and higher

```typescript
dismiss: (onCompletionUrl?: string) => Promise<void>;
```

#### Example

```javascript
import {dismiss} from '@tef-novum/webview-bridge';

dismiss('http://example.com');
```

### requestVibration

Requests the phone to vibrate. Options are 'error' or 'success'.

```javascript
import {requestVibration} from '@tef-novum/webview-bridge';

requestVibration('error');
```

### fetchContactsByPhone

Returns contacts info given an array of phone numbers.

```javascript
fetchContactsByPhone: (phoneNumbers: Array<string>) => Promise<Array<{
    phoneNumber: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    encodedAvatar?: string;
}>>;
```

### getAppMetadata

Check if an app is installed in the phone

-   Available for app versions 11.8 and higher

```typescript
getAppMetadata: (appToken: string) => Promise<{isInstalled: boolean; marketUrl: string; appUrl: string}>;
```

#### Example

```javascript
import {getAppMetadata} from '@tef-novum/webview-bridge';

getAppMetadata('tokenAppToCheck').then(({isInstalled, marketUrl, appUrl}) => { ... });
```

-   `appToken`: token that refers to a "friend" application
-   `appUrl`: string url to launch an app installed on the phone
-   `marketUrl`: string url to launch the store in a specific application

### setCustomerHash

Sets the hash of the current subscription for the customer, which is used for
tracking purposes.

```javascript
import {setCustomerHash} from '@tef-novum/webview-bridge';

setCustomerHash(
    'e658ad63bef9b86863b487697dfb75d64bddb6191ec14099abe443655f6b7cc6',
);
```

### getCustomerHash

Gets the hash of the current subscription for the customer, which is used for
tracking purposes.

```javascript
import {getCustomerHash} from '@tef-novum/webview-bridge';

getCustomerHash().then(({hash}) => { ... });
```

### getDiskSpaceInfo

Return info about how much free disk space the device has

-   Available for app versions 11.10 and higher

```typescript
getDiskSpaceInfo: () => Promise<{availableBytes: number, totalBytes: number}>;
```

#### Example

```javascript
import {getDiskSpaceInfo} from '@tef-novum/webview-bridge';

getDiskSpaceInfo().then(({availableBytes, totalBytes}) => { ... });
```

-   `availableBytes`: number to see available bytes in the device
-   `totalBytes`: number to see the total bytes in the device

### getEsimInfo

Return info about the esim capabilities of the device

-   Available for app versions 12.3 and higher

```typescript
getEsimInfo: () => Promise<{supportsEsim: boolean}>;
```

#### Example

```javascript
import {getEsimInfo} from '@tef-novum/webview-bridge';

getEsimInfo().then(({supportsEsim}) => { ... });
```

-   `supportsEsim`: true if the device supports eSIM, false otherwise

### setTrackingProperty

Sets a property related to some specific tracking system

-   Available for app versions 12.4 and higher

```typescript
setTrackingProperty: (system: 'palitagem' | 'medallia', name: string, value?: string) => Promise<void>;
```

-   `system`: Tracking system that will handle the property
-   `name`: name of the property
-   `value`: value of the property (nullable)

### setActionBehavior

Method that allows defining an specific behavior (such as showing a
confirmation) before the specific native actions are executed. This method also
allows disabling any previous behaviors set.

-   Available for app versions 12.7 and higher

```typescript
type ActionBehavior =
    | {
        behavior: 'confirm';
        title: string;
        message: string;
        acceptText: string;
        cancelText: string;
    }
    | {
        behavior: 'default';
    }
    | {
        behavior: 'cancel';
    };

setActionBehavior: (actions: {webviewClose?: ActionBehavior, navigationBack?: ActionBehavior}) => Promise<void>;
```

`navigationBack` and `webviewClose` actions are currently available:

-   `navigationBack`: Action bar back button pressed (also for physical back
    button in android but not swipe back gesture in iOS, which will be
    disabled).
-   `webviewClose`: Action bar close button pressed. Includes both "X" and
    "Close" buttons (but not swipe down gesture in iOS, which will be disabled).

Both have same allowed json parameters, and 3 allowed behaviors:

-   `confirm` Show a confirmation dialog with the required title, message and
    buttons.
-   `cancel` Prevent action from being performed, just ignoring it.
-   `default` Set default behavior for the action. (Usually to reset any
    previously specified behavior).

Actions can be optionally included in the payload. Any not included action won’t
change its current behavior set.

All actions behaviors will be automatically set to default on full page loads.

#### Example

```javascript
import {setTrackingProperty} from '@tef-novum/webview-bridge';

setTrackingProperty('some_system', 'some_property_name', 'some_property_value');
```

### renewSession

Tell the app to renew the session.

```ts
renewSession = (
    oldAccessToken: string | null,
    options: {timeout?: number} = {},
) => Promise<string>
```

### onSessionRenewed

Defines a callback that will be executed when the native app renews the session.
Returns the unsubscribe function.

```ts
onSessionRenewed = (
    handler: (newAccessToken: string) => void,
) => (() => void)
```

### logout

A method that requests a user logout.

```ts
logout = () => Promise<{success: boolean}>
```

### getTopazToken

Returns the [Topaz](https://www.topaz.com.br/ofd/index.php) token.

```ts
getTopazToken = (options: {timeout?: number} = {}) => Promise<{token: string}>
```

### showAppRating

Show native app rating dialog

<img height="550" src="doc/webview-bridge-app-rating-ios.png"><img height="550" src="doc/webview-bridge-alert-android.png">

```ts
showAppRating = () => Promise<void>
```

### bottomSheet

Show native bottom sheet ui

-   Available in Novum app since 13.8 version

<img height="460" src="doc/webview-bridge-bottom-sheet.png">

```ts
bottomSheet = (payload: SheetUI) => Promise<SheetResponse>
// see SheetUI and SheetResponse types
```

:warning: If you try to call this method repeatedly while a sheet is already
being opened (for example, user accidental double tap), it will throw an Error
with code `423` (Locked)

There are some specific cases of bottom sheet, and we have some utility methods
to make them simpler to use:

For single selection use `bottomSheetSingleSelector`:

```ts
bottomSheetSingleSelector = ({
    title?: string;
    subtitle?: string;
    description?: string;
    selectedId?: string;
    items: Array<SheetRowItem>;
}) => Promise<{action: 'SUBMIT' | 'DISMISS'; selectedId: string}>
```

For a bottom sheet with a list of actions use `bottomSheetActionSelector`:

```ts
bottomSheetActionSelector = ({
    title?: string;
    subtitle?: string;
    description?: string;
    items: Array<SheetActionItem>;
}) => Promise<{action: 'SUBMIT' | 'DISMISS'; selectedId: string}>
```

For an informative bottom sheet use `bottomSheetInfo`:

```ts
bottomSheetInfo = ({
    title?: string;
    subtitle?: string;
    description?: string;
    items: Array<SheetInfoItem>;
}) => Promise<void>
```

#### Example:

```ts
import {bottomSheetSingleSelector} from '@tef-novum/webview-bridge';

const {action, selected} = await bottomSheetSingleSelector({
    title: 'Some title',
    subtitle: 'Some subtitle',
    description: 'Some description',
    selectedId: 'item-1',
    items: [
        {
            id: 'item-0',
            title: 'item 0 title',
            description: 'item 0 description',
        },
        {
            id: 'item-1',
            title: 'item 1 title',
            description: 'item 1 description',
        },
        {
            id: 'item-2',
            title: 'item 2 title',
            description: 'item 2 description',
        },
    ],
});
```

### fetchPhoneNumbers

Fetch all the phone numbers of the native phonebook

-   Available in Novum app since 13.10 version

```ts
fetchPhoneNumbers:() => Promise<Array<{
    id: string;
    value: string;
}>>;
```

### updatePhoneNumbers

Updates the given phone numbers in the native phonebook

-   Available in Novum app since 13.10 version

```ts
updatePhoneNumbers:(Array<{
    id: string;
    value: string;
}>) => Promise<Void>;
```

## getAttStatus

Method that allows a WebView to to ask an iOS app user about the authorization
status of his ATT
([App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency))
permission.

Resolves to `null` if the app is not running on iOS or if the method is not
available

-   Available in Novum app for iOS since 14.7 version

```ts
getAttStatus: () => Promise<{status:'granted' | 'denied' | 'unknown'} | null>;
```

## Error handling

If an error occurs, promise will be rejected with an error object:

```typescript
{code: number, description: string}
```

## License

This project is licensed under the terms of the MIT license. See the
[LICENSE](LICENSE) file.

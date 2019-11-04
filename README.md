<p align="center">
  <img width="75%" src="./doc/webview-bridge-logo.png"/>
</p>

[![GitHub tag](https://img.shields.io/github/tag/tef-dig/webview-bridge.svg)](https://github.com/tef-dig/webview-bridge)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/tef-dig/webview-bridge/blob/master/LICENSE)
![Travis](https://travis-ci.org/tef-dig/webview-bridge.svg?branch=master)

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

-   [isWebViewBridgeAvailable](#isWebViewBridgeAvailable)
-   [requestContact](#requestcontact)
-   [createCalendarEvent](#createcalendarevent)
-   [share](#share)
-   [setWebViewTitle](#setwebviewtitle)
-   [updateNavigationBar](#updateNavigationBar)
-   [nativeConfirm](#nativeconfirm)
-   [nativeAlert](#nativealert)
-   [nativeMessage](#nativemessage)
-   [logEvent](#logevent)
-   [setScreenName](#setscreenname)
-   [reportStatus](#setscreenname)

### isWebViewBridgeAvailable

Returns true if WebView Bridge is available. Use this function to implement
fallbacks in case the bridge is not available.

```typescript
isWebViewBridgeAvailable: () => boolean;
```

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

### setWebViewTitle

Update webview title. If the bridge is not present, automatically fallbacks to a
`document.title` update.

```typescript
setWebViewTitle: (title: string) => Promise<void>;
```

#### Example

```javascript
import {setWebViewTitle} from '@tef-novum/webview-bridge';

setWebViewTitle('My new title');
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
    showBackButton?: boolean;
    showReloadButton?: boolean;
    backgroundColor?: string;
}) => Promise<void>
```

-   `title`: updates NavigationBar title
-   `showBackButton`: shows or hides NavigationBar Back button
-   `showReloadButton`: shows or hides NavigationBar Reload button
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
    showBackButton: true,
    showReloadButton: false,
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
    acceptText?: string;
    cancelText?: string;
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
}).then(res => {
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
    buttonText?: string;
}) => Promise<void>;
```

#### Example

```javascript
import {nativeAlert} from '@tef-novum/webview-bridge';

nativeAlert({
    message: 'Purchase completed!',
    title: 'Ok!',
}).then(res => {
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
}).then(res => {
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

#### Example

```javascript
import {logEvent} from '@tef-novum/webview-bridge';

logEvent({
    category: 'topup-flow',
    action: 'topup',
}).then(() => {
    console.log('event logged');
});
```

### setScreenName

Log the current screen name (or page name) to firebase

```typescript
setScreenName: (screenName: string) => Promise<void>;
```

#### Example

```javascript
import {setScreenName} from '@tef-novum/webview-bridge';

setScreenName('Topup Flow').then(() => {
    console.log('screen name logged');
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

You have these features avalaibles:

-   `notifications`

```typescript
checkPermissionStatus: (feature: string, params?: {[key: string]: string},) => Promise<boolean>;
```

#### Example

```javascript
import {checkPermissionStatus} from '@tef-novum/webview-bridge';

checkPermissionStatus('notifications',{channelId: 'default'}).then((hasPermissions) => {
    console.log(hasPermissions);
}).catch(err => {
    console.error(err);
};
```

### internalNavigation

Init an internal and native navigation to a device specific feature

-   Available for app versions 11.4 and higher

You have these features avalaibles:

-   `notification-settings`

```typescript
internalNavigation: (feature: string) => Promise<void>;
```

#### Example

```javascript
import {internalNavigation} from '@tef-novum/webview-bridge';

internalNavigation('notification-settings')
.catch(err => {
    console.error(err);
};
```

## Error handling

If an error occurs, promise will be rejected with an error object:

```typescript
{code: number, description: string}
```

## License

This project is licensed under the terms of the MIT license. See the
[LICENSE](LICENSE) file.

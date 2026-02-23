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

```ts
isWebViewBridgeAvailable: () => boolean;
```

#### Inside an `iframe`

By default, the bridge will be disabled inside an iframe. If you want to enable
it, add a `data-enable-webview-bridge` attribute to the host `iframe` element.

#### Example

```javascript
if (isWebViewBridgeAvailable()) {
    nativeAlert('Hello'); // use bridge
} else {
    myCustomAlert('Hello'); // use alternative implementation
}
```

You may want to detect if the page is displayed inside a regular browser or an
Android or iOS WebView.

```javascript
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

-   If the user exists the flow without selecting a a contact, an error is
    returned

<img height="550" src="doc/webview-bridge-contact-ios.png"><img height="550" src="doc/webview-bridge-contact-android.png">

```ts
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
requestContact({filter: 'phone'}).then((contact) => {
    console.log(contact);
}).catch(err => {
    console.error(err);
};
```

### createCalendarEvent

Inserts an event in calendar

<img height="550" src="doc/webview-bridge-calendar-ios.png"><img height="550" src="doc/webview-bridge-calendar-android.png">

```ts
createCalendarEvent: ({
    beginTime: number,
    endTime: number,
    title: string
}) => Promise<void>;
```

`beginTime` and `endTime` are timestamps with millisecond precision

#### Example

```javascript
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

```ts
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
// sharing a text string
share({text: 'Hello, world!'});

// sharing a file
share({url: 'https://path/to/file', fileName: 'lolcats.png'});
```

### shareBase64

<kbd>App version >=24.6</kbd>

Invokes the native sharing mechanism of the device to share a file. The file is
provided as a base64 encoded string.

```ts
shareBase64: ({contentInBase64: string; fileName: string}) => Promise<void>;
```

-   The file type will be inferred from the `fileName` extension.

#### Example

```ts
shareBase64({
    contentInBase64: 'SGVsbG8sIHd(...)vcmxkCg==',
    fileName: 'hello.pdf',
});
```

### downloadBase64

<kbd>App version >=24.10</kbd> <kbd>App version >=24.9 in O2ES</kbd>

Opens the provided file using the download webview mode. The file is provided as
a base64 encoded string.

```ts
downloadBase64: ({contentInBase64: string; fileName: string}) => Promise<void>;
```

-   The file type will be inferred from the `fileName` extension. The file
    extension is mandatory. Take into account that iOS webview won't be able to
    render file types not supported by Safari.

#### Behaviour

##### Android

1. Once file is correctly processed, a "Downloaded" notification is shown in the
   system notifications inbox. System will try to open the file when clicking on
   it.
2. Simultaneously, app will try to open the given file, this may result in 3
   situations:
    - No app that can handle this type of file is available
        - Nothing will happen, user feedback will be just the previous generated
          notification.
    - Multiple apps can handle this type of file
        - System will show a desambiguator window to select the app which will
          be used to open the file.
    - Single app can open this type of file (Or an app is set as default for
      these kind of files)
        - Downloaded content will be opened using the only available App that
          supports its extension.

https://github.com/user-attachments/assets/6feaed05-89f2-467b-b017-dc966bae1213

##### iOS

The behavior will be similar to the current webview download mode but
downloading the file before showing it

1.- Once the file is correctly procesed, it will be stored in a tmp directory
2.- The app will open a modal webview presenting the local file in a web browser
similar to the one used in download webview mode but hiding the "Open in Safari"
button (due to no sense for a local file).

https://github.com/user-attachments/assets/66726efd-4867-4c08-997e-a85f9cfb7c31

#### Example

```ts
downloadBase64({
    contentInBase64: 'SGVsbG8sIHd(...)vcmxkCg==',
    fileName: 'hello.pdf',
});
```

### updateNavigationBar

<kbd>App version >= 10.7: Partial support</kbd><br/> <kbd>App version >= 11.8:
expandedTitle</kbd><br/> <kbd>App version >= 14.8: Additional properties and
deprecations</kbd><br/> <kbd>App version >= 25.12: isButton</kbd><br/>

Customize WebView NavigationBar properties. You can set one or more properties
in a single call

```ts
type NavigationBarIcon = {
    /** Identifier. The native side will notify the WebView when the icon is clicked using this id*/
    id: string;
    /** URL to be opened by the app as a deep-link if present */
    url?: string;
    /**
     * Accessibility label for the icon. When isButton=true you should always set a name, when isButton=false if you don't want it to be
     * read by screen readers, then explicitly set it to an empty string.
     * */
    name: string;
    /** Accessibility label for the icon */
    accessibilityLabel?: string;
    /** default: true, set to false if the Icon is decorative */
    isButton?: boolean;
    /**
     * This is a string whose value will be mapped to a local resource that the app already knows.
     * See https://void.tuenti.io/idl-server/files/TopNavbarIcon/1.1 for available values.
     * A fallback icon will be used if the app doesn't recognize the value.
     */
    iconEnum?: string;
    /**
     * Set of urls that the app will use to render the icon.
     * If both iconEnum and icon are received, the iconEnum should be used as a fallback in case there's some issue with the urls.
     */
    icon?: {
        /**
         * Those urls should be icons in PNG format.
         * The icons will not be rendered until the image has been downloaded by the app.
         * The URLs should be inmutable to allow the app to cache those icons for an arbitrary amount of time.
         */
        url: string;
        /** To be used if present when dark mode is activated. */
        urlDark?: string;
    };
    badge?: {
        /**
         * Boolean to determine if the badge should be shown
         * If `show` is `true` and number and nativeLogic are not present, the badge will be shown as a dot
         */
        show: boolean;
        /** Same logic and current same supported values as in nativeLogic field from API */
        nativeLogic?: 'INBOX' | 'PROFILE';
        /** Hardcoded value to set as the badge count. It will have more priority than nativeLogic. */
        number?: number;
    };
    /**
     * Tracking properties to be sent to analytics when the icon is clicked.
     * These properties will be merged to the tracking event produced by the native side
     */
    trackingProperties?: Record<string, string>;
}

updateNavigationBar = ({
    title?: string;
    expandedTitle?: string;
    showBackButton?: boolean;
    showReloadButton?: boolean;
    showProfileButton?: boolean; // deprecated in app version >= 14.8
    backgroundColor?: string;
    leftActions?: ReadonlyArray<NavigationBarIcon>; // requires app version >= 14.8
    rightActions?: ReadonlyArray<NavigationBarIcon>; // requires app version >= 14.8
    colorVariant?: 'INVERSE' | 'REGULAR' | null; // requires app version >= 14.8
    resetToDefaultState?: boolean; // requires app version >= 14.8
}) => Promise<void>
```

-   `title`: updates NavigationBar title
-   `expandedTitle`: updates NavigationBar expandedTitle. If the value is an
    empty string, the expanded navigation bar will not be shown. Only available
    in native app versions >= 11.8
-   `showBackButton`: shows or hides back icon in NavigationBar. On android, in
    case window does not support showing a back button (currently internal with
    modal presentation, which shows an X) this flag is ignored, as in these
    cases back navigation is always performed with the native back button
-   `showReloadButton`: shows or hides NavigationBar Reload button
-   `showProfileButton`: **DEPRECATED**. New apps will ignore this field
-   `backgroundColor`: change NavigationBar background color, use a hex color
    string (for example: `'#FF128A'`)
-   `leftActions`: array of icons to show in the left side
-   `rightActions`: array of icons to show in the right side
-   `colorVariant`: defines how the icons and the text of the top bar should be
    tinted. If null or unknown value is received, the initial colors set by the
    app or the last colorVariant set will be used
-   `resetToDefaultState`: This is a flag used to indicate that the appearance
    of the top bar should be restored to its original state. The other fields
    that may come in the same bridge call will be applied after the reset

#### Examples

```javascript
// updates WebView NavigationBar title
updateNavigationBar({title: 'Hello, World!'});

// full featured example
updateNavigationBar({
    title: 'Hello',
    expandedTitle: 'Hello, World!',
    showBackButton: true,
    showReloadButton: false,
    backgroundColor: '#FF0000',
    leftActions: [
        {
            id: 'iconID',
            name: 'icon name',
            iconEnum: 'SOME_ICON',
            badge: {
                show: true,
                nativeLogic: 'INBOX',
            },
        },
    ],
    rightActions: [
        {
            id: 'iconID',
            name: 'icon name',
            iconEnum: 'icon enum value',
            icon: {
                url: 'https://path/to/icon',
                urlDark: 'https://path/to/icon/dark',
            },
            badge: {
                show: true,
                number: 1,
            },
        },
    ],
    resetToDefaultState: true,
    trackingProperties?: {'name': 'some icon clicked'},
});
```

### onNavigationBarIconClicked

<kbd>App version >=14.8</kbd>

Listen to navigation bar icon clicks and execute a callback function

#### React example

```tsx
React.useEffect(() => {
    const unsubscribe = onNavigationBarIconClicked(({id}) => {
        console.log(`Icon with id ${id} clicked`);
    });

    // Unsubscribe when the component is unmounted
    return () => {
        unsubscribe();
    };
}, []);
```

### isABTestingAvailable

<kbd>App version >=10.8</kbd>

Returns true if A/B testing named with the key is available.

```ts
isABTestingAvailable: (key: string) => Promise<boolean>;
```

### nativeConfirm

<kbd>App version >=24.6 `destructive` support.</kbd>

Show a native confirm dialog.

If the bridge is not present (eg. showing the page in browser), fallbacks to a
browser confirm.

<img height="550" src="doc/webview-bridge-confirm-ios.png"><img height="550" src="doc/webview-bridge-confirm-android.png">

```ts
nativeConfirm: ({
    message: string;
    title?: string;
    acceptText: string;
    cancelText: string;
    destructive?: boolean;
}) => Promise<boolean>;
```

#### Example

```javascript
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

```ts
nativeAlert: ({
    message: string;
    title?: string;
    buttonText: string;
}) => Promise<void>;
```

### nativeMessage

<kbd>App version >=14.10 `withDismiss`, `duration` and `action` in
response</kbd>.

<kbd>App version >=24.6 `buttonAccessibilityLabel` support</kbd>.

Show a native snackbar message. Use it to display feedback messages.

If the bridge is not present (eg. showing the page in browser), fallbacks to a
browser alert.

<img height="550" src="doc/webview-bridge-message-ios.png"><img height="550" src="doc/webview-bridge-message-android.png">

```ts
nativeMessage: ({
        message: string;
        duration?: 'PERSISTENT';
        buttonText?: string;
        buttonAccessibilityLabel?: string;
        type?: 'INFORMATIVE' | 'CRITICAL' | 'SUCCESS';
        withDismiss?: boolean;
}) => Promise<{
    action: 'DISMISS' | 'BUTTON' | 'TIMEOUT' | 'CONSECUTIVE';
}>;
```

#### Example

Show a native Snackbar with button

```javascript
nativeMessage({
    message: 'Operation finished!',
    buttonText: 'Ok',
}).then((res) => {
    if (res.action === 'BUTTON') {
        console.log('Button clicked');
    }
    console.log('Snackbar closed');
});
```

### logEvent

Log an event to firebase

```ts
logEvent: ({
    category: string; // Typically the object that was interacted with (e.g. 'Video')
    action: string; // The type of interaction (e.g. 'play')
    label?: string; // Useful for categorizing events (e.g. 'Fall Campaign')
    value?: number; // A numeric value associated with the event (e.g. 43)
}) => Promise<void>;
```

If you want to use new Google Analytics 4 event format you can use this method
too:

```ts
logEvent: ({
    name: string; // The event name is mandatory
    [key: string]: any; // You can set any other event parameters
}, {
    sanitize?: boolean; // Whether to sanitize the event params, this only affects to FirebaseEvents. true by default.
}) => Promise<void>;
```

#### Example

```javascript
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

```ts
setScreenName: (
  screenName: string,
  params?: { [key: string]: any },
  options?: { sanitize?: boolean }
) => Promise<void>;
```

By default, the screen name and params are sanitized (removing accents, special
characters, lowercasing, etc). If you want to disable sanitization for the
params (for example, to send them exactly as provided), you can pass the
`sanitize: false` option. Note that the screen name itself will always be
sanitized.

```javascript
setScreenName('My Screen Name', {}, {sanitize: false});
```

This will send the params as-is, without any transformation.

### setUserProperty

Set a user property to firebase

```ts
setUserProperty: (name: string, value: string) => Promise<void>;
```

### reportStatus

<kbd>App version >=11.2</kbd>

Report a given feature status

```ts
reportStatus: ({feature: 'ACCOUNT', status: 'CRITICAL' | 'GOOD' | 'BAD', reason: string}) => Promise<void>;
```

### onNativeEvent

<kbd>App version >=11.3</kbd>

Listens to native app events

```ts
type NativeEventHandler = ({ event }: {event: string}) => {action: 'default'};

onNativeEvent: (handler: NativeEventHandler) => () => void;
```

#### Example

```ts
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

Avalaible features:

-   `notifications`
-   `read-contacts` (Available for app versions 13.10 and higher)
-   `write-contacts` (Available for app versions 13.10 and higher)

```ts
checkPermissionStatus: (feature: string, params?: {[key: string]: string}) => Promise<boolean>;
```

#### Example

```javascript
checkPermissionStatus('notifications', {channelId: 'default'}).then(
    (hasPermissions) => {
        console.log(hasPermissions);
    },
);
```

### internalNavigation

Init an internal and native navigation to a device specific feature

Avalaible features:

-   `notification-settings`
-   `contact-settings` <kbd>App version >=13.10 </kbd>
-   `location-settings` <kbd>App version >=25.8</kbd>
-   `permissions-settings` <kbd>App version >=26.1</kbd>
-   `accessibility-settings` <kbd>App version >=26.1</kbd>

```ts
internalNavigation: (feature: string) => Promise<void>;
```

### dismiss

Dismiss the current webview if possible and optionally navigate to another URL.
If we can't do the dismiss, for example, if the webview is one of the main tabs,
the optional URL won't be opened.

```ts
dismiss: (onCompletionUrl?: string) => Promise<void>;
```

#### Error cases

```ts
{
    code: 405;
    reason: 'Webview is not allowed to dismiss because we only have one webview instance in the navigation stack.';
}
```

### requestVibration

Requests the phone to vibrate. Options are 'error' or 'success'.

```javascript
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

### addOrEditContact

Opens native UI to add or edit a contact in the device's phonebook.

```ts
addOrEditContact: (phoneNumber: string) => Promise<{
    phoneNumber?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    encodedAvatar?: string;
}>
```

-   If phoneNumber already exists in the device phonebook, the user will be able
    to edit the information.
-   If phoneNumber is saved under multiple names in the phonebook, when editing
    it should choose the first one alphabetically
-   If phoneNumber doesn't exist in the phonebook, the user will be able to add
    it, providing the related info.
-   If the user edits the phone number of the contact, the new value is returned
    in the phoneNumber field
-   If the user exists the flow without selecting a a contact, an error is
    returned

Once the user has added or updated the contact, native returns the new
information (all last values of every property).

### getAppMetadata

<kbd>App version >=11.8</kbd>

Check if an app is installed in the phone

```ts
getAppMetadata: (appToken: string) => Promise<{
    isInstalled: boolean;
    marketUrl: string;
    appUrl: string
}>;
```

-   `appToken`: token that refers to a "friend" application
-   `isInstalled`: boolean to see if the app is installed
-   `appUrl`: string url to launch an app installed on the phone
-   `marketUrl`: string url to launch the store in a specific application

### getDiskSpaceInfo

<kbd>App version >=11.10</kbd>

Return info about how much free disk space the device has

```ts
getDiskSpaceInfo: () => Promise<{availableBytes: number, totalBytes: number}>;
```

-   `availableBytes`: number to see available bytes in the device
-   `totalBytes`: number to see the total bytes in the device

### getEsimInfo

<kbd>App version >=12.3 `supportsEsim`</kbd><br/> <kbd>App version >=14.8
`eid`</kbd>

Return info about the esim capabilities of the device

```ts
getEsimInfo: () => Promise<{supportsEsim: boolean, eid?: string | null}>;
```

-   `supportsEsim`: tells if the device supports esim
-   `eid`: "Embedded Identity Document". The serial number corresponding to the
    eSIM installed in a device.

### getDeviceModel

<kbd>App version >=14.8</kbd>

Returns the device model, like `"SAMSUNG-SM-G930A"`, `"iPhone9"`, ...

```ts
getDeviceModel: () => Promise<{model: string} | null>;
```

### setTrackingProperty

<kbd>App version >=12.4</kbd>

Sets a property related to some specific tracking system

```ts
setTrackingProperty: (system: 'palitagem' | 'medallia', name: string, value?: string) => Promise<void>;
```

-   `system`: Tracking system that will handle the property
-   `name`: name of the property
-   `value`: value of the property (nullable)

### setActionBehavior

<kbd>App version >=12.7</kbd>

Method that allows defining an specific behavior (such as showing a
confirmation) before the specific native actions are executed. This method also
allows disabling any previous behaviors set.

```ts
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

### getTopazValues

<kbd>App version >=24.9</kbd>

Returns an object containing values from the
[Topaz](https://www.topaz.com.br/ofd/index.php) SDK.

```ts
getTopazValues = () => Promise<{syncId?: string}>
```

### showAppRating

Show native app rating dialog

<img height="550" src="doc/webview-bridge-app-rating-ios.png"><img height="550" src="doc/webview-bridge-alert-android.png">

```ts
showAppRating = () => Promise<void>
```

### bottomSheet

<kbd>App version >=13.8</kbd>

Show native bottom sheet UI.

We don't recommend using this method directly, instead use the
[Mistica implementation](https://mistica-web.vercel.app/?path=/story/components-modals-sheet--show-sheet)
which provides a more user-friendly interface with predefined cases and
fallbacks to a web implementation when the native bridge is not available.

<img height="460" src="doc/webview-bridge-bottom-sheet.png">

```ts
bottomSheet = (payload: SheetUI) => Promise<SheetResponse>
// see SheetUI and SheetResponse types
```

:warning: If you try to call this method repeatedly while a sheet is already
being opened (for example, user accidental double tap), it will throw an Error
with code `423` (Locked)

### fetchPhoneNumbers

<kbd>App version >=13.10</kbd>

Fetch all the phone numbers of the native phonebook

```ts
fetchPhoneNumbers:() => Promise<Array<{
    id: string;
    value: string;
}>>;
```

### updatePhoneNumbers

<kbd>App version >=13.10</kbd>

Updates the given phone numbers in the native phonebook

```ts
updatePhoneNumbers:(Array<{
    id: string;
    value: string;
}>) => Promise<Void>;
```

### highlightNavigationTab

Method that allows WebView to highlight a home tab bar setting a badge (numeric
or not)

```ts
highlightNavigationTab: ({
    tab: string,
    highlight: boolean,
    count?: number
}) => Promise<void>;
```

-   If `highlight` is `false`: no badge is shown
-   If `highlight` is `true`:
    -   If `count` is not `null`, it will show a numeric badge with `count`value
    -   If `count` is `null`, it will show a non-numeric badge

### getAttStatus

<kbd>App version >=14.7 (iOS)</kbd>

Method that allows a WebView to ask an iOS app user about the authorization
status of his ATT
([App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency))
permission.

Resolves to `null` if the app is not running on iOS or if the method is not
available

```ts
getAttStatus: () => Promise<{status:'granted' | 'denied' | 'unknown'} | null>;
```

### getNetworkConnectionInfo

<kbd>App version >=14.11</kbd>

Obtain metainformation about the current device data network connectivity

```ts
getNetworkConnectionInfo: () => Promise<{
    connectionType: 'MOBILE' | 'WIFI ' | 'OTHER' | 'NONE';
    mobileConnectionType?:
        | '2G'
        | '3G'
        | '4G'
        | '5G'
        | 'OTHER'
        | 'PERMISSION_REQUIRED'
        | null;
    mobileCarrier?: string | null;
    mobileSignalStrength?:
        | 'NONE'
        | 'POOR'
        | 'MODERATE'
        | 'GOOD'
        | 'GREAT'
        | null;
}>;
```

-   `connectionType`: describes the network technology used currently for data
-   `mobileConnectionType`: in case connectionType is 'MOBILE' gives further
    details about the network technology used. PERMISSION_REQUIRED value will be
    returned only in Android when READ_PHONE_STATE permission has not been
    granted by the user. The permission request is already managed by the
    Android implementation itself.
-   `mobileCarrier`: identifies the carrier used for 'MOBILE' connectionType
-   `mobileSignalStrength`: gives a measure of the current signal strength for
    'MOBILE' connectionType.

### getPincodeInfo

<kbd>App version >=24.2</kbd>

Check if the pincode is enabled or not

```ts
getPincodeInfo: () => Promise<{
    status: 'enabled' | 'disabled'
}>;
```

### getProfileImage

<kbd>App version >=14.9</kbd>

Read current profile picture

```ts
getProfileImage: () => Promise<{
    image: string | null
}>;
```

-   `image`: base64 encoded image or null if there is no image

### startProfileImageFlow

<kbd>App version >=14.9</kbd>

Starts the native flow to change the profile picture

```ts
startProfileImageFlow: () => Promise<{
    image: string | null;
    isCancelled: boolean;
}>;
```

-   `image`: base64 encoded image or null if the image was removed or the flow
    cancelled
-   `isCancelled`: true if the user cancelled the flow

### showLineSelector

<kbd>App version >=25.x</kbd>

Opens the native line selector dialog

#### Error cases

-   405: line selector feature is not allowed (feature is disabled)
-   409: line selector is already presented (Invoking the selector if there is
    already one showing causes this error)

### getDeviceTac

<kbd>App version >=24.3</kbd>

Get device [TAC identifier](https://en.wikipedia.org/wiki/Type_Allocation_Code).

```ts
getDeviceTac: () => Promise<{
    tac: string | null
}>;
```

-   `tac`: The TAC identifier is the first 8 digits of the IMEI. We already have
    a method to get the IMEI but to obtain this value, we need carrier
    privileges permission which in many cases we don't have. To get the TAC we
    don't need any special permission because it only identifies the device
    model, not the device itself. Will be `null` if it's not available (iOS
    devices or Android < 10).

### triggerPinOrBiometricAuthentication

<kbd>App version >=24.4</kbd>

Triggers pin/biometric authentication if necessary, taking into account 3
possible scenarios:

-   If user has pin/biometric already configured in the app:
    -   If last previous authentication (or last pin/biometric setup) is still
        valid, nothing will be presented to user and bridge method will succeed.
    -   Otherwise, authentication will be required, blocking the user until it
        is performed.
-   In any other case, user will be taken directly to the screen where user can
    introduce a new PIN and enable any other authentication methods. In case
    user leaves the screen without providing an authentication method, bridge
    method will fail with 401 code.

```ts
triggerPinOrBiometricAuthentication: ({
    maxSecondsSinceLastValidation: number
}) => Promise<{
    result: 'USER_AUTHENTICATED' | 'USER_ENABLED_AUTHENTICATION' | 'LAST_AUTHENTICATION_STILL_VALID' | 'DEVICE_HAS_NO_AUTHENTICATION',
}>;
```

-   `maxSecondsSinceLastValidation`: if time elapsed since last authentication
    is less than the number of seconds specified here authentication will
    succeed without requesting it again, returning
    `LAST_AUTHENTICATION_STILL_VALID`

<kbd>App version >=25.5</kbd>

If the new PIN & Biometrics 2.0 (device authentication) feature is enabled,
there are a couple of details to take into account:

-   If the setting is not enabled by the user, the device authentication will be
    asked and if it goes right, the setting will be enabled and the method will
    return `USER_ENABLED_AUTHENTICATION`
-   If the setting is already enabled by the user, the device authentication
    will be asked and if it goes right, the setting will remain unchanged
    (enabled) and the method will return `USER_AUTHENTICATED`
-   If the device doesn't have any authentication configured, the method will
    return `DEVICE_HAS_NO_AUTHENTICATION` as result.

### focusNavbar

<kbd>App version >= 24.9</kbd>

Sets the screen reader focus on the native navigation bar. If the webview
doesn't have a native navbar, the native app will respond with
`{focused: false}`.

This is useful for accessibility purposes. We need the focus to be set in the
navbar when we navigate to a new screen using client side navigation (React
Router).

```ts
focusNavbar: () => Promise<{
    focused: boolean,
}>;
```

### openOnboarding

Opens the app Onboarding (as if it where the first time the user logs in)

```ts
openOnboarding = () => Promise<void>
```

### getBatteryInfo

<kbd>App version >=24.10</kbd>

Obtains information about the device battery status

```ts
getBatteryInfo: () => Promise<{
    batteryLevel: number | null;
    isPowerSafeMode: boolean;
}>;
```

-   `batteryLevel`: battery level in percentage (0 - 100). `null` if the battery
    information is unavailable.
-   `isPowerSafeMode`: true if the device is in power saving mode.

### readTextFromClipboard

<kbd>App version >=24.10</kbd>

Reads the current text in the clipboard

```ts
readTextFromClipboard: () => Promise<string>;
```

### writeTextToClipboard

<kbd>App version >=24.10</kbd>

Writes the given text to the clipboard

```ts
writeTextToClipboard: (text: string) => Promise<void>;
```

### showLoadingOverlay / hideLoadingOverlay

<kbd>App version >=24.10</kbd>

Shows a loading overlay screen while a task is being performed. You can control
when to hide it with the `hideLoadingOverlay` method.

Note: Depending on the configuration used to show the overlay,
`hideLoadingOverlay` won't immediately hide it, in all cases you should wait for
its promise to be resolved in order to know when the native overlay is
effectively closed.

| Overlay Success Example                                                                       | Overlay Failure Example                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <video src="https://github.com/user-attachments/assets/d46bb10c-e868-42d7-bed3-a171f34192e7"> | <video src="https://github.com/user-attachments/assets/8f2f6a8e-0570-437b-8f98-c905bcb224fd"> |

```ts
showLoadingOverlay: ({
    /**
     * Whether the in animation is enabled (false by default)
     */
    inAnimation?: boolean;
    /**
     * Whether the out animation is enabled (false by default)
     */
    outAnimation?: boolean;
    /**
     * Minimum duration of the loop animation in milliseconds (0 by default)
     */
    minimumLoopDurationMs?: number;
    /**
     * whether the loop animation should be stopped immediately or not (true by default)
     */
    stopAnimationCycle?: boolean;
    /**
     * List of description texts to be shown one after the other
     */
    descriptions?: Array<string>;
    /**
     * Duration of each description in milliseconds (3000 by default)
     */
    descriptionDurationMs?: number;
    /**
     * After this timeout loading screen would be hidden automatically (20000 by default)
     */
    timeoutMs?: number;
    /**
     * (Only Android) If true, after loading screen has been hidden, if user presses android back button, webview window will close (true by default)
     */
    closeOnBackButtonPressAfterFinish?: boolean;
}) => Promise<void>;

hideLoadingOverlay: () => Promise<void>;
```

#### Example

```ts
await showLoadingOverlay({
    inAnimation: true,
    outAnimation: true,
    stopAnimationCycle: false,
    descriptions: ['Loading...', 'Please wait...'],
    descriptionDurationMs: 3000,
});
await doExpensiveTask();
await hideLoadingOverlay();
```

#### Error cases

If `showLoadingOverlay` is called while the loading overlay is already being
shown, the promise will be rejected with an error object with the following
type:

```ts
{
    code: 503;
    description: 'Loading screen already showing';
}
```

### getInstallationId

<kbd>App version >=24.11</kbd>

Returns the application installation id. A 32 hexadecimal characters long string
that represents one installation of the native app.

```ts
getInstallationId: () => Promise<{installationId: string}>;
```

### getUnseenNotificationsBadge / setUnseenNotificationsBadge

<kbd>App version >=24.12</kbd>

get/set the number of unseen notifications in the inbox and the last time the
counter was updated (timestamp in milliseconds).

```ts
getUnseenNotificationsBadge: () => Promise<{unseenNotificationCounter: number; lastUpdated: number}>;
```

```ts
setUnseenNotificationsBadge: ({unseenNotificationCounter: number; lastUpdated: number}) => Promise<void>;
```

When the webview is opened, it will ask to the native app for the unseen
notifications badge (`getUnseenNotificationsBadge`). This allows the webview to
know if the native app has received any push while the webview was closed. The
webview will check the `lastUpdated` timestamp receibed from the native app with
the one persisted in the webview `localStorage`, if it's different, the webview
will fetch the inbox from server. When the webview updates their state, it will
persist the lastUpdated timestamp in the localStorage and send it to the native
app using the `setUnseenNotificationsBadge`. This way, the next time the webview
use the getter, it will know if the `lastUpdated` matches with the one persisted
in `localStorage`.

### requestDatamobDeviceAdmin

<kbd>App version >=25.1</kbd>

Datamob is a native library that offer developers a way to integrate security
and remote device control features into their applications.

The application that implements the Datamob library must be registered as a
system management application (Device Admin). This configuration is essential to
allow the application to have sufficient permissions to execute security
commands, such as screen lock and factory reset.

This method opens a setting screen asking the user to accept system management
permissions for the application.

```ts
requestDatamobDeviceAdmin: () => Promise<{isAdmin: boolean}>;
```

`isAdmin` is true if the permission was granted.

#### Demo

https://github.com/user-attachments/assets/28095f42-76db-4ac2-9586-e350acef7e1d

### unregisterDatamobDeviceAdmin

Method to unregister the application as a system management application.

```ts
unregisterDatamobDeviceAdmin: () => Promise<void>;
```

### registerDatamobUser

<kbd>App version >=25.1</kbd>

The application that implements the Datamob should have an user registered. This
method is used to register one.

```ts
registerDatamobUser: ({phoneNumber: string, tokenPassword: string}) => Promise<void>;
```

-   `phoneNumber`: The phone number of the user.
-   `tokenPassword`: When registering the device, datamob generate an accessKey
    that is recorded in the Datamob device registry. By combining this attribute
    with a hash that we keep in a password vault, generate this token.

#### Error cases

If the registration fails, the promise will be rejected with an error object
with the following type:

```ts
{
    code: 500;
    reason: `Registration error: ${errorDescription}`;
}
```

### validateDatamobRequirements

<kbd>App version >=25.1 (Android only)</kbd>

Datamob sdk allows to send remote commands to the user device. These remote
commands include actions such as locking the device screen (lock screen) or even
forcing a wipe (factory reset) of the device, providing additional security
control for the end user.

This method returns a map with the requirements. Each requirement is a boolean
value where true is valid, false is not valid.

```ts
validateDatamobRequirements: ({phoneNumber: string, tokenPassword: string}) => Promise<{
    deviceAdmin: boolean;
    lockPassword: boolean;
    accessibilityOption: boolean;
    invalidPhoneNumber: boolean;
    invalidToken: boolean;
}>
```

-   `phoneNumber`: The phone number of the user.
-   `tokenPassword`: When registering the device, datamob generate an accessKey
    that is recorded in the Datamob device registry. By combining this attribute
    with a hash that we keep in a password vault, generate this token.

-   returns a map with the requirements.

### displayQualtricsIntercept

<kbd>App version >=24.12 (iOS only)</kbd>

Uses the Qualtrics SDK to display a survey intercept to the user. It needs to be
used in combination with `isQualtricsInterceptAvailableForUser`, ensuring
intercept is available before requesting its display. Display result depends on
the last evaluation performed by that method.

The native app will try to show the survey related to the provided `interceptId`

It will return a boolean (`displayed`) indicating if the survey has been
displayed or not.

```ts
displayQualtricsIntercept: ({interceptId: string}) => Promise<{displayed: boolean}>;
```

#### Error cases

```ts
{
    code: 500;
    reason: 'Internal Error'; // If an error occurred invoking the SDK;
}
```

```ts
{
    code: 501;
    reason: 'SDK not initialized';
}
```

### setQualtricsProperties

<kbd>App version >=24.12 (iOS only)</kbd>

Method to set properties in Qualtrics SDK before displaying a survey.

```ts
setQualtricsProperties: ({
    stringProperties?: {[key: string]: string};
    numberProperties?: {[key: string]: number};
    dateTimePropertyKeys?: Array<string>;
}) => Promise<void>;
```

#### Error cases

```ts
{
    code: 500;
    reason: 'Internal Error'; // If an error occurred invoking the SDK;
}
```

```ts
{
    code: 501;
    reason: 'SDK not initialized';
}
```

### isQualtricsInterceptAvailableForUser

<kbd>App version >=24.12 (iOS only)</kbd> <kbd>App version >=25.10:
surveyUrl</kbd>

Check if a Qualtrics intercept is available for the user, performing its
evaluation. When available, a `surveyUrl` with the generated survey url is
returned (only in App version >=25.10).

```ts
isQualtricsInterceptAvailableForUser: ({interceptId: string}) => Promise<{isAvailable: boolean; surveyUrl?: string | null}>;
```

#### Error cases

```ts
{
    code: 500;
    reason: 'Internal Error'; // If an error occurred invoking the SDK;
}
```

```ts
{
    code: 501;
    reason: 'SDK not initialized';
}
```

### requestAllowMeBiometrics

<kbd>App version >=25.3</kbd>

Method to start the AllowMe native SDK biometrics flow.

```ts
requestAllowMeBiometrics: () => Promise<{
    result?: string;
    images: Array<string>;
}>;
```

-   `result`: cryptographed payload containing safety information about the
    image capture process.
-   `images`: is an array of base64 encoded images captured during the process.

#### Error cases

This SDK can return several errors, and they can be different between iOS and
Android. Below you have the list of both platforms:

| Error                                    | Android | iOS | Code    |
| ---------------------------------------- | ------- | --- | ------- |
| `AllowMeGenericError`                    | ❌      | ✅  | 500\*   |
| `AllowMeUnauthorizedError`               | ✅      | ✅  | 401\*\* |
| `AllowMeSetupSdkError`                   | ✅      | ✅  | 1001    |
| `AllowMeTimeoutProcessingError`          | ❌      | ✅  | 1002    |
| `AllowMeApiKeyError`                     | ❌      | ✅  | 1003    |
| `AllowMeInstanceCreationError`           | ❌      | ✅  | 1004    |
| `AllowMeBiometricsTimeoutError`          | ✅      | ✅  | 1005    |
| `AllowMeBiometricsSetupError`            | ✅      | ✅  | 1006    |
| `AllowMeBiometricsCameraError`           | ✅      | ✅  | 1007    |
| `AllowMeBiometricsCapturingError`        | ✅      | ✅  | 1008    |
| `AllowMeBiometricsResultError`           | ✅      | ✅  | 1009    |
| `AllowMeBiometricsCancelledByUserError`  | ✅      | ✅  | 1010    |
| `AllowMeBiometricsInvalidImagesError`    | ❌      | ✅  | 1011    |
| `AllowMeBiometricsCameraPermissionError` | ✅      | ✅  | 1012    |
| `AllowMeCanNotOpenFrontCameraError`      | ✅      | ❌  | 1013    |
| `AllowMeGooglePayServicesError`          | ✅      | ❌  | 1014    |
| `AllowMeFaceDetectionError`              | ✅      | ❌  | 1015    |
| `AllowMeProviderError`                   | ✅      | ✅  | 1016    |
| `AllowMeCanNotSaveImageError`            | ✅      | ❌  | 1017    |

\*500: Generic error send by iOS with a descriptive error message

\*\*401: Unauthorized error in case the bridge calls this method from an
unsupported brand (any other than Vivo).

When one of these errors occurs, the promise will be rejected with an error with
this shape:

```ts
export type AllowMeError = {
    code: AllowMeErrorCode;
    description?: string;
};
```

#### Example

```ts
try {
    const {result, images} = await requestAllowMeBiometrics();
} catch (error: AllowMeError) {
    switch (error.code) {
        case AllowMeSetupSdkError:
            console.log('Setup error');
            break;
        case AllowMeUnauthorizedError:
            console.log('Unauthorized error');
            break;
        // etc
    }
}
```

### getBiometricsAuthenticationStatus

<kbd>App version >=25.7</kbd>

Retrieve information about the availability of Biometrics

```ts
getBiometricsAuthenticationStatus: () => Promise<{
    result: 'DISABLED' | 'ENABLED' | 'DEVICE_HAS_NO_AUTHENTICATION',
}>;
```

#### Result description

-   `'DISABLED'`: The device has an authentication method (device PIN code at
    least, and biometrics optionally) but it has the biometrics option disabled
    in the app
-   `'ENABLED'`: The device has an authentication method (device PIN code at
    least, and biometrics optionally) and it has the biometrics option enabled
    in the app (it requires authentication when launching the app)
-   `'DEVICE_HAS_NO_AUTHENTICATION'`: The device has not any authentication
    method (it has no device PIN code neither biometrics)

#### Error cases

-   `404`: The bridge implementation does not support this feature
-   `500`: User is not logged in

### setBiometricsAuthenticationStatus

<kbd>Available in B2P App version >= 25.9</kbd>

Set the current status of the biometrics authentication on the device.

```ts
setBiometricsAuthenticationStatus: ({enable: boolean}) => Promise<void>;
```

#### Parameters

-   `enable`: Whether if the biometrics option has to be enabled (triggering the
    biometrics setting UI) or disabled

#### Error cases

-   `400`: enable parameter is missing
-   `401`: User is not logged in
-   `500`: Native side error while applying the setting
-   `503`: The device has no biometrics available, or the user cancelled
    modifying biometric settings.

### setupLocatorSdkConfig

<kbd>App version >= TBD</kbd>

Enable/configure Family Locator SDK. Wrapper for `sdk.setConfig(config)`.

```ts
setupLocatorSdkConfig: (config: LocatorSdkConfig) => Promise<void>;
```

#### Types

```ts
export type LocatorSdkConfig = {
    license: string;
    sdkVersion: string;
    osPlatform: string;
    api: {
        token: string;
        certUrl?: string;
        scopesUrl?: string;
        tokenUrl?: string;
        configUrl?: string;
        groupsUrl?: string;
        featuresUrl?: string;
        geofencesUrl?: string;
    };
    mqtt: {
        clientId?: string;
        broker?: string;
        port?: string;
        username?: string;
    };
    process: {
        retryPolicy?: {
            maxRetries?: number;
            baseDelayMs?: number;
            backoffFactor?: number;
        };
        offlineRetentionDays?: number;
        foregroundServiceNotification?: {
            title?: string;
            message?: string;
        };
    };
    battery?: {
        events?: Array<{
            name: string;
            min: number;
            max: number;
            interval: number;
            charging: boolean;
            powerMode: Array<'normal' | 'power_saver' | 'super_saver'>;
        }>;
    };
    motion?: {
        sensitivity?: number;
    };
    collect?: {
        collectIntervalMillis?: number;
        sendIntervalMillis?: number;
        minDisplacementMeters?: number;
        maxTravelDistanceMeters?: number;
        highAccuracy?: boolean;
        maxBatchSize?: number;
    };
    audioRecord?: {
        recordsCount: number;
        durationSeconds: number;
        retryCount: number;
        intervalSeconds: number;
        audioServiceNotification?: {
            title?: string;
            message?: string;
        };
    };
    revision?: number;
    createdAt?: number;
    updatedAt?: number;
};
```

#### Example

```ts
setupLocatorSdkConfig({license: 'xxx', sdkVersion: '2.0.1'});
```

#### Error cases

-   401: `LocatorSDKMissingPermissionsException`
-   402: `LocatorSDKNoConfigSetException`
-   500: Internal Error

### getLocatorSdkState

<kbd>App version >= TBD</kbd>

Check if the SDK is configured. Wrapper for `getState`.

```ts
getLocatorSdkState: () => Promise<{state: string}>;
```

### setLocatorSdkMode

<kbd>App version >= TBD</kbd>

Start real-time sharing or SOS. Wrapper for `setSdkMode`.

```ts
setLocatorSdkMode: (mode: 'default' | 'observed' | 'sos' | string) => Promise<void>;
```

### getLocatorJwtToken

<kbd>App version >= TBD</kbd>

Get JWT token for map backend auth. Wrapper for `getJwtToken`.

```ts
getLocatorJwtToken: () => Promise<{token: string}>;
```

### getLocatorPendingPermissions

<kbd>App version >= TBD</kbd>

Get pending permissions. Wrapper for `pendingPermissions`.

```ts
getLocatorPendingPermissions: () => Promise<{permissions: Array<string>}>;
```

#### Permission identifiers

Android

-   `location_fine`
-   `location_coarse`
-   `location_background`
-   `activity_recognition`
-   `body_sensors`
-   `battery_optimization`
-   `foreground_service`
-   `foreground_service_location`
-   `access_network_state`

iOS

-   `location_in_use`
-   `location_background`
-   `motion_usage`
-   `fall_detection`

### getLocatorSdkVersion

<kbd>App version >= TBD</kbd>

Get SDK version. Wrapper for `getVersion`.

```ts
getLocatorSdkVersion: () => Promise<{version: string}>;
```

### getLocatorSdkSession

<kbd>App version >= TBD</kbd>

Get SDK session. Wrapper for `getSession`.

```ts
getLocatorSdkSession: () => Promise<{
    session: {
        id: string;
        startAt: number;
        endAt: number | null;
    };
}>;
```

### getLocatorSdkMode

<kbd>App version >= TBD</kbd>

Get current SDK mode. Wrapper for `getSdkMode`.

```ts
getLocatorSdkMode: () => Promise<{mode: 'default' | 'observed' | 'sos' | string}>;
```

### getLocatorSdkConfig

<kbd>App version >= TBD</kbd>

Get current SDK config. Wrapper for `getConfig`.

```ts
getLocatorSdkConfig: () => Promise<{config: LocatorSdkConfig | null}>;
```

### openOcrScanner

<kbd>App version >=26.1</kbd>

Opens a native OCR scanner that looks for text matching the provided regular
expression. When a text is found matching the pattern, the scanner closes and
returns the scanned text. Only the first text that matches the pattern will be
returned.

The scanner will attempt to request camera permissions automatically. Only
available in Mein Blau and Mein O2.

```ts
openOcrScanner: ({regex: string, timeoutMs?: number}) => Promise<{scannedText: string}>;
```

#### Parameters

-   `regex`: Regular expression pattern to match the scanned text
-   `timeoutMs`: Timeout in milliseconds before closing the scanner
    automatically if no text is scanned. Optional, default is 15000 milliseconds

#### Response

-   `scannedText`: The scanned text matching the regex pattern.

#### Example

```ts
openOcrScanner({regex: '\\b(?:\\d{4}-\\d{4}-\\d{4}-\\d{4}|\\d{16})\\b'})
    .then((result) => {
        if (result.scannedText) {
            console.log('Scanned text:', result.scannedText);
            // Example output: "1234-5678-8765-4321"
        } else {
            console.log('User closed scanner without scanning');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```

#### Error cases

-   `204`: User manually closed OCR scanner
-   `401`: Missing permissions (user rejected camera permissions)
-   `405`: Feature not supported in current brand (only available in Mein Blau
    and Mein O2)
-   `408`: Timeout reached without scanning any text
-   `500`: Internal error (e.g., unexpected error thrown by native scanner)

## Error handling

If an uncontrolled error occurs, promise will be rejected with an error object:

```ts
{code: number, description: string}
```

## Debugging

To inspect the bridge traffic, you can use the `setLogger` method:

```ts
setLogger((...args) => console.log(...args));
```

## License

This project is licensed under the terms of the MIT license. See the
[LICENSE](LICENSE) file.

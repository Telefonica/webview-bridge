# CHANGELOG

## v.3.48.0 - 2024-12-16

-   Datamob sdk: `unregisterDatamobDeviceAdmin`.

## v.3.47.0 - 2024-12-12

-   Qualtrics sdk methods: `displayQualtricsIntercept`,
    `setQualtricsProperties`, `isQualtricsInterceptAvailableForUser`.

## v.3.46.0 - 2024-12-04

-   Datamob sdk methods: `registerDatamobUser`, `requestDatamobDeviceAdmin`,
    `validateDatamobRequirements`.

## v.3.45.0 - 2024-11-24

-   New `getUnseenNotificationsBadge` / `setUnseenNotificationsBadge` functions

## v.3.44.0 - 2024-10-23

-   New `getInstallationId` function

## v.3.43.1 - 2024-10-15

-   Remove `backgroundAnimation` option from `showLoadingOverlay`

## v.3.43.0 - 2024-10-14

-   New `showLoadingOverlay` / `hideLoadingOverlay` functions
-   Use web api when available in `readTextFromClipboard` and
    `writeTextToClipboard` functions
-   Optimize bundle size

## v.3.41.0 - 2024-10-07

-   New `getBatteryInfo` function
-   New `readTextFromClipboard` and `writeTextToClipboard` functions

## v.3.40.0 - 2024-09-24

-   New `downloadBase64` function

## v.3.39.0

-   New `getTopazValues` function

## v.3.38.0

-   New `focusNavbar` function

## v.3.37.0

-   New `shareBase64` function

## v.3.36.0

-   `nativeConfirm`: added `destructive` mode
-   `nativeMessag`: added `buttonAccessibilityLabel` prop

## v.3.35.0

-   `updateNavigationBar` add `sectionName` to top navbar actions
-   removed tealium methods: `getCustomerHash`/`setCustomerHash`

## v.3.34.0 - 2024-05-06

-   `triggerPinOrBiometricAuthentication` method

## v.3.33.0 - 2024-04-03

-   `getDeviceTac` method

## v.3.32.0 - 2024-03-06

-   `getProfileImage`/`startProfileImageFlow` to read/change the profile image
-   `getPincodeInfo` to get the pincode status

## v.3.31.0 - 2023-12-05

-   `DATA_CONNECTION_INFO`: Add `PERMISSION_REQUIRED` mobileConnectionType

## v.3.30.0 - 2023-11-16

-   New `getNetworkConnectionInfo` function

## v.3.29.0 - 2023-10-26

-   New `openOnboarding` function
-   `nativeMessage`: support for `withDismiss`, `duration: "PERSISTENT"`, and
    `action` in response

## v.3.28.0 - 2023-09-07

-   New `getDeviceModel` function
-   Update `getEsimInfo` to return `eid` if possible
-   Deprecate `requestSimIcc` and `requestSimImsi`
-   New `colorVariant` option in `updateNavigationBar`
-   README cleanup

## v.3.27.0 - 2023-08-22

-   Add `bottomSheetActions`

## v.3.26.1 - 2023-08-17

-   Fix left/right action options in updateNavigationBar

## v.3.26.0 - 2023-07-31

-   New method `onNavigationBarIconClicked` to execute a callback when a
    NavigationBar icon is clicked

## v.3.25.0 - 2023-07-31

-   Update `updateNavigationBar` with new properties

## v.3.24.0 - 2023-07-20

-   Add `getAttStatus` method

## v.3.23.0 - 2023-04-14

-   improve TrackingEvent types

## v.3.22.0 - 2023-04-11

-   allow ß char in analytics events

## v.3.21.0 - 2023-03-15

-   sanitize tracking params in setScreenName in Android/iOS too

## v.3.20.1 - 2023-02-13

-   added missing `getRemoteConfig` export

## v.3.20.0 - 2023-02-13

-   New `getRemoteConfig` function exposing firebase remote config

## v.3.18.1 - 2022-12-20

-   Fix `setScreenName` in Android when not passing params.

## v.3.18.0 - 2022-11-03

-   New `fetchPhoneNumbers` and `updatePhoneNumbers` methods.

## v.3.17.0 - 2022-10-26

-   New `bottomSheetActionSelector` and `bottomSheetInfo` methods

## v.3.16.0 - 2022-09-27

-   Allow params in setScreenName
-   Throw 423 error (locked) when trying to open a bottom sheet when a previous
    one is already being opened. This will prevent accidentally opening multiple
    sheets when the user does repeated taps

## v.3.15.0 - 2022-09-21

-   Allow icons in `bottomSheet` rows

## v.3.14.0 - 2022-09-15

-   New `bottomSheet` and `bottomSheetSingleSelector` functions

## v.3.13.1 - 2022-08-09

-   Analytics: allow `:` in event params

## v.3.13.0 - 2022-08-09

-   Analytics: fixes in sanitization and allow / and | chars
-   Analytics: truncate long event param values that exceed Firebase limits
-   Analytics: expose `sanitizeAnalyticsParam` and `sanitizeAnalyticsParams`
    methods

## v.3.12.3 - 2022-08-05

-   fix setScreenName in web (gtag) to log screen name as page_title

## v.3.12.2 - 2022-07-12

-   make analytics function resilient to gtag script being blocked by adblocker

## v.3.12.1 - 2022-07-08

-   fix Analytics to allow `_` chars

## v.3.12.0 - 2022-07-08

-   new `showAppRating()` function

## v.3.11.1 - 2022-07-01

-   Send page_view instead of screen_view in web

## v.3.11.0 - 2022-06-29

-   Message ids are now unique across different webviews

## v.3.10.1 - 2022-06-22

-   fixed: added missing logout export

## v.3.10.0 - 2022-06-22

-   Logout: added new method to end session in native app

## v.3.9.0 - 2022-06-16

-   Analytics: added support for GA4 with gtag script in web. Removed old web UA
    support with google analytics.js script

## v.3.8.0 - 2022-06-08

-   Analytics: automatically sanitize GA4 event attribute values.

## v.3.7.0 - 2022-06-01

-   New method: `getTopazToken`.
-   Add timeout option to `renewSession`.
-   `setLogger` method to log bridge traffic for debugging.

## v.3.6.0 - 2022-05-23

-   `BRIDGE_READY` message

## v.3.5.0 - 2022-05-17

-   Analytics: support GA4/Firebase event format

## v.3.4.0 - 2022-03-21

-   HIGHLIGHT_TAB message
-   fix how we detect the lib is running inside an iframe.

## v.3.3.1 - 2022-03-09

-   Add missing export.

## v.3.3.0 - 2022-03-09

-   Add `logEcommerceEvent` method.

## v.3.1.0 - 2021-09-06

-   Add `setActionBehavior` method to allow defining the behavior of close and
    back buttons in webviews
-   Upgrade dev dependencies to fix automatically reported vulnerabilities

## v.3.0.0 - 2021-07-22

-   **Breaking change**: `webview-bridge` will be disabled inside iframes by
    default. It can be enabled by setting a `data-enable-webview-bridge`
    property to the `iframe` element.

## v.2.20.2 - 2021-05-25

-   Expose `setTrackingProperty`.

## v.2.20.1 - 2021-05-19

-   `setTrackingProperty`: fix typo in medallia.

## v.2.20.0 - 2021-05-13

-   Add `setTrackingProperty` method.

## v.2.19.0 - 2021-03-19

-   Add `getEsimInfo` method.

## v.2.18.1 - 2020-08-27

-   Fix `TrackingEvent` type to be `readonly`, so analytics functions can accept
    immutable events too.

## v.2.18.0 - 2020-07-07

-   New method `getCustomerHash`. Fetches the current customer subscription hash
    from the native app (for tracking purposes). For this method to return a
    valid hash, the `setCustomerHash` method has to have been called before
    (typically done from account dashboard page)

## v.2.17.1 - 2020-06-26

-   SSR friendly. Not using `window` or `document` when not available

## v.2.17.0 - 2020-06-18

-   New function: `getDiskSpaceInfo`

## v.2.16.0 - 2020-06-12

-   New method `setCustomerHash`. Sets the hash of the current subscription for
    the customer, which is used for tracking purposes.

## v.2.14.6 - 2020-05-25

-   Analytics: log timing value as integer. Google Analytics expects an integer,
    not float

## v.2.14.5 - 2020-04-28

-   Fix missing export type CustomDimensionIdx in flow type definitions

## v.2.14.4 - 2020-04-28

-   Add new analytics dimensions
-   Update all the dependencies
-   Use Github Actions instead of Travis

## v.2.14.3 - 2019-03-31

-   Remove accent marks from analytics event labels.

## v.2.14.2 - 2019-03-18

-   Removed non-explicit flow types

## v.2.13.0 - 2020-03-10

-   Add `expandedTitle` to `updateNavigationBar()`.

## v.2.11.0 - 2020-03-02

-   New function: `getAppMetadata`

## v.2.10.2 - 2020-02-27

-   More flow types fixes for renewSession

## v.2.10.1 - 2020-02-19

-   Fix flow types for renewSession

## v.2.10.0 - 2020-02-19

-   Improve changes in 2.9.0. RENEW_SESSION request message now includes the old
    `accessToken`

## v.2.9.0 - 2020-02-17

-   Messages to renew webview session.

## v.2.8.0 - 2020-02-04

-   Add new flag `showProfileButton` to `updateNavigationBar()`.

## v.2.7.1 - 2020-01-29

-   Update nativeConfirm and nativeAlert arguments type.

## v.2.7.0 - 2019-12-16

-   New function: `fetchContactsByPhone`

## v.2.6.0 - 2019-12-02

-   New function: `requestVibration`

## v.2.5.0 - 2019-11-14

-   New function: `dismiss`

## v.2.4.0 - 2019-11-04

-   New function: `checkPermissionStatus`
-   New function: `internalNavigation`

## v.2.3.4 - 2019-10-07

-   Add 500ms timeout to remote config

## v.2.3.3 - 2019-10-02

-   Update setWebViewTitle implementation

## v.2.3.2 - 2019-10-02

-   Update documentation

## v.2.3.0 - 2019-09-11

-   Internal features. See `APPS-5331`

## v.2.2.0 - 2019-09-04

-   New function: `onNativeEvent`

## v.2.1.0 - 2019-07-31

-   New function: `reportStatus`

## v.2.0.1 - 2019-06-27

-   Update TrackingEvent type for flow

## v.2.0.0 - 2019-05-29

-   Only send GA events to selected Trackers

## v.1.6.1 - 2019-05-20

-   Fix `isABTestingAvailable` flow type.

## v.1.6.0 - 2019-05-11

-   Exported functions to A/B testing
    -   `isABTestingAvailable`

## v.1.5.0 - 2019-04-05

-   Add new Google Analytics custom dimensions
    -   `webviewBrowserVersion`

## v.1.4.0 - 2019-03-15

-   Add share function

## v.1.3.1 - 2019-03-05

-   Remove visibility from navigation bar options

## v.1.3.0 - 2019-02-27

-   Add new Google Analytics custom dimensions

## v.1.2.0 - 2019-02-19

-   Add new Google Analytics custom dimensions

## v.1.1.1 - 2019-02-19

-   Default values set for `label` and `value` fields when logging analytics
    events

## v1.1.0 - 2019-02-12

-   Exported functions from analytics module:

    -   `logTiming`
    -   `setUserProperty`

-   Exported constants from analytics module:
    -   `CD_WEBAPP_INSTALLED`
    -   `CD_NOVUM_UID`
    -   `CD_EVENT_VALUE`
-   Added flow definitions file

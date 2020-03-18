# CHANGELOG

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

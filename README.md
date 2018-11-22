# webview-bridge

JavaScript library to access to native functionality. Requires a webview with a
postMessage bridge.

Library size ~1.2 Kb (min + gzip)

AMD, UMD, ES builds available (see
[package dist folder](https://unpkg.com/@novum/webview-bridge/dist)). Open an
issue if you need a different build.

## Usage

### npm

We recommend to manage your dependencies using `npm` or `yarn` and use module
bundler like [webpack](https://webpack.js.org/) or
[parcel](https://parceljs.org/). Once configured, you can use ES imports.

Install using `npm`:

```
npm i @novum/webview-bridge
```

Install using `yarn`:

```
yarn add @novum/webview-bridge
```

Import required function and use it:

```javascript
import {setWebviewTitle} from '@novum/webview-bridge';

setWebviewTitle('Hello, world');
```

### cdn

Alternatively, you can import the library directly from a CDN:

```html
<script src="https://unpkg.com/@novum/webview-bridge/dist/webview-bridge-umd.js"></script>

<script>
    webviewBridge.setWebViewTitle('Hello, world');
</script>
```

## API

### requestContact

Show native picker UI in order to let the user select a contact.

Picker UI elements can be filtered by available phones (default) or emails

```typescript
requestContact: ({filter}?: {filter?: 'phone' | 'email'}) => Promise<{
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
import {requestContact} from '@novum/webview-bridge';

requestContact({filter: 'phone'}).then((contact) => {
    console.log(contact);
}).catch(err => {
    console.error(err);
};
```

### createCalendarEvent

Inserts an event in calendar

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
import {createCalendarEvent} from '@novum/webview-bridge';

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

### setWebViewTitle

Update webview title

```typescript
export declare const setWebViewTitle: (title: string) => Promise<void>;
```

#### Example

```javascript
import {setWebViewTitle} from '@novum/webview-bridge';
```

### Error handling

If an error occurs, promise will be rejected with an error object:

```typescript
{code: number, description: string}
```

## License

MIT

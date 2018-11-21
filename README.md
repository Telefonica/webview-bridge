# webview-bridge

JavaScript library to access to native functionality. Assumes webview with a
postMessage bridge.

## Install

Using `npm`:

```
npm i @novum/webview-bridge
```

Using `yarn`:

```
yarn add @novum/webview-bridge
```

AMD builds available (see package dist folder)

## API

### requestContact

```typescript
requestContact: () => Promise<{
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

### createCalendarEvent

```typescript
createCalendarEvent: ({beginTime: number, endTime: number, title: string}) => Promise<void>;
```

`beginTime` and `endTime` are timestamps with millisecond precision

## Examples

### Get contact data

```javascript
import {requestContactData} from '@novum/webview-bridge';

requestContact().then((contact) => {
    console.log(contact);
}).catch(err => {
    console.error('something went wrong:', err);
};
```

### Create a calendar event

```javascript
import {createCalendarEvent} from '@novum/webview-bridge';

createCalendarEvent({
    beginTime: new Date(2019, 10, 06).getTime(),
    endTime: new Date(2019, 10, 07).getTime(),
    title: "Peter's birthday",
}).then(() => {
    console.log('event created');
}).catch(err => {
    console.error('something went wrong:', err);
};
```

## License

MIT

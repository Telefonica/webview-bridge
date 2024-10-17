---
name: New bridge method
about: Suggest a new bridge method
title: ''
labels: ''
assignees: ''
---

**Message type**: `MESSAGE_TYPE`

**Originator**: (specifies who initiates the request: Web or Native)

## Description

Provide a description of the method and the behaviour of the apps

## Differences between iOS/Android (if any)

To be filled only if apply

## Payload definition

**Request Payload**  
Specify possible values for each field (enums, nullables, empty strings ...).
Also specify if the payload is not required. Provide examples

```ts
param1: 'value_1' | 'value_2';
param2: string | null;
```

Examples:

```json
{"type": "MESSAGE_TYPE", "id": "web-2", "payload": {"param1": "value_1"}}
```

**Response Payload**  
Specify possible values for each field (enums, nullables, empty strings ...).
Also specify if the payload is not required. Provide examples

```ts
responseField: string;
```

Examples:

```json
{"type": "MESSAGE_TYPE", "id": "web-2", "payload": {"responseField": "value_1"}}
```

## Possible error cases

Include codes and description messages. Also explain when they can occur if
necessary.

401 → Missing permissions

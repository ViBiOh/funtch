# funtch - Functional Fetch

[![CI Status](https://github.com/vibioh/funtch/workflows/Build/badge.svg)](https://github.com/ViBiOh/funtch/actions?query=workflow%3A%22Build%22)
[![Doc Status](https://doc.esdoc.org/github.com/ViBiOh/funtch/badge.svg)](https://doc.esdoc.org/github.com/ViBiOh/funtch)
[![codecov](https://codecov.io/gh/ViBiOh/funtch/branch/main/graph/badge.svg)](https://codecov.io/gh/ViBiOh/funtch)
[![npm version](https://badge.fury.io/js/funtch.svg)](https://badge.fury.io/js/funtch)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ViBiOh_funtch&metric=alert_status)](https://sonarcloud.io/dashboard?id=ViBiOh_funtch)

[Fetch](https://fetch.spec.whatwg.org) based on [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) with functional and customizable behavior.

## Getting started

Add dependency to your project

```
npm i -S funtch
```

## Usage

Full documentation is [available here](https://doc.esdoc.org/github.com/ViBiOh/funtch).

Full usage example in [example folder](./example/)

### ES6

```js
import funtch from 'funtch';

funtch.get('https://api.github.com').then((data) => doSomething(data));
```

### CommonJS

```js
const funtch = require('funtch').default;

funtch.get('https://api.github.com').then((data) => doSomething(data));
```

## API

You can send HTTP requests from common verbs by invoking the following methods from `funtch`:

| Methode name | Params                                   | Description                                                           |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------- |
| `get`        | `url: String` <br /> `query: Object/Map` | Perform a GET with optional query params                              |
| `post`       | `url: String` <br /> `body: Any`         | Perform a POST with given body and `Content-type` guessed from param  |
| `put`        | `url: String` <br /> `body: Any`         | Perform a PUT with given body and `Content-type` guessed from param   |
| `patch`      | `url: String` <br /> `body: Any`         | Perform a PATCH with given body and `Content-type` guessed from param |
| `delete`     | `url: String`                            | Perform a DELETE                                                      |

If default pattern doesn't match your needs, you can build a step by step request by invoking `funtch.url(url: String)` and applying following methods:

| Method name        | Params                                           | Description                                                                                          |
| ------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `query`            | `query: Object/Map`                              | Append query params when requesting                                                                  |
| `header`           | `key: String` <br /> `value: String`             | Add HTTP header                                                                                      |
| `auth`             | `value: String`                                  | Add Authorization Header with given value                                                            |
| `contentJson`      |                                                  | Add `Content-type: application/json` header                                                          |
| `contentText`      |                                                  | Add `Content-type: text/plain` header                                                                |
| `guessContentType` | `body: Any`                                      | Guess content type by checking if body is a JSON. If true, content is set to JSON, otherwise to text |
| `acceptJson`       |                                                  | Add `Accept: application/json` header                                                                |
| `acceptText`       |                                                  | Add `Accept: text/plain` header                                                                      |
| `contentHandler`   | `callback: func(response)`                       | See [content handler](#custom-content-handler)                                                       |
| `errorHandler`     | `callback: func(response, contentHandler)`       | See [error handler](#error-handling)                                                                 |
| `abortHandler`     | `callback: func(error)`                          | Callback method when request is aborted                                                              |
| `fullResponse`     |                                                  | Return complete response with `{status, headers, data}`, instead of just raw data by default         |
| `body`             | `body: Any` <br /> `guess: Boolean default true` | Set body content of request, and guessing content on the fly                                         |
| `get`              |                                                  | Set method to `GET` and send request                                                                 |
| `post`             | `body: Any`                                      | Set method to `POST`, add body if provided with content guess and send request                       |
| `put`              | `body: Any`                                      | Set method to `PUT`, add body if provided with content guess and send request                        |
| `patch`            | `body: Any`                                      | Set method to `PATCH`, add body if provided with content guess and send request                      |
| `delete`           |                                                  | Set method to `DELETE` and send request                                                              |
| `method`           | `method: String`                                 | Set HTTP method to given value                                                                       |
| `send`             |                                                  | Send request as it                                                                                   |
| `abort`            |                                                  | Abort request                                                                                        |

All these methods, except `abort`, are chainable and once `send` is called, the result is a Promise.

```js
const fetchPromise = funtch
  .url('https://api.github.com')
  .auth('Basic SECRET')
  .contentJson()
  .acceptJson()
  .post({ star: true });

fetchPromise
  .then((data) => console.log(data))
  .catch((err) => console.error(data));
```

Cancelable request can be done this way.

```js
const fetchRequest = funtch
  .url('https://api.vibioh.fr/delay/10') // 10 seconds delay
  .abortHandler((e) => console.warn(`Request was aborted: ${e.name}`));

fetchRequest.get();
fetchRequest.abort();
```

You can create a pre-configured builder, in order to avoid repeating yourself, by passing an object to the `withDefault` method with keys as the config function name.

```js
const funtcher = funtch.withDefault({
  baseURL: 'https://api.github.com',
  auth: 'github SecretToken',
  fullResponse: true,
  contentJson: true,
});

funtcher.get('/user/keys').then((response) => doSomething(response.data));
funtcher
  .post('/user/keys', 'my-ssh-key')
  .then((response) => doSomething(response.data));
```

## Error Handling

By default, **funtch** will rejects promise with a full response describing error if HTTP status is greater or equal than 400. This object contains HTTP status, response headers and data (in plain text or JSON, according to [content handler](#custom-content-handler)).

```js
{
  status: 404,
  headers: {
    'content-length': '19',
    'content-type': 'text/plain; charset=utf-8',
    date: 'Sat, 06 May 2017 11:58:38 GMT',
    'x-content-type-options': 'nosniff',
    connection: 'close'
  },
  data: '404 page not found',
}
```

## Customization

### Custom content handler

By default, **fetch** exposes only two methods for reading content : `text()` and `json()`. Instead of juggling with these methods, **funtch** return content by examining Content-Type header and call one of the two methods.

You can easily override default content handler by calling `content()` on the build. The content handler method [accepts a reponse and return a Promise](https://doc.esdoc.org/github.com/ViBiOh/funtch/function/index.html#static-function-readContent). Method is also passed to error handler method, in order to read content while identifying error.

Below an example that parse XML response.

```js
import funtch { MEDIA_TYPE_JSON, CONTENT_TYPE_HEADER } from 'funtch';

const contentTypeJsonRegex = new RegExp(MEDIA_TYPE_JSON, 'i');
const contentTypeXmlRegex = /application\/xml/i;

function xmlContent(response) {
  if (contentTypeJsonRegex.test(response.headers.get(CONTENT_TYPE_HEADER))) {
    return response.json();
  }

  return new Promise(resolve => {
    response.text().then(data => {
      if (contentTypeXmlRegex.test(response.headers.get(CONTENT_TYPE_HEADER))) {
        resolve(new DOMParser().parseFromString(data, 'text/xml'));
      }
      resolve(data);
    });
  });
}

funtch
  .url('https://api.github.com')
  .content(xmlContent)
  .get();
```

### Custom error handler

By default, **fetch** returns a valid Promise without considering http status. **Funtch** error handler is called first, in this way, you can identify an error response and `reject` the Promise. By default, if HTTP status is greather or equal than 400, it's considered as error.

You can easyly override default error handler by calling `errorHandler()` on the builder. The error handler method [accepts a response and a content handler, and return a Promise](https://doc.esdoc.org/github.com/ViBiOh/funtch/function/index.html#static-function-errorHandler). You can reimplement it completely or adding behavior of the default one.

Below an example that add a `toString()` behavior.

```js
import funtch, { errorHandler } from 'funtch';

function errorWithToString(response) {
  return new Promise((resolve, reject) =>
    errorHandler(response)
      .then(resolve)
      .catch((err) =>
        reject({
          ...err,
          toString: () => {
            if (typeof err.content === 'string') {
              return err.content;
            }
            return JSON.stringify(err.content);
          },
        }),
      ),
  );
}

funtch
  .url('https://api.github.com')
  .errorHandler(errorWithToString)
  .get()
  .catch((err) => console.log(String(err)));
```

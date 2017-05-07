# funtch - Functional Fetch

[![Build Status](https://travis-ci.org/ViBiOh/funtch.svg?branch=master)](https://travis-ci.org/ViBiOh/funtch)
[![Doc Status](https://doc.esdoc.org/github.com/ViBiOh/funtch/badge.svg)](https://doc.esdoc.org/github.com/ViBiOh/funtch)
[![codecov](https://codecov.io/gh/ViBiOh/funtch/branch/master/graph/badge.svg)](https://codecov.io/gh/ViBiOh/funtch)
[![npm version](https://badge.fury.io/js/funtch.svg)](https://badge.fury.io/js/funtch)

[Fetch](https://fetch.spec.whatwg.org) based on [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) with functional and customizable behavior.

## Getting started

Add dependency to your project

```
npm i -S funtch
```

## Usage

Full documentation is [available here](https://doc.esdoc.org/github.com/ViBiOh/funtch).

Full usage example in [example folder](./example/common.test.js)

### ES6

```js
import funtch from 'funtch';

funtch.get('https://api.github.com').then(data => doSomething(data))
```

### CommonJS

```js
const funtch = require('funtch');

funtch.get('https://api.github.com').then(data => doSomething(data))
```

## Error Handling

By default, **funtch** will reject promise with an object describing error if HTTP status is greater or equal than 400. This object contains HTTP status, response headers and content (in plain text or JSON).

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
  content: '404 page not found',
}
```

## Custom error handler

By default, **fetch** return a valid Promise without considering http status. **Funtch** error handler is called first, in this way, you can identify an error response and `reject` the Promise. By default, if HTTP status is greather or equal than 400, it's considered as error.

You can easyly override default error handler by calling `error()` on the builder. The error handler method [accept a response and return a Promise](https://doc.esdoc.org/github.com/ViBiOh/funtch/function/index.html#static-function-errorHandler). You can reimplement it completely or adding behavior of the default one.

Below an example that add a `toString()` behavior.

```js
import funtch, { errorHandler } from 'funtch';

function errorWithToString(response) {
  return new Promise((resolve, reject) =>
    errorHandler(response).then(resolve).catch(err =>
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
  .error(errorWithToString)
  .get()
  .catch(err => console.log(String(err)));
```

# funtch - Functional Fetch

[![Build Status](https://travis-ci.org/ViBiOh/funtch.svg?branch=master)](https://travis-ci.org/ViBiOh/funtch)
[![Doc Status](https://doc.esdoc.org/github.com/ViBiOh/funtch/badge.svg)](https://doc.esdoc.org/github.com/ViBiOh/funtch)
[![codecov](https://codecov.io/gh/ViBiOh/funtch/branch/master/graph/badge.svg)](https://codecov.io/gh/ViBiOh/funtch)

[Fetch](https://fetch.spec.whatwg.org) based on [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch) with functional and customizable behavior.

## Getting started

Add dependency to your project

```
npm i -S funtch
```

## Usage

### ES6

```
import funtch from 'funtch';

funtch.get('https://api.github.com').then(data => doSomething(data))
```

### CommonJS

```
const funtch = require('funtch');

funtch.get('https://api.github.com').then(data => doSomething(data))
```

## Error Handling

By default, *funtch* will reject promise with an object describing error if HTTP status is greater or equal than 400. This object contains HTTP status, response headers and content (in plain text or JSON).

```
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
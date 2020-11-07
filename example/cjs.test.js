#!/usr/bin/env node

const { JSDOM } = require('jsdom');

const {
  default: funtch,
  readContent,
  errorHandler,
  MEDIA_TYPE_JSON,
  CONTENT_TYPE_HEADER,
} = require('../index');

/**
 * Simple GET
 */
funtch
  .get('https://api.github.com')
  .then((data) => global.console.log('Simple GET', data, '\n'));

/**
 * GET with custom content reader (e.g. prefixing, wrapping, deserialization)
 */
funtch
  .url('https://api.github.com')
  .content((response) => {
    const wrap = (resolve, data) =>
      resolve({
        status: response.status,
        payload: data,
      });

    return new Promise((resolve) =>
      readContent(response).then((data) => wrap(resolve, data)),
    );
  })
  .get()
  .then((data) =>
    global.console.log('GET with custom content reader', data, '\n'),
  );

/**
 * GET with custom content reader (e.g. prefixing, wrapping, deserialization)
 */
const contentTypeJsonRegex = new RegExp(MEDIA_TYPE_JSON, 'i');
const contentTypeXmlRegex = /application\/xml/i;

funtch
  .url('https://vibioh.fr/sitemap.xml')
  .content((response) => {
    if (contentTypeJsonRegex.test(response.headers.get(CONTENT_TYPE_HEADER))) {
      return response.json();
    }

    return new Promise((resolve) => {
      response.text().then((data) => {
        if (
          contentTypeXmlRegex.test(response.headers.get(CONTENT_TYPE_HEADER))
        ) {
          resolve(new JSDOM(data));
        }
        resolve(data);
      });
    });
  })
  .get()
  .then((data) =>
    global.console.log('GET with XML content reader', data, '\n'),
  );

/**
 * GET with error
 */
funtch
  .get('https://api.github.com/notFound')
  .catch((err) => global.console.error('GET with error', err, '\n'));

/**
 * GET with custom error handler (e.g. perform a redirect)
 */
funtch
  .url('https://api.github.com/repositories/ViBiOh/infra')
  .error((response) => {
    if (response.status === 401) {
      global.console.log('Login required, redirection to /login');
    }

    return errorHandler(response); // using default behavior for continuing process
  })
  .get()
  .catch((err) =>
    global.console.error('GET with custom error handler', err, '\n'),
  );

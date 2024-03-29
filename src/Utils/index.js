import { CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON } from '../Constants';

/**
 * RegExp for checking if content type reference JSON.
 * @type {RegExp}
 */
const CONTENT_TYPE_JSON = new RegExp(MEDIA_TYPE_JSON, 'i');

/**
 * Read all headers from response
 * @param  {Object} response Fetch response
 * @return {Object} All headers in a key/value Map
 */
export function readHeaders(response) {
  if (response.headers.raw) {
    const headers = response.headers.raw();

    return Object.keys(headers).reduce((previous, current) => {
      // eslint-disable-next-line no-param-reassign
      previous[current] = Array.isArray(headers[current])
        ? headers[current].join(', ')
        : headers[current];
      return previous;
    }, {});
  }

  const entries = Array.from(response.headers.entries());
  return entries.reduce((previous, current) => {
    // eslint-disable-next-line no-param-reassign, prefer-destructuring
    previous[current[0]] = current[1];
    return previous;
  }, {});
}

/**
 * Encode given params into query string.
 * @param {Object} params URL Query params as object
 * @return {String} Query string encoded
 */
export function encode(params) {
  return Object.entries(params)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Format a full content response, with status and headers
 * @param  {Object} The response
 * @param  {Object} The data returned
 * @return {Object}
 */
export function fullContent(response, data) {
  return {
    status: response.status,
    headers: readHeaders(response),
    data,
  };
}

/**
 * Read content from response according to ContentType Header (text or JSON)
 * @param  {Object} response Fetch response
 * @return {Promise<Object>} Promise with content in corresponding shape
 */
export function contentHandler(response) {
  if (CONTENT_TYPE_JSON.test(response.headers.get(CONTENT_TYPE_HEADER))) {
    return response.json();
  }
  return response.text();
}

/**
 * Read content witht status and header from response according to ContentType Header (text or JSON)
 * @param  {Object} response Fetch response
 * @return {Promise<Object>} Promise with full content in corresponding shape
 */
export function getReadContentFull(content = contentHandler) {
  return (response) => content(response).then((data) => fullContent(response, data));
}

/**
 * Identify and handle error from response
 * @param  {Object} response   Fetch response
 * @param  {Function} content Content reader of response
 * @return {Promise<Object>} Promise with error description if HTTP status greater or equal 400,
 * resonse otherwise
 */
export function errorHandler(response, content = contentHandler) {
  if (response.status < 400) {
    return Promise.resolve(response);
  }

  return content(response).then((data) => {
    throw fullContent(response, data);
  });
}

/**
 * Safe JSON.stringify
 * @param  {Object}   obj      Object to serialize
 * @param  {Function} replacer Replacer function
 * @param  {String}   space    Space separator
 * @return {String}            JSON value
 */
export function stringify(obj, replacer, space) {
  const objectCache = [];
  const whiteList = Array.isArray(replacer) ? replacer : false;

  return JSON.stringify(
    obj,
    (key, value) => {
      if (key !== '' && whiteList && whiteList.indexOf(key) === -1) {
        return undefined;
      }
      if (typeof value === 'object' && value !== null) {
        if (objectCache.indexOf(value) !== -1) {
          return '[Circular]';
        }
        objectCache.push(value);
      }
      return value;
    },
    space,
  );
}

/**
 * Check if content is JSON by trying to parse it
 * @param  {String}  body Content to test
 * @return {Boolean}      True if JSON, false otherwise
 */
export function isJson(body) {
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
}

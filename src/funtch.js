import 'isomorphic-fetch';

/**
 * Accept header name.
 * @type {String}
 */
export const ACCEPT_TYPE_HEADER = 'Accept';

/**
 * Authorization header name.
 * @type {String}
 */
export const AUTHORIZATION_HEADER = 'Authorization';

/**
 * ContentType header name.
 * @type {String}
 */
export const CONTENT_TYPE_HEADER = 'Content-Type';

/**
 * JSON Media Type
 * @type {String}
 */
export const MEDIA_TYPE_JSON = 'application/json';

/**
 * Plain text Media Type
 * @type {String}
 */
export const MEDIA_TYPE_TEXT = 'text/plain';

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
    const entries = response.headers.raw();
    return Object.keys(entries).reduce((previous, current) => {
      // eslint-disable-next-line no-param-reassign
      previous[current] = Array.isArray(entries[current])
        ? entries[current].join(', ')
        : entries[current];
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
 * Read content from response according to ContentType Header (text or JSON)
 * @param  {Object} response Fetch response
 * @return {Promise<Object>} Promise with content in corresponding shape
 */
export function readContent(response) {
  if (CONTENT_TYPE_JSON.test(response.headers.get(CONTENT_TYPE_HEADER))) {
    return response.json();
  }
  return response.text();
}

/**
 * Identify and handle error from response
 * @param  {Object} response   Fetch response
 * @param  {Function} content Content reader of response
 * @return {Promise<Object>} Promise with error description if HTTP status greater or equal 400,
 * resonse otherwise
 */
export function errorHandler(response, content = readContent) {
  if (response.status < 400) {
    return Promise.resolve(response);
  }

  return new Promise((resolve, reject) =>
    content(response).then((data) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        status: response.status,
        headers: readHeaders(response),
        content: data,
      });
    }));
}

/**
 * Perform fetch operation from given params.
 * @param  {String}   url     URL to fetch
 * @param  {Object}   params  URL Query params in a key/value form
 * @param  {Function} error   Error handling method, first called method with raw response.
 * @param  {Function} content Content handling method, called with output of error handling
 * @return {Promise}          Promise of fetching to bind to.
 */
function doFetch(url, params = {}, error = errorHandler, content = readContent) {
  return fetch(url, params)
    .then(response => error(response, content))
    .then(content);
}

/**
 * Check if content is JSON by trying to parse it
 * @param  {String}  body Content to test
 * @return {Boolean}      True if JSON, false otherwise
 */
function isJson(body) {
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Builder of fetch call with a functionnal design.
 */
class FuntchBuilder {
  constructor() {
    this.params = {
      headers: {},
    };
  }

  /**
   * Define url of request
   * @param  {String} url URL of request
   * @return {Object} instance
   */
  url(url) {
    this.url = url;

    return this;
  }

  /**
   * Add header to request
   * @param  {String} key   Header's name
   * @param  {String} value Header's value
   * @return {Object} instance
   */
  header(key, value) {
    this.params.headers[key] = value;

    return this;
  }

  /**
   * Add Authorization header
   * @param  {String} value Authorization's value
   * @return {Object} instance
   */
  auth(value) {
    return this.header(AUTHORIZATION_HEADER, value);
  }

  /**
   * Define ContentType Header to JSON
   * @return {Object} instance
   */
  contentJson() {
    return this.header(CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON);
  }

  /**
   * Define ContentType Header to text/plain
   * @return {Object} instance
   */
  contentText() {
    return this.header(CONTENT_TYPE_HEADER, MEDIA_TYPE_TEXT);
  }

  /**
   * Guess and define ContentType Header for given body
   * @param  {Object} body Body to analyze
   * @return {Object} instance
   */
  guessContentType(body) {
    if (isJson(body)) {
      return this.contentJson();
    }
    return this.contentText();
  }

  /**
   * Define Accept Header to JSON
   * @return {Object} instance
   */
  acceptJson() {
    return this.header(ACCEPT_TYPE_HEADER, MEDIA_TYPE_JSON);
  }

  /**
   * Define Accept Header to text/plain
   * @return {Object} instance
   */
  acceptText() {
    return this.header(ACCEPT_TYPE_HEADER, MEDIA_TYPE_TEXT);
  }

  /**
   * Set content reader for request
   * @param  {Function} handler Function that will receive response Promise
   * and should return a Promise with content
   * @return {Object} instance
   */
  content(handler) {
    this.readContent = handler;

    return this;
  }

  /**
   * Set error handler for request
   * @param  {Function} handler Function that will receive response Promise and readContent method
   * and should check and handle if response in an error or not. Should return Promise.
   * @return {Object} instance
   */
  error(handler) {
    this.errorHandler = handler;

    return this;
  }

  /**
   * Set body of request
   * @param  {Object}  body  Request's body, should not be `undefined`
   * @param  {Boolean} guess Indicate if ContentType Header is added or not
   * @return {Object} instance
   */
  body(body, guess = true) {
    if (typeof body !== 'undefined') {
      this.params.body = body;

      if (guess && !this.params.headers[CONTENT_TYPE_HEADER]) {
        return this.guessContentType(body);
      }
    }

    return this;
  }

  /**
   * Perform GET request with fetch
   * @return {Promise} Reponse's promise
   */
  get() {
    this.params.method = 'GET';
    return this.send();
  }

  /**
   * Perform POST request with fetch
   * @return {Promise} Reponse's promise
   */
  post(body) {
    this.body(body);

    this.params.method = 'POST';
    return this.send();
  }

  /**
   * Perform PUT request with fetch
   * @return {Promise} Reponse's promise
   */
  put(body) {
    this.body(body);

    this.params.method = 'PUT';
    return this.send();
  }

  /**
   * Perform PATCH request with fetch
   * @return {Promise} Reponse's promise
   */
  patch(body) {
    this.body(body);

    this.params.method = 'PATCH';
    return this.send();
  }

  /**
   * Perform DELETE request with fetch
   * @return {Promise} Reponse's promise
   */
  delete() {
    this.params.method = 'DELETE';
    return this.send();
  }

  /**
   * Perform fetch call with instance params.
   * @return {Promise} Reponse's promise
   */
  send() {
    return doFetch(this.url, this.params, this.errorHandler, this.readContent);
  }
}

/**
 * funtch functional interface
 */
export default class funtch {
  /**
   * Create builder with given URL.
   * @param  {String} url Requested URL
   * @return {FuntchBuilder} Builder for configuring behavior
   */
  static url(url) {
    return new FuntchBuilder().url(url);
  }

  /**
   * Perform a GET request with fetch for given URL
   * @param  {String} url Requested URL
   * @return {Promise} Fetch result
   */
  static get(url) {
    return new FuntchBuilder().url(url).get();
  }

  /**
   * Perform a POST request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static post(url, body) {
    return new FuntchBuilder().url(url).post(body);
  }

  /**
   * Perform a PUT request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static put(url, body) {
    return new FuntchBuilder().url(url).put(body);
  }

  /**
   * Perform a PATCH request with fetch for given URL and body.
   * Adding ContentType header if not defined according to body type (text or json)
   * @param  {String} url Requested URL
   * @param  {Object} body Body sent with request
   * @return {Promise} Fetch result
   */
  static patch(url, body) {
    return new FuntchBuilder().url(url).patch(body);
  }

  /**
   * Perform a DELETE request with fetch for given URL
   * @param  {String} url Requested URL
   * @return {Promise} Fetch result
   */
  static delete(url) {
    return new FuntchBuilder().url(url).delete();
  }
}

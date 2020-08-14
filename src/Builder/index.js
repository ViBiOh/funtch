import 'isomorphic-fetch';
import {
  ACCEPT_TYPE_HEADER,
  AUTHORIZATION_HEADER,
  CONTENT_TYPE_HEADER,
  MEDIA_TYPE_JSON,
  MEDIA_TYPE_TEXT,
} from '../Constants';
import { readContent, errorHandler, stringify, isJson } from '../Utils/index';

/**
 * Perform fetch operation from given params.
 * @param  {String}   url     URL to fetch
 * @param  {Object}   params  URL Query params in a key/value form
 * @param  {Function} error   Error handling method, first called method with raw response.
 * @param  {Function} content Content handling method, called with output of error handling
 * @return {Promise}          Promise of fetching to bind to.
 */
function doFetch(url, params, error = errorHandler, content = readContent) {
  return fetch(url, params)
    .then((response) => error(response, content))
    .then(content);
}

/**
 * Builder of fetch call with a functionnal design.
 */
export default class Builder {
  constructor(options) {
    this.params = {
      headers: {},
    };

    if (!options) {
      return;
    }

    this.baseURL = options.baseURL;

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => this.header(key, value));
    }

    if (options.auth) {
      this.auth(options.auth);
    }

    if (options.contentJson) {
      this.contentJson();
    }

    if (options.contentText) {
      this.contentText();
    }

    if (options.acceptJson) {
      this.acceptJson();
    }

    if (options.acceptText) {
      this.acceptText();
    }

    if (options.method) {
      this.method(options.method);
    }

    if (typeof options.contentHandler === 'function') {
      this.content(options.contentHandler);
    }

    if (typeof options.errorHandler === 'function') {
      this.error(options.errorHandler);
    }
  }

  /**
   * Define url of request
   * @param  {String} url URL of request
   * @return {Object} instance
   */
  url(url) {
    if (this.baseURL) {
      this.url = `${this.baseURL}${url}`;
    } else {
      this.url = url;
    }

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
      let payload = body;

      if (typeof body === 'object') {
        payload = stringify(body);
      } else if (typeof body !== 'string') {
        payload = String(body);
      }

      this.params.body = payload;

      if (guess && !this.params.headers[CONTENT_TYPE_HEADER]) {
        return this.guessContentType(payload);
      }
    }

    return this;
  }

  /**
   * Set HTTP Method verb.
   * @param  {String} method HTTP Method
   * @return {Object} instance
   */
  method(method) {
    this.params.method = method;
    return this;
  }

  /**
   * Perform GET request with fetch
   * @return {Promise} Reponse's promise
   */
  get() {
    return this.method('GET').send();
  }

  /**
   * Perform POST request with fetch
   * @return {Promise} Reponse's promise
   */
  post(body) {
    return this.body(body).method('POST').send();
  }

  /**
   * Perform PUT request with fetch
   * @return {Promise} Reponse's promise
   */
  put(body) {
    return this.body(body).method('PUT').send();
  }

  /**
   * Perform PATCH request with fetch
   * @return {Promise} Reponse's promise
   */
  patch(body) {
    return this.body(body).method('PATCH').send();
  }

  /**
   * Perform DELETE request with fetch
   * @return {Promise} Reponse's promise
   */
  delete() {
    return this.method('DELETE').send();
  }

  /**
   * Perform fetch call with instance params.
   * @return {Promise} Reponse's promise
   */
  send() {
    return doFetch(this.url, this.params, this.errorHandler, this.readContent);
  }
}

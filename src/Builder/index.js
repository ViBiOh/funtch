import 'isomorphic-fetch';
import {
  ACCEPT_TYPE_HEADER,
  AUTHORIZATION_HEADER,
  CONTENT_TYPE_HEADER,
  MEDIA_TYPE_JSON,
  MEDIA_TYPE_TEXT,
} from '../Constants';
import {
  contentHandler,
  errorHandler,
  getReadContentFull,
  stringify,
  isJson,
  encode,
} from '../Utils/index';

/**
 * Perform fetch operation from given params.
 * @param  {String}   url            URL to fetch
 * @param  {Object}   params         Fetch params
 * @param  {Function} contentHandler Content handling method, called with output of error handling
 * @param  {Function} errorHandler   Error handling method, first called method with raw response.
 * @param  {Function} abortHandler   Callback for handling aborted request
 * @return {Promise} Promise of fetching to bind to.
 */
function doFetch(url, params, abortHandler, content = contentHandler, error = errorHandler) {
  return fetch(url, params)
    .then((response) => error(response, content))
    .then(content)
    .catch((e) => {
      if (e.name === 'AbortError' && abortHandler) {
        abortHandler(e);
        return;
      }
      throw e;
    });
}

/**
 * Builder of fetch call with a functionnal design.
 */
export default class Builder {
  constructor(options) {
    let signal;
    if (typeof AbortController !== 'undefined') {
      this.controller = new AbortController();
      signal = this.controller.signal;
    }

    this.full = false;
    this.queryParams = {};
    this.params = {
      headers: {},
      signal,
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

    if (options.query) {
      this.query(options.query);
    }

    if (typeof options.contentHandler === 'function') {
      this.contentHandler(options.contentHandler);
    }

    if (typeof options.errorHandler === 'function') {
      this.errorHandler(options.errorHandler);
    }

    if (options.abortHandler) {
      this.abortHandler(options.abortHandler);
    }

    if (options.fullResponse) {
      this.fullResponse();
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
   * Define query params
   * @param  {Object} query URL Params as Object / Map
   * @return {Object} instance
   */
  query(query = {}) {
    this.queryParams = {
      ...this.queryParams,
      ...query,
    };

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
  contentHandler(handler) {
    this.content = handler;

    return this;
  }

  /**
   * Set error handler for request
   * @param  {Function} handler Function that will receive response Promise and readContent method
   * and should check and handle if response in an error or not. Should return Promise.
   * @return {Object} instance
   */
  errorHandler(handler) {
    this.error = handler;

    return this;
  }

  /**
   * Set abort handler when request is aborted
   * @param {Function} handler Function that will receive the error when request in aborted
   * @return {Object} instance
   */
  abortHandler(handler) {
    this.abort = handler;

    return this;
  }

  /**
   * Enable full content response
   * @return {Object} instance
   */
  fullResponse() {
    this.full = true;

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
   * @param  {Object} query URL Params as Object / Map
   * @return {Promise} Reponse's promise
   */
  get(query) {
    return this.method('GET').query(query).send();
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
    let { url, content } = this;

    if (this.queryParams) {
      const queryString = encode(this.queryParams);
      if (queryString) {
        if (url.indexOf('?') === -1) {
          url += '?';
        } else {
          url += '&';
        }

        url += queryString;
      }
    }

    if (this.full) {
      content = getReadContentFull(content);
    }

    return doFetch(url, this.params, this.abort, content, this.error);
  }

  /**
   * Abort request.
   */
  abort() {
    if (this.controller) {
      this.controller.abort();
    } else {
      console.warn('cannot abort fetch: no AbortController available.');
    }
  }
}

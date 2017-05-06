import 'isomorphic-fetch';

const CONTENT_TYPE_HEADER = 'Content-Type';
const ACCEPT_TYPE_HEADER = 'Accept';
const AUTHORIZATION_HEADER = 'Authorization';
const MEDIA_TYPE_JSON = 'application/json';
const MEDIA_TYPE_TEXT = 'text/plain';

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
    // eslint-disable-next-line no-param-reassign
    previous[current[0]] = current[1];
    return previous;
  }, {});
}

/**
 * Read content from response
 * @param  {Object} response Fetch response
 * @return {Object} Content according to ContentType Header (text or JSON)
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
 * @param  {Function} getContent Content reader of response
 * @return {Promise<Object>} Promise with error description if HTTP status greater or equal 400,
 * resonse otherwise
 */
export function errorHandler(response, getContent = readContent) {
  if (response.status < 400) {
    return response;
  }

  return new Promise((resolve, reject) =>
    getContent(response).then((content) => {
      reject({
        status: response.status,
        headers: readHeaders(response),
        content,
        toString: () => (typeof content === 'string' ? content : JSON.stringify(content)),
      });
    }),
  );
}

function doFetch(url, params = {}, error = errorHandler, content = readContent) {
  return fetch(url, params).then(response => error(response, content)).then(content);
}

function isJson(body) {
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
}

class FuntchBuilder {
  constructor() {
    this.params = {
      headers: {},
    };
  }

  url(url) {
    this.url = url;

    return this;
  }

  header(key, value) {
    this.params.headers[key] = value;

    return this;
  }

  auth(value) {
    return this.header(AUTHORIZATION_HEADER, value);
  }

  contentJson() {
    return this.header(CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON);
  }

  contentText() {
    return this.header(CONTENT_TYPE_HEADER, MEDIA_TYPE_TEXT);
  }

  guessContentType(body) {
    if (isJson(body)) {
      return this.contentJson();
    }
    return this.contentText();
  }

  acceptJson() {
    return this.header(ACCEPT_TYPE_HEADER, MEDIA_TYPE_JSON);
  }

  acceptText() {
    return this.header(ACCEPT_TYPE_HEADER, MEDIA_TYPE_TEXT);
  }

  content(handler) {
    this.readContent = handler;

    return this;
  }

  error(handler) {
    this.errorHandler = handler;

    return this;
  }

  body(body, guess = true) {
    if (typeof body !== 'undefined') {
      this.params.body = body;

      if (!this.params.headers[CONTENT_TYPE_HEADER] && guess) {
        return this.guessContentType(body);
      }
    }

    return this;
  }

  get() {
    this.params.method = 'GET';
    return this.send();
  }

  post(body) {
    this.body(body);

    this.params.method = 'POST';
    return this.send();
  }

  put(body) {
    this.body(body);

    this.params.method = 'PUT';
    return this.send();
  }

  patch(body) {
    this.body(body);

    this.params.method = 'PATCH';
    return this.send();
  }

  delete() {
    this.params.method = 'DELETE';
    return this.send();
  }

  send() {
    return doFetch(this.url, this.params, this.errorHandler, this.readContent);
  }
}

/**
 * funtch functional interface
 */
export default class funtch {
  static url(url) {
    return new FuntchBuilder().url(url);
  }

  static get(url) {
    return new FuntchBuilder().url(url).get();
  }

  static post(url, body) {
    return new FuntchBuilder().url(url).post(body);
  }

  static put(url, body) {
    return new FuntchBuilder().url(url).put(body);
  }

  static patch(url, body) {
    return new FuntchBuilder().url(url).patch(body);
  }

  static delete(url) {
    return new FuntchBuilder().url(url).delete();
  }
}

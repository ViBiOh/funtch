import 'whatwg-fetch';

const CONTENT_TYPE_HEADER = 'Content-Type';
const ACCEPT_TYPE_HEADER = 'Accept';
const AUTHORIZATION_HEADER = 'Authorization';
const MEDIA_TYPE_JSON = 'application/json';
const MEDIA_TYPE_TEXT = 'text/plain';

const CONTENT_TYPE_JSON = new RegExp(MEDIA_TYPE_JSON, 'i');

function isJson(body) {
  try {
    JSON.parse(body);
    return true;
  } catch (e) {
    return false;
  }
}

export function contentHandler(response) {
  if (CONTENT_TYPE_JSON.test(response.headers.get(CONTENT_TYPE_HEADER))) {
    return response.json();
  }
  return response.text();
}

export function errorHandler(response, getContent = contentHandler) {
  if (response.status < 400) {
    return response;
  }

  return new Promise((resolve, reject) => getContent(response).then(content => reject({
    status: response.status,
    content,
  })));
}

function doFetch(url, params = {}, error = errorHandler, content = contentHandler) {
  return fetch(url, params)
    .then(response => error(response, content))
    .then(content);
}

class FetchBuilder {
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
    this.contentHandler = handler;

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
    return doFetch(this.url, this.params, this.errorHandler, this.contentHandler);
  }
}

export default class Fetch {
  static url(url) {
    return new FetchBuilder().url(url);
  }

  static get(url) {
    return new FetchBuilder().url(url).get();
  }

  static post(url, body) {
    return new FetchBuilder().url(url).post(body);
  }

  static put(url, body) {
    return new FetchBuilder().url(url).put(body);
  }

  static patch(url, body) {
    return new FetchBuilder().url(url).patch(body);
  }

  static delete(url) {
    return new FetchBuilder().url(url).delete();
  }
}

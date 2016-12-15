/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */
import { expect } from 'chai';
import Fetch from '../src/Fetch';

describe('Fetch', () => {
  it('should return a promise', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => '',
      },
      text: () => Promise.resolve(''),
    });

    const result = Fetch.get('/');

    expect(result).to.be.instanceof(Promise);
  });

  it('should return text when asked', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.resolve('Test Mocha'),
    });

    return Fetch.post('/').then(data => expect(data).to.eql('Test Mocha'));
  });

  it('should return json when asked', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve({
        result: 'Test Mocha',
      }),
    });

    return Fetch.put('/').then(data => expect(data).to.eql({
      result: 'Test Mocha',
    }));
  });

  it('should return error when 400 or more', () => {
    global.fetch = () => Promise.resolve({
      status: 400,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.resolve('Test Mocha Error'),
    });

    return Fetch.patch('/').catch(data => expect(data.content).to.eql('Test Mocha Error'));
  });

  it('should return jsonError when 400 or more', () => {
    global.fetch = () => Promise.resolve({
      status: 500,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve({
        error: 'Test Mocha Error',
      }),
    });

    return Fetch.delete('/').catch(data => expect(data.content).to.eql({
      error: 'Test Mocha Error',
    }));
  });

  it('should return error when json fail', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.reject(new Error('Mocha JSON Error')),
    });

    return Fetch.get('/').catch(data => expect(String(data)).to.eql('Error: Mocha JSON Error'));
  });

  it('should pass header', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers),
    });

    return Fetch.url('/')
      .header('custom', 'test')
      .get()
      .then(({ custom }) => expect(custom).to.eql('test'));
  });

  it('should pass auth', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers),
    });

    return Fetch.url('/')
      .auth('token')
      .get()
      .then(({ Authorization }) => expect(Authorization).to.eql('token'));
  });

  it('should pass contentType for json', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers['Content-Type']),
    });

    return Fetch.url('/')
      .contentJson()
      .get()
      .then(contentType => expect(contentType).to.eql('application/json'));
  });

  it('should pass contentType for text', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers['Content-Type']),
    });

    return Fetch.url('/')
      .contentText()
      .get()
      .then(contentType => expect(contentType).to.eql('text/plain'));
  });

  it('should pass acceptType for json', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers.Accept),
    });

    return Fetch.url('/')
      .acceptJson()
      .get()
      .then(accept => expect(accept).to.eql('application/json'));
  });

  it('should pass acceptType for text', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.headers.Accept),
    });

    return Fetch.url('/')
      .acceptText()
      .get()
      .then(accept => expect(accept).to.eql('text/plain'));
  });

  it('should pass body', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.body),
    });

    return Fetch.url('/')
      .body('body')
      .get()
      .then(body => expect(body).to.eql('body'));
  });

  it('should not pass body if undefined', () => {
    global.fetch = (url, params) => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve(params.body),
    });

    return Fetch.url('/')
      .body(undefined)
      .get()
      .then(body => expect(body).to.eql(undefined));
  });
});

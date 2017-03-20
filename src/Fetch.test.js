/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
import Fetch from '../src/Fetch';

describe('Fetch', () => {
  let stubFetch;

  const textPromise = Promise.resolve({
    status: 200,
    headers: {
      get: () => 'text/plain',
    },
    text: () => Promise.resolve(),
  });

  const jsonPromise = Promise.resolve({
    status: 200,
    headers: {
      get: () => 'application/json',
    },
    json: () => Promise.resolve(),
  });

  afterEach(() => {
    if (stubFetch) {
      stubFetch.restore();
    }
  });

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

    return Fetch.get('/')
      .then(data => expect(data).to.eql('Test Mocha'));
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

    return Fetch.get('/')
      .then(data => expect(data).to.eql({
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

    return Fetch.get('/')
      .then(() => expect(false).to.be.true)
      .catch((data) => {
        expect(data.content).to.eql('Test Mocha Error');
        expect(String(data)).to.eql('Test Mocha Error');
      });
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

    return Fetch.get('/')
      .then(() => expect(false).to.be.true)
      .catch((data) => {
        expect(data.content).to.eql({ error: 'Test Mocha Error' });
        expect(String(data)).to.eql('{"error":"Test Mocha Error"}');
      });
  });

  it('should return error when text fail', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.reject(new Error('Mocha Text Error')),
    });

    return Fetch.get('/')
      .then(() => expect(false).to.be.true)
      .catch(data => expect(String(data)).to.eql('Error: Mocha Text Error'));
  });

  it('should return error when json fail', () => {
    global.fetch = () => Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.reject(new Error('Mocha JSON Error')),
    });

    return Fetch.get('/')
      .then(() => expect(false).to.be.true)
      .catch(data => expect(String(data)).to.eql('Error: Mocha JSON Error'));
  });

  it('should pass header', () => {
    stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

    return Fetch.url('/').header('custom', 'test').get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          custom: 'test',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass auth', () => {
    stubFetch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

    return Fetch.url('/').auth('token').get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          Authorization: 'token',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass contentType for json', () => {
    stubFetch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

    return Fetch.url('/').contentJson().get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass contentType for text', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').contentText().get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass accept for json', () => {
    stubFetch = sinon.stub(global, 'fetch', () => jsonPromise);

    return Fetch.url('/').acceptJson().get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass accept for text', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').acceptText().get()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          Accept: 'text/plain',
        },
        method: 'GET',
      })).to.be.true);
  });

  it('should pass body', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').body('Hello World').post()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'Hello World',
        method: 'POST',
      })).to.be.true);
  });

  it('should pass json body', () => {
    stubFetch = sinon.stub(global, 'fetch', () => jsonPromise);

    return Fetch.url('/').body(JSON.stringify({ hello: 'World' })).post()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      })).to.be.true);
  });

  it('should not pass body if undefined', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').body().post()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'POST',
      })).to.be.true);
  });

  it('should guess json content', () => {
    stubFetch = sinon.stub(global, 'fetch', () => jsonPromise);

    return Fetch.post('/', JSON.stringify({ hello: 'World' }))
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      })).to.be.true);
  });

  it('should guess text content', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.post('/', '{hello":"World"}')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: '{hello":"World"}',
        method: 'POST',
      })).to.be.true);
  });

  it('should not guess content if already defined', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').contentText().body('{"hello":"World"}').post()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      })).to.be.true);
  });

  it('should not guess content if forbidden', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.url('/').body('{"hello":"World"}', false).post()
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        body: '{"hello":"World"}',
        method: 'POST',
      })).to.be.true);
  });

  it('should use given content handler', () => {
    global.fetch = () => Promise.resolve({
      status: 204,
    });

    let result;
    const customContentHandler = content => (result = content);

    return Fetch.url('/').content(customContentHandler).get().then(() => {
      expect(result).to.be.eql({
        status: 204,
      });
    });
  });

  it('should use given error handler', () => {
    global.fetch = () => Promise.resolve({
      status: 404,
      reason: 'Failed',
    });

    let result;
    const customErrorHandler = (content) => {
      result = content.reason;

      return Promise.reject();
    };

    return Fetch.url('/').error(customErrorHandler).get()
      .then(() => expect(false).to.be.true)
      .catch(() => expect(result).to.be.eql('Failed'));
  });

  it('should send GET', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.get('/')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'GET',
      })).to.be.true);
  });

  it('should send POST', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.post('/')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'POST',
      })).to.be.true);
  });

  it('should send PUT', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.put('/')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'PUT',
      })).to.be.true);
  });

  it('should send PATCH', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.patch('/')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'PATCH',
      })).to.be.true);
  });

  it('should send DELETE', () => {
    stubFetch = sinon.stub(global, 'fetch', () => textPromise);

    return Fetch.delete('/')
      .then(() => expect(stubFetch.calledWith('/', {
        headers: {},
        method: 'DELETE',
      })).to.be.true);
  });
});

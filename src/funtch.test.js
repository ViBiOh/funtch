import test from 'ava';
import sinon from 'sinon';
import funtch from './funtch';

let stubFuntch;

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

test.afterEach(() => {
  if (stubFuntch) {
    stubFuntch.restore();
  }
});

test('should return a promise', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 200,
      headers: {
        get: () => '',
      },
      text: () => Promise.resolve(''),
    });

  const result = funtch.get('/');

  t.true(result instanceof Promise);
});

test('should return text when asked', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 200,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.resolve('Test JS'),
    });

  return funtch.get('/').then(data => t.is(data, 'Test JS'));
});

test('should return json when asked', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () =>
        Promise.resolve({
          result: 'Test JS',
        }),
    });

  return funtch.get('/').then(data =>
    t.deepEqual(data, {
      result: 'Test JS',
    }),
  );
});

test('should return error when 400 or more', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 400,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.resolve('Test JS Error'),
    });

  return funtch.get('/').then(() => t.true(false)).catch((data) => {
    t.is(data.content, 'Test JS Error');
    t.is(String(data), 'Test JS Error');
  });
});

test('should return jsonError when 400 or more', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 500,
      headers: {
        get: () => 'application/json',
      },
      json: () =>
        Promise.resolve({
          error: 'Test JS Error',
        }),
    });

  return funtch.get('/').then(() => t.true(false)).catch((data) => {
    t.deepEqual(data.content, { error: 'Test JS Error' });
    t.is(String(data), '{"error":"Test JS Error"}');
  });
});

test('should return error when text fail', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 200,
      headers: {
        get: () => 'text/plain',
      },
      text: () => Promise.reject(new Error('JS Text Error')),
    });

  return funtch
    .get('/')
    .then(() => t.true(false))
    .catch(data => t.is(String(data), 'Error: JS Text Error'));
});

test('should return error when json fail', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.reject(new Error('JS JSON Error')),
    });

  return funtch
    .get('/')
    .then(() => t.true(false))
    .catch(data => t.is(String(data), 'Error: JS JSON Error'));
});

test.serial('should pass header', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').header('custom', 'test').get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          custom: 'test',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass auth', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').auth('token').get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          Authorization: 'token',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass contentType for json', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return funtch.url('/').contentJson().get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass contentType for text', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').contentText().get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass accept for json', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return funtch.url('/').acceptJson().get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass accept for text', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').acceptText().get().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          Accept: 'text/plain',
        },
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should pass body', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').body('Hello World').post().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'Hello World',
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should pass json body', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return funtch.url('/').body(JSON.stringify({ hello: 'World' })).post().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should not pass body if undefined', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').body().post().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should guess json content', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => jsonPromise);

  return funtch.post('/', JSON.stringify({ hello: 'World' })).then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should guess text content', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.post('/', '{hello":"World"}').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: '{hello":"World"}',
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should not guess content if already defined', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);
  const result = funtch.url('/').contentText().body('{"hello":"World"}').post();

  return result.then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {
          'Content-Type': 'text/plain',
        },
        body: '{"hello":"World"}',
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should not guess content if forbidden', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.url('/').body('{"hello":"World"}', false).post().then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        body: '{"hello":"World"}',
        method: 'POST',
      }),
      true,
    ),
  );
});

test('should use given content handler', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 204,
    });

  let result;
  const customContentHandler = (content) => {
    result = content;
  };

  return funtch.url('/').content(customContentHandler).get().then(() => {
    t.deepEqual(result, {
      status: 204,
    });
  });
});

test('should use given error handler', (t) => {
  global.fetch = () =>
    Promise.resolve({
      status: 404,
      reason: 'Failed',
    });

  let result;
  const customErrorHandler = (content) => {
    result = content.reason;

    return Promise.reject();
  };

  return funtch
    .url('/')
    .error(customErrorHandler)
    .get()
    .then(() => t.true(false))
    .catch(() => t.is(result, 'Failed'));
});

test.serial('should send GET', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.get('/').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'GET',
      }),
      true,
    ),
  );
});

test.serial('should send POST', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.post('/').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'POST',
      }),
      true,
    ),
  );
});

test.serial('should send PUT', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.put('/').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'PUT',
      }),
      true,
    ),
  );
});

test.serial('should send PATCH', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.patch('/').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'PATCH',
      }),
      true,
    ),
  );
});

test.serial('should send DELETE', (t) => {
  stubFuntch = sinon.stub(global, 'fetch').callsFake(() => textPromise);

  return funtch.delete('/').then(() =>
    t.is(
      stubFuntch.calledWith('/', {
        headers: {},
        method: 'DELETE',
      }),
      true,
    ),
  );
});

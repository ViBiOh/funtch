import test from 'ava';
import { errorHandler } from './index';

test('should do nothing else that wrap into Promise if response status is lower than 400', (t) => {
  const initialPromise = {
    status: 200,
  };

  return errorHandler(initialPromise).then((result) => t.is(result, initialPromise));
});

test('should reject promise with message if bad status', (t) =>
  errorHandler({
    status: 400,
    headers: new Map().set('header', 'value'),
    text: () => Promise.resolve('Hello world'),
  })
    .then(() => t.fail())
    .catch((data) => {
      t.is(data.data, 'Hello world');
      t.is(data.status, 400);
      t.deepEqual(data.headers, {
        header: 'value',
      });
    }));

test('should reject promise with custom message ', (t) =>
  errorHandler(
    {
      status: 400,
      headers: new Map(),
      text: () => Promise.resolve('Hello world'),
    },
    () => Promise.resolve('custom message reader'),
  )
    .then(() => t.fail())
    .catch((data) => t.is(data.data, 'custom message reader')));

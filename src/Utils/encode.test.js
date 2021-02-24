import test from 'ava';
import { encode } from './index';

test('should encode simple argument', (t) => {
  t.is(encode({ name: 'Hello' }), 'name=Hello');
});

test('should filter untruthy arg', (t) => {
  t.is(encode({ name: '', ids: [1, 2, 3] }), 'ids=1%2C2%2C3');
});

test('should concat args', (t) => {
  t.is(encode({ name: 'Hello', ids: ['abc', 'def'] }), 'name=Hello&ids=abc%2Cdef');
});

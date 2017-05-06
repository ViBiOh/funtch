import test from 'ava';
import { readHeaders } from './funtch';

test('should read raw if present', t =>
  t.deepEqual(
    readHeaders({
      headers: {
        raw: () => ({
          'content-type': ['text/plain'],
          'content-length': '19',
        }),
      },
    }),
    {
      'content-type': 'text/plain',
      'content-length': '19',
    },
  ));

test('should read from entries', t =>
  t.deepEqual(
    readHeaders({
      headers: new Map().set('content-type', 'text/plain').set('content-length', '19'),
    }),
    {
      'content-type': 'text/plain',
      'content-length': '19',
    },
  ));

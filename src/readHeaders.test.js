import test from 'ava';
import { readHeaders, CONTENT_TYPE_HEADER, MEDIA_TYPE_TEXT } from './funtch';

test('should read raw if present', t =>
  t.deepEqual(
    readHeaders({
      headers: {
        raw: () => ({
          [CONTENT_TYPE_HEADER]: [MEDIA_TYPE_TEXT],
          'content-length': '19',
        }),
      },
    }),
    {
      [CONTENT_TYPE_HEADER]: MEDIA_TYPE_TEXT,
      'content-length': '19',
    },
  ));

test('should read from entries', t =>
  t.deepEqual(
    readHeaders({
      headers: new Map().set(CONTENT_TYPE_HEADER, MEDIA_TYPE_TEXT).set('content-length', '19'),
    }),
    {
      [CONTENT_TYPE_HEADER]: MEDIA_TYPE_TEXT,
      'content-length': '19',
    },
  ));

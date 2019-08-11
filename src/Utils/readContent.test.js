import test from 'ava';
import { CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON } from '../Constants';
import { readContent } from './index';

test('should read from json() if ContentType match', t =>
  readContent({
    headers: new Map().set(CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON),
    json: () => Promise.resolve({ value: 'Hello World' }),
  }).then(data => t.deepEqual(data, { value: 'Hello World' })));

test('should read from text()', t =>
  readContent({
    headers: new Map(),
    text: () => Promise.resolve('Hello world'),
  }).then(data => t.is(data, 'Hello world')));

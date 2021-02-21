import test from 'ava';
import { CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON } from '../Constants';
import { contentHandler } from './index';

test('should read from json() if ContentType match', (t) =>
  contentHandler({
    headers: new Map().set(CONTENT_TYPE_HEADER, MEDIA_TYPE_JSON),
    json: () => Promise.resolve({ value: 'Hello World' }),
  }).then((data) => t.deepEqual(data, { value: 'Hello World' })));

test('should read from text()', (t) =>
  contentHandler({
    headers: new Map(),
    text: () => Promise.resolve('Hello world'),
  }).then((data) => t.is(data, 'Hello world')));

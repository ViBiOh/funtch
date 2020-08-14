import test from 'ava';
import { stringify } from './index';

test('should stringify a basic object', (t) => {
  const result = stringify({
    id: 8000,
    name: 'Bob',
  });

  t.deepEqual(result, '{"id":8000,"name":"Bob"}');
});

test('should stringify with given space', (t) => {
  const result = stringify(
    {
      id: 8000,
      name: 'Bob',
    },
    undefined,
    '  ',
  );

  t.deepEqual(result, '{\n  "id": 8000,\n  "name": "Bob"\n}');
});

test('should stringify with given space and ignoring', (t) => {
  const result = stringify(
    {
      id: 8000,
      name: 'Bob',
    },
    ['name'],
    '  ',
  );

  t.deepEqual(result, '{\n  "name": "Bob"\n}');
});

test('should stringify with circular reference', (t) => {
  const circularObject = { id: 8000 };
  circularObject.child = circularObject;
  const result = stringify(circularObject);

  t.deepEqual(result, '{"id":8000,"child":"[Circular]"}');
});

import { COMMENT } from '../COMMENT';
import { stringify } from '../stringify';

test('comments in object', () => {
  expect(stringify({
    name: 'value',
    instructions: COMMENT('Add a name here'),
    key2: 'another value',
  })).toEqual(
    `name: value
Add a name here
key2: another value`,
  );
});

test('comments in simple array', () => {
  expect(stringify({
    array: [
      'Value 1',
      COMMENT('Not a value'),
      'Value 2',
    ],
  })).toEqual(
    `[array]
* Value 1
Not a value
* Value 2
[]`,
  );
});

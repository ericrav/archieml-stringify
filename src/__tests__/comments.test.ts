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

test('multi-line comment', () => {
  expect(stringify({
    instructions: COMMENT('Add text here\nCreate entries in the form of:\nkey: value\n:endskip'),
    name: 'value',
    key2: 'another value',
  })).toEqual(
    `:skip
Add text here
Create entries in the form of:
key: value
\\:endskip
:endskip
name: value
key2: another value`,
  );
});

test('escaping comments', () => {
  expect(stringify({
    regular: COMMENT('Sentences do not need escaping'),
    keyValue: COMMENT('key: value escaped'),
    ignore: COMMENT(':ignore'),
    multilineWithoutEscaping: COMMENT('Regular\nmulti-line text'),
    multiline: COMMENT('Hello\n:ignore\n:skip\nkey: value'),
  })).toEqual(
    `Sentences do not need escaping
\\key: value escaped
\\:ignore
Regular
multi-line text
:skip
Hello
\\:ignore
\\:skip
key: value
:endskip`,
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

test('comment at beginning simple array', () => {
  expect(stringify({
    array: [
      COMMENT('Test:'),
      'Value 1',
      COMMENT('Not a value'),
      'Value 2',
    ],
  })).toEqual(
    `[array]
\\Test:
* Value 1
Not a value
* Value 2
[]`,
  );
});

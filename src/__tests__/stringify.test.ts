import archieml from 'archieml';
import { COMMENT } from '../COMMENT';
import { stringify } from '../stringify';

const specialCases: [string, any][] = [
  ['', undefined],
  ['', null],
  ['', { 'keys with spaces': 'are ignored' }],
  ['', { 'keys with spaces': 'are ignored', '': 'no empty' }],
  [
    'normal: key\nkeys with spaces can be comments',
    { normal: 'key', 'keys with spaces can be comments': COMMENT },
  ],
  ['scope.key: value', { 'scope.key': 'value' }],
  [
    `[strings]
* Item 1
* Item 2
[]`,
    { strings: ['Item 1', { mixedObjects: 'ignored' }, 'Item 2'] },
  ],
  [
    `[array]
name: Amanda
age: 26

name: Tessa
age: 30
[]`,
    {
      array: [
        {
          name: 'Amanda',
          age: '26',
        },
        {
          differingFirstKey: 'ignored',
          name: 'Bess',
          age: '27',
        },
        {
          name: 'Tessa',
          age: '30',
        },
      ],
    },
  ],
];

const invertibleCases: [string, any][] = [
  ['', {}],
  ['key: value', { key: 'value' }],
  [
    'key: value\nanother-value: with dashes',
    { key: 'value', 'another-value': 'with dashes' },
  ],
  ['{object}\n{}', { object: {} }],
  ['{scope}\nkey: value\n{}', { scope: { key: 'value' } }],
  [
    '{scope}\nkey: value\nother: value\n{}',
    { scope: { key: 'value', other: 'value' } },
  ],
  [
    `root: no scope
{scope}
key: value
other: value
{}`,
    { root: 'no scope', scope: { key: 'value', other: 'value' } },
  ],
  [
    `root: no scope
{scope}
key: value
other: value
{}
{second_scope}
foo: bar
{}`,
    {
      root: 'no scope',
      scope: { key: 'value', other: 'value' },
      second_scope: { foo: 'bar' },
    },
  ],
  [
    `[strings]
* Item 1
* Item 2
[]`,
    { strings: ['Item 1', 'Item 2'] },
  ],
  [
    `[array]
name: Amanda
age: 26

name: Tessa
age: 30
[]`,
    {
      array: [
        {
          name: 'Amanda',
          age: '26',
        },
        {
          name: 'Tessa',
          age: '30',
        },
      ],
    },
  ],
  [
    `[array]
{.scope}
key: first
{}

{.scope}
key: second
{}
[]`,
    { array: [{ scope: { key: 'first' } }, { scope: { key: 'second' } }] },
  ],
  [
    `{colors}
red: #f00
green: #0f0
blue: #00f
{.numbers}
one: 1
ten: 10
one-hundred: 100
{}
nestedKey: nestedValue
{}
{months}
january: 0
february: 1
{}`,
    {
      colors: {
        red: '#f00',
        green: '#0f0',
        blue: '#00f',
        numbers: {
          one: '1',
          ten: '10',
          'one-hundred': '100',
        },
        nestedKey: 'nestedValue',
      },
      months: {
        january: '0',
        february: '1',
      },
    },
  ],
];

const cases = [...specialCases, ...invertibleCases];

test.each(cases)('stringifies to %s', (expected, input) => {
  const stringified = stringify(input);
  expect(stringified).toEqual(expected);
});

test.each(invertibleCases)('parses output %s', (_, input) => {
  const stringified = stringify(input);
  expect(archieml.load(stringified)).toEqual(input);
});

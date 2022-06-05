import archieml from 'archieml';
import { COMMENT } from '../COMMENT';
import { stringify } from '../stringify';

const specialCases: [string, unknown][] = [
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
  [
    `{colors}
red: #f00
green: #0f0
blue: #00f
{.grays}
light: #aaa
dark: #333
{}
{}
[numbers]
* 1
* 10
* 50
[]
key: value
[+freeform]
name: Archie
awesome: true
Lorem ipsum...
[]`,
    {
      colors: {
        red: '#f00',
        green: '#0f0',
        blue: '#00f',
        grays: {
          light: '#aaa',
          dark: '#333',
        },
      },
      numbers: [1, 10, 50],
      key: 'value',
      freeform: [
        { type: 'name', value: 'Archie' },
        { type: 'awesome', value: true },
        { type: 'text', value: 'Lorem ipsum...' },
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
  [
    `[array]
[.subarray]
[.subsubarray]
key: value
[]
[]
[]`,
    {
      array: [
        {
          subarray: [
            {
              subsubarray: [
                {
                  key: 'value',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  [
    `[days]
name: Monday
[.tasks]
* Clean dishes
* Pick up room
[]

name: Tuesday
[.tasks]
* Buy milk
[]
[]`,
    {
      days: [
        {
          name: 'Monday',
          tasks: ['Clean dishes', 'Pick up room'],
        },
        {
          name: 'Tuesday',
          tasks: ['Buy milk'],
        },
      ],
    },
  ],
  [
    `[+books]
kicker: Books you should read
score: ★★★★★!!!
title: Wuthering Heights
author: Emily Brontë
title: Middlemarch
author: George Eliot
score: ★★★★☆
[]`,
    {
      books: [
        {
          type: 'kicker',
          value: 'Books you should read',
        },
        {
          type: 'score',
          value: '★★★★★!!!',
        },
        {
          type: 'title',
          value: 'Wuthering Heights',
        },
        {
          type: 'author',
          value: 'Emily Brontë',
        },
        {
          type: 'title',
          value: 'Middlemarch',
        },
        {
          type: 'author',
          value: 'George Eliot',
        },
        {
          type: 'score',
          value: '★★★★☆',
        },
      ],
    },
  ],
  [
    `[+text]
I can type words here...

And separate them into different paragraphs without tags.
[]`,
    {
      text: [
        {
          type: 'text',
          value: 'I can type words here...',
        },
        {
          type: 'text',
          value: 'And separate them into different paragraphs without tags.',
        },
      ],
    },
  ],
  [
    `[+events]
header: My Birthday
date: August 20th, 1990
{.image}
src: http://example.com/photo.png
alt: Family Photo
{}
header: High School Graduation
date: June 4th, 2008
[]`,
    {
      events: [
        {
          type: 'header',
          value: 'My Birthday',
        },
        {
          type: 'date',
          value: 'August 20th, 1990',
        },
        {
          type: 'image',
          value: {
            src: 'http://example.com/photo.png',
            alt: 'Family Photo',
          },
        },
        {
          type: 'header',
          value: 'High School Graduation',
        },
        {
          type: 'date',
          value: 'June 4th, 2008',
        },
      ],
    },
  ],
  [
    `key: value
 More value

Even more value
:end`,
    {
      key: 'value\n More value\n\nEven more value',
    },
  ],
  [
    `{arrays}
[.complex]
key: value
more value
:end
[]
[.simple]
* value
more value
:end
[]
{}`,
    {
      arrays: {
        complex: [
          {
            key: 'value\nmore value',
          },
        ],
        simple: ['value\nmore value'],
      },
    },
  ],
  [
    `[array]
* Value 1
\\* extra
:end
[]`,
    { array: ['Value 1\n* extra'] },
  ],
  [
    `[array]
* Value1
\\:end
:end
[]`,
    { array: ['Value1\n:end'] },
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

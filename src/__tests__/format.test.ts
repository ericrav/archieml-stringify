import { stringify } from '../stringify';

test('format', () => {
  const formatter = jest.fn((strings) => strings.join(''));
  const obj = {
    key: 'value',
    strings: ['A', 'B', 'C'],
    scope: {
      nested: {},
      array: [
        { name: 'Bob' },
        { name: 'Bill' },
      ],
    },
  };
  stringify(obj, { formatter });
  expect(formatter.mock.calls).toEqual([
    [
      ['', 'key', ': ', 'value', ''],
      {
        key: 'key',
        value: obj.key,
        path: ['key'],
        parent: obj,
      },
    ],
    [
      ['* ', 'A', ''],
      {
        key: 0,
        value: obj.strings[0],
        path: ['strings', 0],
        parent: obj.strings,
      },
    ],
    [
      ['* ', 'B', ''],
      {
        key: 1,
        value: obj.strings[1],
        path: ['strings', 1],
        parent: obj.strings,
      },
    ],
    [
      ['* ', 'C', ''],
      {
        key: 2,
        value: obj.strings[2],
        path: ['strings', 2],
        parent: obj.strings,
      },
    ],
    [
      ['[', 'strings', ']\n', '* A\n* B\n* C\n', '[]'],
      {
        key: 'strings',
        value: obj.strings,
        path: ['strings'],
        parent: obj,
      },
    ],
    [
      ['{', '.nested', '}\n', '', '{}'],
      {
        key: 'nested',
        value: obj.scope.nested,
        path: ['scope', 'nested'],
        parent: obj.scope,
      },
    ],
    [
      ['', 'name', ': ', 'Bob', ''],
      {
        key: 'name',
        value: obj.scope.array[0].name,
        path: ['scope', 'array', 0, 'name'],
        parent: obj.scope.array[0],
      },
    ],
    [
      ['', 'name: Bob', ''],
      {
        key: 0,
        value: obj.scope.array[0],
        path: ['scope', 'array', 0],
        parent: obj.scope.array,
      },
    ],
    [
      ['', 'name', ': ', 'Bill', ''],
      {
        key: 'name',
        value: obj.scope.array[1].name,
        path: ['scope', 'array', 1, 'name'],
        parent: obj.scope.array[1],
      },
    ],
    [
      ['', 'name: Bill', ''],
      {
        key: 1,
        value: obj.scope.array[1],
        path: ['scope', 'array', 1],
        parent: obj.scope.array,
      },
    ],
    [
      ['[', '.array', ']\n', 'name: Bob\nname: Bill\n', '[]'],
      {
        key: 'array',
        value: obj.scope.array,
        path: ['scope', 'array'],
        parent: obj.scope,
      },
    ],
    [
      ['{', 'scope', '}\n', expect.any(String), '{}'],
      {
        key: 'scope',
        value: obj.scope,
        path: ['scope'],
        parent: obj,
      },
    ],
  ]);
});

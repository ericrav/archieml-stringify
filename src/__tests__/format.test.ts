import { stringify } from '../stringify';

test('format', () => {
  const formatter = jest.fn((strings) => strings.join(''));
  const obj = {
    key: 'value',
    strings: ['A', 'B', 'C'],
    // scope: {
    //   array: [
    //     { name: 'Bob' },
    //     { name: 'Bill' },
    //   ],
    //   key2: 'value',
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
  ]);
});

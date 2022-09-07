import { COMMENT, isComment } from '../COMMENT';
import { Formatter } from '../format';
import { stringify } from '../stringify';

test('format', () => {
  const formatter = jest.fn((strings) => strings.join(''));
  const obj = {
    key: 'value',
    comment: COMMENT('A comment!'),
    strings: ['A', 'B', 'C'],
    scope: {
      nested: {},
      array: [
        { name: 'Bob' },
        { name: 'Bill' },
      ],
      freeform: [
        { type: 'text', value: 'Some multi-line\ntext' },
        { type: 'kicker', value: 'Check it out!' },
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
      ['A comment!'],
      {
        key: 'comment',
        value: COMMENT('A comment!'),
        path: ['comment'],
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
      ['Some multi-line\ntext\n:end'],
      {
        key: 0,
        value: obj.scope.freeform[0],
        path: ['scope', 'freeform', 0],
        parent: obj.scope.freeform,
      },
    ],
    [
      ['', 'kicker', ': ', 'Check it out!', ''],
      {
        key: 1,
        value: obj.scope.freeform[1],
        path: ['scope', 'freeform', 1],
        parent: obj.scope.freeform,
      },
    ],
    [
      ['[', '.+freeform', ']\n', expect.any(String), '[]'],
      {
        key: 'freeform',
        value: obj.scope.freeform,
        path: ['scope', 'freeform'],
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

test('html formatter', () => {
  const obj = {
    key: 'value',
    key_comment: COMMENT('Comment for the above'),
    scope1: {
      key2: 'value',
      nested: {
        nestedKey: 'value',
      },
    },
    array: ['Item 1', 'Item 2'],
  };

  const formatter: Formatter = (strings, context) => {
    if (Array.isArray(context.parent)) {
      return `<li>${strings.slice(1).join('')}</li>`;
    }

    if (isComment(context.value)) {
      return `<em>${strings.join('')}</em>`;
    }

    if (typeof context.value === 'string') {
      return `<span><bold>${strings.slice(0, 3).join('').trim()}</bold> ${strings.slice(3).join('')}</span>`;
    }

    if (typeof context.value === 'object') {
      const hLevel = context.path.length;
      const body = Array.isArray(context.value)
        ? `<ul>\n${strings.slice(3, 4).join('')}</ul>\n${strings.slice(4).join('')}\n`
        : strings.slice(3).join('');
      return `<h${hLevel}>${strings.slice(0, 3).join('').trim()}</h${hLevel}>\n${body}`;
    }

    return strings.join('');
  };

  const result = stringify(obj, { formatter });

  expect(result).toEqual(
    `<span><bold>key:</bold> value</span>
<em>Comment for the above</em>
<h1>{scope1}</h1>
<span><bold>key2:</bold> value</span>
<h2>{.nested}</h2>
<span><bold>nestedKey:</bold> value</span>
{}
{}
<h1>[array]</h1>
<ul>
<li>Item 1</li>
<li>Item 2</li>
</ul>
[]
`,
  );
});

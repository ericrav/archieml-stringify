/* eslint-disable max-len */
import { isComment } from './COMMENT';
import { escapeComment, stringifyValue } from './escape';
import {
  defaultFormat, FormatTaggedFn, formatTemplate, Formatter,
} from './format';
import {
  FreeformObject, getFirstKey, hasWhiteSpace, isFreeformArrayObject,
} from './utils';

export interface Options {
  formatter?: Formatter;
}

export function stringify(input: unknown, options?: Options) {
  return stringifyRoot(input, {
    format: formatTemplate(options?.formatter || defaultFormat),
    parent: input,
    path: [],
  });
}

interface Context {
  format: FormatTaggedFn;
  nested?: boolean;
  parent: any;
  path: (string | number)[];
}

function stringifyRoot(
  input: unknown,
  context: Context,
): string {
  if (!input || typeof input !== 'object') return '';

  return Object.entries(input)
    .map(([key, value]) => stringifyKeyValue(key, value, context))
    .filter((str) => str !== undefined)
    .join('\n');
}

function stringifyKeyValue(
  key: string,
  value: unknown,
  {
    nested, format, parent, path: parentPath,
  }: Context,
): string | undefined {
  if (isComment(value)) {
    return escapeComment(value);
  }

  // ignore values that cannot be represented in ArchieML
  if (!key || hasWhiteSpace(key)) {
    return undefined;
  }

  const path = parentPath.concat(key);

  if (Array.isArray(value)) {
    let prefix = nested ? '.' : '';
    const inner = (() => {
      const firstItem = value.find((item) => !isComment(item));
      if (isSimpleValue(firstItem)) {
        return stringifyArray(value, {
          predicate: isSimpleValue,
          format: (val) => format({
            key, value, path, parent: value,
          })`* ${stringifyValue(val)}`,
        });
      }

      if (isFreeformArrayObject(firstItem)) {
        prefix = `${prefix}+`;
        return stringifyFreeformArray(value.filter(isFreeformArrayObject), { format, parent: value, path });
      }

      const firstKey = firstItem && getFirstKey(firstItem);
      return stringifyArray(
        value,
        {
          predicate: (val) => typeof val === 'object' && getFirstKey(val) === firstKey,
          format: (val, i) => format({
            key, value: val, path: path.concat(i), parent: value,
          })`${stringifyRoot(val, {
            nested: true, format, parent: val, path: path.concat(i),
          })}`,
        },
      );
    })();

    return format({
      key, value, path, parent,
    })`[${prefix}${key}]\n${inner}${inner && '\n'}[]`;
  }

  if (typeof value === 'object') {
    const inner = stringifyRoot(value, {
      nested: true, format, parent: value, path,
    }) || '';
    return format({ parent, path })`{${nested ? '.' : ''}${key}}\n${inner}${inner && '\n'}{}`;
  }

  return format({
    key, value, parent, path,
  })`${key}: ${stringifyValue(value)}`;
}

function isSimpleValue(value: unknown): boolean {
  return ['string', 'boolean', 'number'].includes(typeof value);
}

function stringifyArray(
  array: unknown[],
  { predicate, format }: {
    predicate: (item: unknown) => boolean;
    format: (item: unknown, index: number) => string;
  },
): string {
  return array.reduce<string>((acc, val, i) => {
    if (isComment(val)) {
      const next = escapeComment(val);
      return acc ? `${acc}\n${next}` : next;
    }

    if (predicate(val)) {
      const next = format(val, i);
      return acc ? `${acc}\n${next}` : next;
    }

    return acc;
  }, '');
}

function stringifyFreeformArray(array: FreeformObject[], { format, path }: Context): string {
  return array
    .map(({ type, value }, i) => {
      if (type === 'text') {
        const isLast = i === array.length - 1;
        return format({ path: path.concat(i), parent: array })`${stringifyValue(value)}${isLast ? '' : '\n'}`;
      }

      return stringifyRoot({ [type]: value }, {
        nested: true, format, parent: array, path: path.concat(i),
      });
    })
    .join('\n');
}

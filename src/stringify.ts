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
    let inner = (() => {
      const firstItem = value.find((item) => !isComment(item));
      if (isSimpleValue(firstItem)) {
        return stringifyArray(value, {
          predicate: isSimpleValue,
          format: (val, i) => format({
            key: i, value: val, path: path.concat(i), parent: value,
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
            key: i, value: val, path: path.concat(i), parent: value,
          })`${stringifyRoot(val, {
            nested: true, format, parent: val, path: path.concat(i),
          })}`,
        },
      );
    })();

    inner = inner ? `${inner}\n` : inner;
    const scope = `${prefix}${key}`;
    return format({
      key, value, path, parent,
    })`[${scope}]\n${inner}[]`;
  }

  if (typeof value === 'object') {
    let inner = stringifyRoot(value, {
      nested: true, format, parent: value, path,
    }) || '';
    const scope = `${nested ? '.' : ''}${key}`;
    inner = inner ? `${inner}\n` : inner;
    return format({
      key, value, parent, path,
    })`{${scope}}\n${inner}{}`;
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
        const text = `${stringifyValue(value)}`;
        return format({
          key: i, value: { type, value }, path: path.concat(i), parent: array,
        })([text] as unknown as TemplateStringsArray); // directly call tagged template to force array of 1 string
      }

      return stringifyKeyValue(type, value, {
        nested: true,
        // override key-value format with freeform object index and value
        format: () => format({
          key: i, value: { type, value }, path: path.concat(i), parent: array,
        }),
        parent: array,
        path: path.concat(i),
      });
    })
    .join('\n');
}

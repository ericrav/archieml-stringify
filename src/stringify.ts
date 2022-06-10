import type { ArchieMLObj } from 'archieml';
import { isComment } from './COMMENT';
import { escapeComment, stringifyValue } from './escape';
import { format as defaultFormat } from './format';
import { hasWhiteSpace } from './utils';

interface Options {
  format?: any;
  nested?: boolean;
}

export function stringify(
  input: unknown,
  { format = defaultFormat, nested }: Options = { format: defaultFormat },
): string {
  if (!input || typeof input !== 'object') return '';

  return Object.entries(input)
    .map(([key, value]) => stringifyKeyValue(key, value, { format, nested }))
    .filter((str) => str !== undefined)
    .join('\n');
}

function stringifyKeyValue(
  key: string,
  value: unknown,
  { nested, format }: Options,
): string | undefined {
  if (isComment(value)) {
    return escapeComment(value);
  }

  // ignore values that cannot be represented in ArchieML
  if (!key || hasWhiteSpace(key)) {
    return undefined;
  }

  if (Array.isArray(value)) {
    let prefix = nested ? '.' : '';
    const inner = (() => {
      const firstItem = value.find((item) => !isComment(item));
      if (isSimpleValue(firstItem)) {
        return stringifyArray(value, {
          predicate: isSimpleValue,
          /** --- HERE --- */
          format: (val) => `* ${stringifyValue(val)}`,
        });
      }

      if (isFreeformArrayObject(firstItem)) {
        prefix = `${prefix}+`;
        return stringifyFreeformArray(value.filter(isFreeformArrayObject));
      }

      const firstKey = firstItem && Object.getOwnPropertyNames(firstItem)[0];
      return stringifyArray(
        value,
        {
          predicate: (val) => typeof val === 'object' && Object.getOwnPropertyNames(val)[0] === firstKey,
          /** --- HERE --- */
          format: (val, acc) => `${acc ? '\n' : ''}${stringify(val, { nested: true })}`,
        },
      );
    })();
    /** --- HERE --- */
    return `[${prefix}${key}]\n${inner}${inner && '\n'}[]`;
  }

  if (typeof value === 'object') {
    const inner = stringify(value, { nested: true, format }) || '';
    /** --- HERE --- */
    return `{${nested ? '.' : ''}${key}}\n${inner}${inner && '\n'}{}`;
  }

  /** --- HERE --- */
  return format(`${key}: ${stringifyValue(value)}`);
}

function isSimpleValue(value: unknown): boolean {
  return ['string', 'boolean', 'number'].includes(typeof value);
}

function stringifyArray(
  array: unknown[],
  { predicate, format }: {
    predicate: (item: unknown) => boolean;
    format: (item: unknown, acc: string) => string;
  },
): string {
  return array.reduce<string>((acc, val) => {
    if (isComment(val)) {
      const next = escapeComment(val);
      return acc ? `${acc}\n${next}` : next;
    }

    if (predicate(val)) {
      const next = format(val, acc);
      return acc ? `${acc}\n${next}` : next;
    }

    return acc;
  }, '');
}

interface FreeformObject {
  type: string;
  value: ArchieMLObj;
}

function isFreeformArrayObject(item: unknown): item is FreeformObject {
  return typeof item === 'object'
    && item !== null
    && typeof (item as FreeformObject).type === 'string'
    && !hasWhiteSpace((item as FreeformObject).type)
    && (item as FreeformObject).value !== undefined
    && (item as FreeformObject).value !== null;
}

function stringifyFreeformArray(array: FreeformObject[]): string {
  return array
    .map(({ type, value }, i) => {
      if (type === 'text') {
        const isLast = i === array.length - 1;
        /** --- HERE --- */
        return `${value}${isLast ? '' : '\n'}`;
      }

      return stringify({ [type]: value }, { nested: true });
    })
    .join('\n');
}

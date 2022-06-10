import type { ArchieMLObj } from 'archieml';
import { isComment } from './COMMENT';
import { escapeComment, stringifyValue } from './escape';
import {
  defaultFormat, FormatTaggedFn, formatTemplate, Formatter,
} from './format';
import { getFirstKey, hasWhiteSpace } from './utils';

export interface Options {
  formatter?: Formatter;
}

export function stringify(input: unknown, options?: Options) {
  return stringifyRoot(input, { format: formatTemplate(options?.formatter || defaultFormat) });
}

interface Context {
  format: FormatTaggedFn;
  nested?: boolean;
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
  { nested, format }: Context,
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
          format: (val) => format`* ${stringifyValue(val)}`,
        });
      }

      if (isFreeformArrayObject(firstItem)) {
        prefix = `${prefix}+`;
        return stringifyFreeformArray(value.filter(isFreeformArrayObject), { format });
      }

      const firstKey = firstItem && getFirstKey(firstItem);
      return stringifyArray(
        value,
        {
          predicate: (val) => typeof val === 'object' && getFirstKey(val) === firstKey,
          format: (val, acc) => `${acc ? '\n' : ''}${stringifyRoot(val, { nested: true, format })}`,
        },
      );
    })();
    return format`[${prefix}${key}]\n${inner}${inner && '\n'}[]`;
  }

  if (typeof value === 'object') {
    const inner = stringifyRoot(value, { nested: true, format }) || '';
    return format`{${nested ? '.' : ''}${key}}\n${inner}${inner && '\n'}{}`;
  }

  return format`${key}: ${stringifyValue(value)}`;
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

function stringifyFreeformArray(array: FreeformObject[], { format }: Context): string {
  return array
    .map(({ type, value }, i) => {
      if (type === 'text') {
        const isLast = i === array.length - 1;
        return format`${stringifyValue(value)}${isLast ? '' : '\n'}`;
      }

      return stringifyRoot({ [type]: value }, { nested: true, format });
    })
    .join('\n');
}

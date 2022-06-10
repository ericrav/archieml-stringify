import type { ArchieMLObj } from 'archieml';
import { COMMENT, isComment } from './COMMENT';
import { escapeComment, escapeMultilineString } from './escape';

interface Options {
  nested?: boolean;
}

export function stringify(input: unknown, options: Options = {}): string {
  if (!input) return '';

  if (typeof input === 'object') {
    return Object.entries(input)
      .map(([key, value]) => stringifyKeyValue(key, value, options))
      .filter((str) => str.length > 0)
      .join('\n');
  }

  return '';
}

function stringifyKeyValue(key: string, value: unknown, { nested }: Options): string {
  if (isComment(value)) {
    return escapeComment(value);
  }

  if (!key) return '';

  if (hasWhiteSpace(key)) {
    if (value === COMMENT) return key;
    return '';
  }

  if (Array.isArray(value)) {
    let prefix = nested ? '.' : '';
    const inner = (() => {
      const firstItem = value.find((item) => !isComment(item));
      if (isSimpleValue(firstItem)) {
        return stringifyStringArray(value);
      }

      if (isFreeformArrayObject(firstItem)) {
        prefix = `${prefix}+`;
        return stringifyFreeformArray(value.filter(isFreeformArrayObject));
      }

      return stringifyComplexArray(value.filter((item) => typeof item === 'object'));
    })();
    return `[${prefix}${key}]\n${inner}${inner && '\n'}[]`;
  }

  if (typeof value === 'object') {
    const inner = stringify(value, { nested: true }) || '';
    return `{${nested ? '.' : ''}${key}}\n${inner}${inner && '\n'}{}`;
  }

  return `${key}: ${stringifyValue(value)}`;
}

function isSimpleValue(value: unknown): boolean {
  return ['string', 'boolean', 'number'].includes(typeof value);
}

function stringifyValue(value: unknown): string {
  const str = String(value);

  if (str.includes('\n')) {
    return `${escapeMultilineString(str)}\n:end`;
  }

  return str;
}

function stringifyStringArray(array: unknown[]): string {
  return array.reduce<string>((acc, val) => {
    if (isComment(val)) {
      const next = escapeComment(val);
      return acc ? `${acc}\n${next}` : next;
    }

    if (isSimpleValue(val)) {
      const next = `* ${stringifyValue(val)}`;
      return acc ? `${acc}\n${next}` : next;
    }

    return acc;
  }, '');
}

function stringifyComplexArray(array: Record<string, unknown>[]): string {
  const firstItem = array.find((item) => !isComment(item));
  const firstKey = firstItem && Object.getOwnPropertyNames(firstItem)[0];
  return array
    .reduce<string>((acc, val) => {
    if (isComment(val)) {
      const next = escapeComment(val);
      return acc ? `${acc}\n${next}` : next;
    }

    if (Object.getOwnPropertyNames(val)[0] === firstKey) {
      const next = stringify(val, { nested: true });
      return acc ? `${acc}\n\n${next}` : next;
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
    && !(hasWhiteSpace((item as FreeformObject).type))
    && (item as FreeformObject).value !== undefined
    && (item as FreeformObject).value !== null;
}

function stringifyFreeformArray(array: FreeformObject[]): string {
  return array.map(({ type, value }, i) => {
    if (type === 'text') {
      const isLast = i === array.length - 1;
      return `${value}${isLast ? '' : '\n'}`;
    }

    return stringify({ [type]: value }, { nested: true });
  }).join('\n');
}

function hasWhiteSpace(key: string) {
  return /\s/.test(key);
}

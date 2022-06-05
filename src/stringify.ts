import { COMMENT } from './COMMENT';
import { isParsableLine } from './utils';

interface Options {
  nested?: boolean;
}

export function stringify(input: any, options: Options = {}): string {
  if (!input) return '';

  if (typeof input === 'object') {
    return Object.entries(input)
      .map(([key, value]) => stringifyKeyValue(key, value, options))
      .filter((str) => str.length > 0)
      .join('\n');
  }

  return '';
}

function stringifyKeyValue(key: string, value: any, { nested }: Options): string {
  if (!key) return '';

  if (hasWhiteSpace(key)) {
    if (value === COMMENT) return key;
    return '';
  }

  if (Array.isArray(value)) {
    let prefix = nested ? '.' : '';
    const inner = (() => {
      if (isSimpleValue(value[0])) {
        return stringifyStringArray(value.filter(isSimpleValue));
      }

      if (isFreeformArrayObject(value[0])) {
        prefix = '+';
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

function isSimpleValue(value: any): boolean {
  return ['string', 'boolean', 'number'].includes(typeof value);
}

function stringifyValue(value: any): string {
  const str = String(value);

  if (str.includes('\n')) {
    return `${str}\n:end`;
  }

  return str;
}

function escapeArrayString(str: string): string {
  // eslint-disable-next-line no-param-reassign
  str = String(str);
  if (!(str.includes('\n'))) return str;
  return str
    .split('\n')
    .map((line) => (isParsableLine(line) ? `\\${line}` : line))
    .join('\n');
}

function stringifyStringArray(array: string[]): string {
  return array.map((str) => `* ${stringifyValue(escapeArrayString(str))}`).join('\n');
}

function stringifyComplexArray(array: Record<string, any>[]): string {
  const firstKey = array[0] && Object.getOwnPropertyNames(array[0])[0];
  return array
    .filter((obj) => Object.getOwnPropertyNames(obj)[0] === firstKey)
    .map((obj) => stringify(obj, { nested: true })).join('\n\n');
}

function isFreeformArrayObject(item: any): boolean {
  return typeof item === 'object'
    && typeof item.type === 'string'
    && !(hasWhiteSpace(item.type))
    && item.value !== undefined
    && item.value !== null;
}

function stringifyFreeformArray(array: { type: string; value: string }[]): string {
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

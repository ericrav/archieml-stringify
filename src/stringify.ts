import { COMMENT } from './COMMENT';

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
      const isStringArray = typeof value[0] === 'string';
      if (isStringArray) {
        return stringifyStringArray(value.filter((item) => typeof item === 'string'));
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

  return `${key}: ${value}`;
}

function stringifyStringArray(array: string[]): string {
  return array.map((str) => `* ${str}`).join('\n');
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
    && typeof item.value === 'string';
}

function stringifyFreeformArray(array: { type: string; value: string }[]): string {
  return array.map(({ type, value }) => stringify({ [type]: value })).join('\n');
}

function hasWhiteSpace(key: string) {
  return /\s/.test(key);
}

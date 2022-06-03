import { COMMENT } from './COMMENT';

export function stringify(input: any): string {
  if (!input) return '';

  if (typeof input === 'object') {
    return Object.entries(input)
      .map(([key, value]) => stringifyKeyValue(key, value))
      .filter((str) => str.length > 0)
      .join('\n');
  }

  return '';
}

function stringifyKeyValue(key: string, value: any): string {
  if (!key) return '';

  if (/\s/.test(key)) {
    if (value === COMMENT) return key;
    return '';
  }

  if (Array.isArray(value)) {
    const isStringArray = value.every((x) => typeof x === 'string');
    const inner = isStringArray ? stringifyStringArray(value) : stringify(value);
    return `[${key}]\n${inner}${inner && '\n'}[]`;
  }

  if (typeof value === 'object') {
    const inner = stringify(value) || '';
    return `{${key}}\n${inner}${inner && '\n'}{}`;
  }

  return `${key}: ${value}`;
}

function stringifyStringArray(array: string[]): string {
  return array.map((str) => `* ${str}`).join('\n');
}

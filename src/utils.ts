import type { ArchieMLObj } from 'archieml';

export function isParsableLine(line: string): boolean {
  return isCommandLine(line) || !!/^\s*(\*|\\|({.*})|(\[.*\])|(\S+:))/.exec(line);
}

export function isCommandLine(line: string): boolean {
  return !!/^\s*(:end|:skip|:ignore)/.exec(line);
}

export function hasWhiteSpace(key: string) {
  return /\s/.test(key);
}

export function getFirstKey(obj: unknown): string {
  return Object.getOwnPropertyNames(obj)[0];
}

export interface FreeformObject {
  type: string;
  value: ArchieMLObj;
}

export function isFreeformArrayObject(item: unknown): item is FreeformObject {
  return typeof item === 'object'
    && item !== null
    && typeof (item as FreeformObject).type === 'string'
    && !hasWhiteSpace((item as FreeformObject).type)
    && (item as FreeformObject).value !== undefined
    && (item as FreeformObject).value !== null;
}

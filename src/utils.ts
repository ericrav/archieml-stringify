export function isParsableLine(line: string): boolean {
  return !!/^\s*(\*|\\|:end|:skip|:ignore|({.*})|(\[.*\])|(\S+:))/.exec(line);
}

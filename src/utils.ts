export function isParsableLine(line: string): boolean {
  return !!/^\s*(\*|:end)/.exec(line);
}

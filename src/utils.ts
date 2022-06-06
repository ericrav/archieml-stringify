export function isParsableLine(line: string): boolean {
  return isCommandLine(line) || !!/^\s*(\*|\\|({.*})|(\[.*\])|(\S+:))/.exec(line);
}

export function isCommandLine(line: string): boolean {
  return !!/^\s*(:end|:skip|:ignore)/.exec(line);
}

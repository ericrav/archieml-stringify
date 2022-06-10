import { Comment } from './COMMENT';
import { isCommandLine, isParsableLine } from './utils';

function escapeLine(line: string): string {
  return `\\${line}`;
}

export function escapeMultilineString(str: string): string {
  if (!(str.includes('\n'))) { return str; }
  return str
    .split('\n')
    .map((line) => (isParsableLine(line) ? escapeLine(line) : line))
    .join('\n');
}

export function escapeComment(comment: Comment): string {
  const str = String(comment.value);

  const lines = str.split('\n');
  const parsable = lines.some((line) => isParsableLine(line));

  if (parsable && lines.length === 1) {
    return escapeLine(str);
  }

  if (parsable && lines.length > 1) {
    const block = lines
      .map((line) => (isCommandLine(line) ? escapeLine(line) : line))
      .join('\n');
    return `:skip\n${block}\n:endskip`;
  }

  return str;
}

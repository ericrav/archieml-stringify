import { isComment } from './COMMENT';
import { isFreeformArrayObject } from './utils';

interface FormatterContext {
  key?: string | number;
  value?: unknown;
  path: (string | number)[];
  parent: unknown;
}

export type Formatter = (values: string[], context: FormatterContext) => string;

export type FormatTaggedFn = (context: FormatterContext) =>(
  (strings: TemplateStringsArray, ...expressions: string[]) => string
);

function isComplexArray(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const firstItem = value.find((item) => !isComment(item));
  return typeof firstItem === 'object' && !isFreeformArrayObject(firstItem);
}

export const defaultFormat: Formatter = (strings, { parent, path }) => {
  if (isComplexArray(parent)) {
    const arrayIndex = path[path.length - 1];
    if (arrayIndex > 0) {
      return `\n${strings.join('')}`;
    }
  }
  return strings.join('');
};

export const formatTemplate = (formatter: Formatter): FormatTaggedFn => (
  (context) => (strings, ...expressions) => {
    const interleaved = strings.reduce(
      (arr, str, i) => (expressions[i] !== undefined
        ? arr.concat(str, expressions[i])
        : arr.concat(str)),
      [] as string[],
    );

    return formatter(interleaved, context);
  });

import { isFreeformArrayObject } from './utils';

interface FormatterContext {
  key?: string | number;
  value?: unknown;
  path: (string | number)[];
  parent: any;
}

export type Formatter = (values: string[], context: FormatterContext) => string;

export type FormatTaggedFn = (context: FormatterContext) =>(
  (strings: TemplateStringsArray, ...expressions: string[]) => string
);

export const defaultFormat: Formatter = (strings, { value, parent, path }) => {
  if (Array.isArray(parent) && typeof parent[0] === 'object' && !isFreeformArrayObject(parent[0])) {
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

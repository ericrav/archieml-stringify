import {
  FreeformObject, isComplexArray, isFreeformArrayObject,
} from './utils';

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

export const defaultFormat: Formatter = (strings, { parent, path, value }) => {
  if (isComplexArray(parent)) {
    const arrayIndex = path[path.length - 1];
    if (arrayIndex > 0) {
      return `\n${strings.join('')}`;
    }
  }

  if (isFreeformArrayObject(value)) {
    const arrayIndex = path[path.length - 1];
    const isLast = arrayIndex === (parent as FreeformObject[]).length - 1;
    if (value.type === 'text' && !isLast) {
      return `${strings.join('')}\n`;
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

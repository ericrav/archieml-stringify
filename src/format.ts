export type Formatter = (values: string[]) => string;

export type FormatTaggedFn = (strings: TemplateStringsArray, ...expressions: string[]) => string;

export const defaultFormat: Formatter = (values) => values.join('');

export const formatTemplate = (formatter: Formatter): FormatTaggedFn => (
  (strings, ...expressions) => {
    const interleaved = strings.reduce(
      (arr, str, i) => (expressions[i] !== undefined
        ? arr.concat(str, expressions[i])
        : arr.concat(str)),
      [] as string[],
    );

    return formatter(interleaved);
  });

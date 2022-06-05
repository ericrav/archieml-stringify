import { isParsableLine } from '../utils';

describe('isParsableLine', () => {
  const cases: [string, boolean][] = [
    ['* Array', true],
    ['*Array', true],
    ['key:', true],
    ['foobar :', false],
    [':end', true],
    [':endfoobar', true],
    [':ignore', true],
    [':skip', true],
    ['   {scope}', true],
    ['[scope]', true],
    ['\\', true],
    [':notacommand', false],
  ];

  test.each(cases)('%s', (str, isParsable) => {
    expect(isParsableLine(str)).toBe(isParsable);
  });
});

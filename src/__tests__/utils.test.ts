import { isParsableLine } from '../utils';

describe('isParsableLine', () => {
  const cases: [string, boolean][] = [
    ['* Array', true],
    ['*Array', true],
    [':endthis', true],
    [':notacommand', false],
  ];

  test.each(cases)('%s', (str, isParsable) => {
    expect(isParsableLine(str)).toBe(isParsable);
  });
});

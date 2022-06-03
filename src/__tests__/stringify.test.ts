import { stringify } from '../stringify';

const testCases: [any, string][] = [
  [{}, ''],
];

it('correctly stringifies to ArchieML', () => {
  testCases.forEach((input, aml) => expect(stringify(input)).toEqual(aml));
});

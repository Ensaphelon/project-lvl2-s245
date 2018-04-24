import path from 'path';
import { buildDifference, readFile } from '../src';

const getFixture = fileName => path.join(__dirname, '__fixtures__', fileName);

test('Flat objects', () => {
  const before = readFile(getFixture('before.json'));
  const after = readFile(getFixture('after.json'));
  const difference = buildDifference(before, after);
  expect(difference).toHaveLength(4);
});

test('Empty objects', () => {
  const before = {};
  const after = {};
  const difference = buildDifference(before, after);
  expect(difference).toHaveLength(0);
});

test('Single empty object', () => {
  const before = {};
  const after = readFile(getFixture('after.json'));
  const difference = buildDifference(before, after);
  expect(difference).toHaveLength(3);
});

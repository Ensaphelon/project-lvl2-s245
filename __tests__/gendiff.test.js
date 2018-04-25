import path from 'path';
import fs from 'fs';
import { buildDifference, readFile, printDiff } from '../src';

const getFixture = fileName => path.join(__dirname, '__fixtures__', fileName);

const compare = (before, after) => {
  const file1 = readFile(getFixture(before));
  const file2 = readFile(getFixture(after));
  const expected = fs.readFileSync(getFixture('diff.txt'), 'utf-8');
  const difference = buildDifference(file1, file2);
  expect(printDiff(difference)).toBe(expected);
};

test('Flat JSON', () => compare('before.json', 'after.json'));

test('Flat YAML', () => compare('before.yaml', 'after.yaml'));

test('Flat INI', () => compare('before.ini', 'after.ini'));

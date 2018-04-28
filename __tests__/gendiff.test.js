import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixture = fileName => path.join(__dirname, '__fixtures__', fileName);

const compare = (before, after, diff) => {
  const pathToBefore = getFixture(before);
  const pathToAfter = getFixture(after);
  const pathToDiff = getFixture(diff);
  const expected = fs.readFileSync(pathToDiff, 'utf-8');
  expect(genDiff(pathToBefore, pathToAfter)).toBe(expected);
};

test('Flat JSON', () => compare('before.json', 'after.json', 'diff.txt'));

test('Flat YAML', () => compare('before.yaml', 'after.yaml', 'diff.txt'));

test('Flat INI', () => compare('before.ini', 'after.ini', 'diff.txt'));

test('Tree JSON', () => compare('treeBefore.json', 'treeAfter.json', 'treeDiff.txt'));

test('Tree YAML', () => compare('treeBefore.yaml', 'treeAfter.yaml', 'treeDiff.txt'));

test('Tree INI', () => compare('treeBefore.ini', 'treeAfter.ini', 'treeDiff.txt'));

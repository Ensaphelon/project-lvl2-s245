import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixture = fileName => path.join(__dirname, '__fixtures__', fileName);

const compare = (before, after, diff, format = 'tree') => {
  const pathToBefore = getFixture(before);
  const pathToAfter = getFixture(after);
  const pathToDiff = getFixture(`__${format}__/${diff}.txt`);
  const expected = fs.readFileSync(pathToDiff, 'utf-8');
  expect(genDiff(pathToBefore, pathToAfter, format)).toBe(expected);
};

describe('Format: tree', () => {
  test('Flat JSON', () => compare('before.json', 'after.json', 'flat'));
  test('Flat YAML', () => compare('before.yaml', 'after.yaml', 'flat'));
  test('Flat INI', () => compare('before.ini', 'after.ini', 'flat'));
  test('Tree JSON', () => compare('treeBefore.json', 'treeAfter.json', 'tree'));
  test('Tree YAML', () => compare('treeBefore.yaml', 'treeAfter.yaml', 'tree'));
  test('Tree INI', () => compare('treeBefore.ini', 'treeAfter.ini', 'tree'));
});

describe('Format: plain', () => {
  test('Flat JSON', () => compare('before.json', 'after.json', 'flat', 'plain'));
  test('Flat YAML', () => compare('before.yaml', 'after.yaml', 'flat', 'plain'));
  test('Flat INI', () => compare('before.ini', 'after.ini', 'flat', 'plain'));
  test('Tree JSON', () => compare('treeBefore.json', 'treeAfter.json', 'tree', 'plain'));
  test('Tree YAML', () => compare('treeBefore.yaml', 'treeAfter.yaml', 'tree', 'plain'));
  test('Tree INI', () => compare('treeBefore.ini', 'treeAfter.ini', 'tree', 'plain'));
});

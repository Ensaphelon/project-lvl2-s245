import fs from 'fs';
import ini from 'ini';
import yaml from 'js-yaml';
import path from 'path';
import _ from 'lodash';
import render from './renderers';

export const getParser = ext => (filePath) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': ini.parse,
  };
  if (!parsers[ext]) {
    throw new Error(`Given format is not supported: ${ext}`);
  }
  return parsers[ext];
};

export const getParsedFile = (filePath) => {
  const ext = path.extname(filePath);
  const parse = getParser(ext)();
  return parse(fs.readFileSync(filePath, 'utf8'));
};

export const getKeys = (first, second) => _.union(_.keys(first), _.keys(second));

export const makeNode = key => (values, type) => ({ key, ...values, type });

export const buildDifference = (before, after, level = 0) => {
  const newLevel = level + 1;
  const keys = getKeys(before, after);
  const result = keys.map((key) => {
    const createNode = makeNode(key);
    if (_.has(before, key)) {
      if (_.has(after, key)) {
        if (before[key] instanceof Object && after[key] instanceof Object) {
          return createNode({ children: buildDifference(before[key], after[key], newLevel), level: newLevel }, 'inserted');
        }
        if (before[key] === after[key]) {
          return createNode({ to: before[key], level: newLevel }, 'same');
        }
        return createNode({ from: before[key], to: after[key], level: newLevel }, 'modified');
      }
      return createNode({ to: before[key], level: newLevel }, 'deleted');
    }
    return createNode({ to: after[key], level: newLevel }, 'added');
  });
  return result;
};

export default (first, second) => {
  const before = getParsedFile(first);
  const after = getParsedFile(second);
  const difference = buildDifference(before, after);
  return render(difference);
};

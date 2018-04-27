import fs from 'fs';
import ini from 'ini';
import yaml from 'js-yaml';
import path from 'path';
import _ from 'lodash';

export const getParser = ext => (filePath) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': ini.parse,
  };
  if (!parsers[ext]) {
    throw new Error(`Given format is not supported: ${ext}`);
  }
  return parsers[ext](fs.readFileSync(filePath, 'utf8'));
};

export const getParsedFile = (filePath) => {
  const ext = path.extname(filePath);
  return getParser(ext)(filePath);
};

export const getKeys = (first, second) => _.union(_.keys(first), _.keys(second));

export const makeNode = key => (values, type) => ({ key, ...values, type });

export const render = (diff) => {
  const result = diff.reduce((acc, element) => {
    switch (element.type) {
      case 'added':
        acc.push(`  + ${element.key}: ${element.value}`);
        break;
      case 'deleted':
        acc.push(`  - ${element.key}: ${element.value}`);
        break;
      case 'modified':
        acc.push(`  - ${element.key}: ${element.oldValue}\n  + ${element.key}: ${element.newValue}`);
        break;
      default:
        acc.push(`  ${element.key}: ${element.value}`);
        break;
    }
    return acc;
  }, []);
  return `{\n${result.join('\n')}\n}`;
};

export const buildDifference = (before, after) => {
  const keys = getKeys(before, after);
  const result = keys.map((key) => {
    const createNode = makeNode(key);
    if (_.has(before, key)) {
      if (_.has(after, key)) {
        if (before[key] === after[key]) {
          return createNode({ value: before[key] }, 'same');
        }
        return createNode({ oldValue: before[key], newValue: after[key] }, 'modified');
      }
      return createNode({ value: before[key] }, 'deleted');
    }
    return createNode({ value: after[key] }, 'added');
  });
  return result;
};

export default (first, second) => {
  const before = getParsedFile(first);
  const after = getParsedFile(second);
  return render(buildDifference(before, after));
};

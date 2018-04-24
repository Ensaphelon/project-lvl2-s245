import fs from 'fs';
import _ from 'lodash';

export const readFile = path => JSON.parse(fs.readFileSync(path));

export const getKeys = (first, second) => _.uniq([...Object.keys(first), ...Object.keys(second)]);

export const makeNode = key => (values, status) => ({ key, ...values, status });

export const printDiff = (diff) => {
  const result = diff.reduce((acc, element) => {
    switch (element.status) {
      case 'new':
        return `${acc}\t+ ${element.key}: ${element.value}\n`;
      case 'deleted':
        return `${acc}\t- ${element.key}: ${element.value}\n`;
      case 'modified':
        return `${acc}\t- ${element.key}: ${element.oldValue}\n\t+ ${element.key}: ${element.newValue}\n`;
      default:
        return `${acc}\t${element.key}: ${element.value}\n`;
    }
  }, '');
  return `{\n${result}}`;
};

export const buildDifference = (before, after) => {
  const keys = getKeys(before, after);
  return keys.map((key) => {
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
    return createNode({ value: after[key] }, 'new');
  });
};

export default (first, second) => {
  const before = readFile(first);
  const after = readFile(second);
  return printDiff(buildDifference(before, after));
};

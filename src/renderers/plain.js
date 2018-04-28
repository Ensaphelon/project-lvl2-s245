import fs from 'fs';

const toString = (body) => {
  if (body instanceof Object) {
    return 'complex value';
  }
  return `value: '${body}'`;
};

const renderPlain = (diff, parent = '') => {
  fs.writeFileSync('logs/difference.json', JSON.stringify(diff, null, 4));
  return diff.reduce((acc, element) => {
    const {
      key,
      to,
      from,
      children,
    } = element;

    switch (element.type) {
      case 'added':
        acc.push(`Property '${parent}${key}' was added with ${toString(to)}`);
        break;
      case 'deleted':
        acc.push(`Property '${parent}${key}' was removed`);
        break;
      case 'modified':
        acc.push(`Property '${parent}${key}' was updated. From ${toString(from)} to ${toString(to)}`);
        break;
      case 'inserted':
        acc.push(renderPlain(children, `${parent}${key}.`));
        break;
      default:
        break;
    }
    return acc;
  }, []).join('\n');
};

export default renderPlain;

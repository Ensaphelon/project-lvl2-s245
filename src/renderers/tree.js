import _ from 'lodash';

const getSpacing = level => ' '.repeat(level * 4);

const getKeyPart = (mode, level, key) => `${getSpacing(level)}  ${mode} ${key}: `;

const stringify = (body, level) => {
  if (body instanceof Object) {
    return JSON.stringify(body, null, '\t')
      .replace(/\t+/g, getSpacing(level + 1))
      .replace(/"/g, '')
      .replace(/\}/g, `${getSpacing(level)}}`);
  }
  return body;
};

const renderTree = (diff, level = 0) => {
  const result = diff.map((element) => {
    const {
      key, to, from, children,
    } = element;
    switch (element.type) {
      case 'added':
        return [`${getKeyPart('+', level, key)}${stringify(to, level + 1)}`];
      case 'deleted':
        return [`${getKeyPart('-', level, key)}${stringify(to, level + 1)}`];
      case 'modified':
        return [
          `${getKeyPart('-', level, key)}${stringify(from, level + 1)}`,
          `${getKeyPart('+', level, key)}${stringify(to, level + 1)}`,
        ];
      case 'inserted':
        return [`${getKeyPart(' ', level, key)}${renderTree(children, level + 1)}`];
      default:
        return [`${getKeyPart(' ', level, key)}${stringify(to, level + 1)}`];
    }
  }, []);
  return ['{', ..._.flatten(result), `${getSpacing(level)}}`].join('\n');
};

export default renderTree;

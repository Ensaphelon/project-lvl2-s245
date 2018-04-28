const getSpacing = level => ' '.repeat(level * 4);

const getInfo = mode => `  ${mode} `;

const getKeyPart = (mode, level, key) => {
  return `${getSpacing(level)}${getInfo(mode)}${key}: `;
}

const stringify = (body, level) => {
  if (body instanceof Object) {
    return JSON.stringify(body, null, '\t')
      .replace(/\t+/g, getSpacing(level + 1))
      .replace(/"/g, '')
      .replace(/\}/g, `${getSpacing(level)}}`);
  }
  return body;
};

const render = (diff, level = 0) => {
  const result = diff.reduce((acc, element) => {
    const { key, to, from, children } = element;
    switch (element.type) {
      case 'added':
        acc.push(`${getKeyPart('+', level, key)}${stringify(to, level + 1)}`);
        break;
      case 'deleted':
        acc.push(`${getKeyPart('-', level, key)}${stringify(to, level + 1)}`);
        break;
      case 'modified':
        acc.push(`${getKeyPart('-', level, key)}${stringify(from, level + 1)}\n${getKeyPart('+', level, key)}${stringify(to, level + 1)}`);
        break;
      case 'inserted':
        acc.push(`${getKeyPart(' ', level, key)}${render(children, level + 1)}`);
        break;
      default:
        acc.push(`${getKeyPart(' ', level, key)}${stringify(to, level + 1)}`);
        break;
    }
    return acc;
  }, []);
  return ['{', ...result, `${getSpacing(level)}}`].join('\n');
};

export default render;

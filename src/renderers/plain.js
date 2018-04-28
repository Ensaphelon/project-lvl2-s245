const toString = (body) => {
  if (body instanceof Object) {
    return 'complex value';
  }
  return `value: '${body}'`;
};

const renderPlain = (diff, parentKey = '') => diff.reduce((acc, element) => {
  const {
    key,
    to,
    from,
    children,
  } = element;

  switch (element.type) {
    case 'added':
      return [...acc, `Property '${parentKey}${key}' was added with ${toString(to)}`];
    case 'deleted':
      return [...acc, `Property '${parentKey}${key}' was removed`];
    case 'modified':
      return [...acc, `Property '${parentKey}${key}' was updated. From ${toString(from)} to ${toString(to)}`];
    case 'inserted':
      return [...acc, renderPlain(children, `${parentKey}${key}.`)];
    default:
      break;
  }
  return acc;
}, []).join('\n');

export default renderPlain;

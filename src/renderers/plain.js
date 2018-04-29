const toString = (body) => {
  if (body instanceof Object) {
    return 'complex value';
  }
  return `value: '${body}'`;
};

const renderPlain = (diff, parentKey = '') => diff
  .filter(node => node.type !== 'same')
  .map((element) => {
    const {
      key,
      to,
      from,
      children,
    } = element;

    switch (element.type) {
      case 'added':
        return `Property '${parentKey}${key}' was added with ${toString(to)}`;
      case 'deleted':
        return `Property '${parentKey}${key}' was removed`;
      case 'modified':
        return `Property '${parentKey}${key}' was updated. From ${toString(from)} to ${toString(to)}`;
      case 'inserted':
        return renderPlain(children, `${parentKey}${key}.`);
      default:
        return element;
    }
  }, []).join('\n');

export default renderPlain;

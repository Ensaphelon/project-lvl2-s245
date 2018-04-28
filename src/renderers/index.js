import renderTree from './tree';
import renderPlain from './plain';

const renderers = {
  tree: renderTree,
  plain: renderPlain,
};

export default (diff, format = 'tree') => renderers[format](diff);

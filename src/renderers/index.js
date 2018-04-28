import renderTree from './tree';
import renderPlain from './plain';
import renderJSON from './json';

const renderers = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJSON,
};

export default (diff, format = 'tree') => renderers[format](diff);

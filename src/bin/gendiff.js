#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '../';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const result = genDiff(firstConfig, secondConfig);
    console.log(result);
  })
  .parse(process.argv);

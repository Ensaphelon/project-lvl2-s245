#!/usr/bin/env node

/**
 * Module dependencies.
 */

import program from 'commander';

program
  .option('-f, --format [type]', 'Output format');

program
  .version('0.1.0')
  .parse(process.argv);

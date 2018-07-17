#!/usr/bin/env node
require('yargs')
  .commandDir('lib')
  .demandCommand()
  .help()
  .argv
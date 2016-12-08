#!/usr/bin/env node
'use strict';
const path = require('path');
const main = require('../');
const args = require('./args');
const cwd  = process.cwd();
let dir = args._||args.d||args.dir;

dir = dir ? path.join(cwd,dir) : null;
console.log(`Watch-dir: ${dir}`);
main.start(dir);

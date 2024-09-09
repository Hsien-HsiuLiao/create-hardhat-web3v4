#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Get the command from the arguments
const command = process.argv[2]; // 'init'
const language = process.argv[3]; // 'js' or 'ts'

// Define the source directory based on the specified language
let sourceDir;
if (language === 'js') {
  sourceDir = path.join(__dirname, '../template/js-template');
} else if (language === 'ts') {
  sourceDir = path.join(__dirname, '../template/ts-template');
} else {
  console.log('Unknown language. Use "js" or "ts".');
  process.exit(1);
}

if (command === 'init') {
  // Use the current working directory as the target directory
  const targetDir = process.cwd();

  // Copy the template files to the target directory
  fs.copy(sourceDir, targetDir)
    .then(() => {
      console.log(`Project initialized successfully in ${targetDir} using ${language === 'js' ? 'JavaScript' : 'TypeScript'} template.`);
    })
    .catch((err) => {
      console.error('Error initializing project:', err);
    });
} else {
  console.log('Unknown command. Use "init [js|ts]" to create a new project.');
}
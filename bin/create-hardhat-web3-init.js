#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Get the command from the arguments
const command = process.argv[2];
const targetDir = process.argv[3] || process.cwd();

// Define the source directory (your existing project structure)
const sourceDir = path.join(__dirname, '../template/ts'); // Adjust this as needed

if (command === 'init') {
  // Copy the template files to the target directory
  fs.copy(sourceDir, targetDir)
    .then(() => {
      console.log(`Project initialized successfully in ${targetDir}`);
    })
    .catch((err) => {
      console.error('Error initializing project:', err);
    });
} else {
  console.log('Unknown command. Use "init" to create a new project.');
}
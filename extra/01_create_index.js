const fs = require('fs');
const Fuse = require('fuse.js');

const dataPath = './index.json';

// Load book data from the JSON file
const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// (1) In the build step
// Create the Fuse index
const myIndex = Fuse.createIndex(['title', 'subject', 'objectid'], books);
// Serialize and save it
fs.writeFileSync('./fuse-index.json', JSON.stringify(myIndex.toJSON(), null, 2));

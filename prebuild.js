const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const currentDirectory = path.join(__dirname);
const fileName =path.join(currentDirectory,".env."+ argv.name);
const newFileName =path.join(currentDirectory , "dist", ".env");

fs.copyFileSync(fileName, newFileName, function (err) {
  if (err) throw err;
  // put logging function
});

process.exit(0);
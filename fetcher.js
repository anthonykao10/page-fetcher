const request = require('request');
const fs = require('fs');
const readline = require('readline');

const getPage = function(url, file) {
  try {
    request(url, (err, res, body) => {
      // Handle invalid domain
      if (err && err.code === 'ENOTFOUND') {
        console.log(`\nThe domain '${url}' is invalid...\n`);
        return;
      }
      // Handle invalid resource path (404)
      if (res.statusCode === 404) {
        console.log(`\nThe resource ${url} is invalid...\n`);
        return;
      }

      fs.writeFile(file, body, (err) => {
        if (err) {
          console.log(`Error trying to write to ${file}`);
          return;
        }
        console.log(`Downloaded and saved ${body.length} bytes to ./${file}`);
      });
    });
  } catch (err) {
    console.log(`\nThe url ${url} is invalid...\n`);
  }
}

const fetcher = function() {
  const [, , url, file] = process.argv;
  if (!url || !file) return;

  fs.open(file, 'wx', (err, fd) => {
    // Check if file exists
    if (err && err.code === 'EEXIST') {
      // Prompt user to overwrite or not
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(`File: '${file}' already exists. Would you like to overwrite? (y or n)\n`, (answer) => {
        if (answer === 'n') process.exit();
        if (answer === 'y') {
          getPage(url, file);
          rl.close();
        }
      });
  
    // Create file if doesn't exist
    } else {
      getPage(url, file);
    }
  });
}

fetcher();
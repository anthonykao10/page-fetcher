const request = require('request');
const fs = require('fs');
const readline = require('readline');
const [, , ...args] = process.argv;
const url = args[0];
const file = args[1];

if (!args.length) return;

fs.open(file, 'wx', (err, fd) => {
  // IF file exists
  if (err && err.code === 'EEXIST') {
    // Ask user to overwrite or not
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`File: '${file}' already exists. Would you like to overwrite? (y or n)\n`, (answer) => {
      // IF 'no', exit
      if (answer === 'n') {
        rl.close(); // unnecessary?
        process.exit();

      // IF 'yes', send request and write to file
      } else if (answer === 'y') {
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

            // Write res body to file
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

        rl.close();
      }
    });

  // IF file doesn't exist, send request and write file
  } else {
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

        // Write res body to file
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
});
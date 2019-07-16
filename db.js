const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/

/**
 * Writes a line to the log file, appending a timestamp
 * @param {string} str The string of data to be logged
 */
function log(str) {
  return fs.appendFile('log.txt', `${str}, ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
async function get(file, key) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    const obj = JSON.parse(data);
    const val = obj[key];
    if (!val) {
      return log(`Error invalid key ${key}`);
    }
    return log(val);
  } catch (err) {
    return log(`Error reading file ${file}`);
  }
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
function set(file, key, value) {
  // Open file, parse data, set object[key] to value, rewrite object to file
  return fs
    .readFile(file, 'utf-8')
    .then(data => {
      const obj = JSON.parse(data);
      if (!obj[key]) {
        return log(`Error invalid key ${key}`);
      }
      obj[key] = value;
      log(`${file} ${key} updated to ${value}`);
      return fs.writeFile(file, JSON.stringify(obj));
    })
    .catch(() => log(`Error reading file ${file}`));
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
function remove(file, key) {
  return fs
    .readFile(file, 'utf-8')
    .then(data => {
      const obj = JSON.parse(data);
      if (!obj[key]) {
        return log(`Error invalid key ${key}`);
      }
      delete obj[key];
      // console.log(JSON.stringify(obj));
      log(`Deleted key ${key} from ${file}`);
      return fs.writeFile(file, JSON.stringify(obj));
    })
    .catch(() => log(`Error reading file ${file}`));
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
async function deleteFile(file) {
  try {
    const data = await fs.unlink(file);
    if (data) {
      return log(`File ${file} does not exist`); // Idk what this does, but I think I need it
    }
    return log(`File ${file} deleted`);
  } catch (err) {
    return log(`Error deleting file ${file}`);
  }
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
async function createFile(file) {
  try {
    const localFiles = await fs.readdir('./');
    let fileExists = false;
    localFiles.forEach(filename => {
      if (filename === file) {
        fileExists = true;
      }
    });
    if (fileExists) {
      return log(`File ${file} already exists`);
    }
    log(`File ${file} created`);
    return fs.writeFile(file, JSON.stringify({}));
  } catch (err) {
    return log(`Error creating file ${file}`);
  }
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
async function mergeData() {
  // find all json files, stringify each obj, spread it into new object, write object new file
  try {
    const localFiles = await fs.readdir('./');
    const jsonFiles = localFiles.filter(
      filename => filename.includes('.json') && !filename.includes('package')
    );
    // console.log(jsonFiles);
    const objectList = jsonFiles.map(async jsonfile => {
      const data = await fs.readFile(jsonfile);
      console.log(data); // Logs nothing
      const obj = JSON.parse(data);
      return JSON.stringify(obj);
    });
    console.log(objectList);
    // const mergedString = objectList.reduce((acc, obj) => acc + obj, '');
    // console.log(mergedString);
  } catch (err) {
    return log(`Error merging json files`);
  }
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

module.exports = {
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
};

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
 * @param {Error} [err] Error
 */
async function log(str, err) {
  await fs.appendFile('log.txt', `${str}, ${Date.now()}\n`);
  if (err) throw err;
}

/**
 * Logs the value of object[key] or the entire object
 * @param {string} file
 * @param {string} key
 */
async function get(file, key = '') {
  try {
    const data = await fs.readFile(file, 'utf-8');
    const obj = JSON.parse(data);
    if (key) {
      const val = obj[key];
      if (!val) {
        return log(
          `Error invalid key ${key}`, // Error message for log.txt
          new Error(`Error invalid key "${key}"`) // Error message for controller.js
        );
      }
      log(val);
      return val;
    }
    log(JSON.stringify(obj));
    return JSON.stringify(obj);
  } catch (err) {
    return log(`Error reading file ${file}`, err);
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
      obj[key] = value;
      log(`${file} ${key} updated to ${value}`);
      return fs.writeFile(file, JSON.stringify(obj));
    })
    .catch(err => log(`Error reading file ${file}`, err));
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
        return log(
          `Error invalid key ${key}`,
          new Error(`Error invalid key "${key}"`)
        );
      }
      delete obj[key];
      // console.log(JSON.stringify(obj));
      log(`Deleted key ${key} from ${file}`);
      return fs.writeFile(file, JSON.stringify(obj));
    })
    .catch(err => log(`Error reading file ${file}`, err));
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
      return log(
        `File ${file} does not exist`,
        new Error(`Error deleting file. ${file} does not exist`)
      ); // Idk what this does, but I think I need it
    }
    return log(`File ${file} deleted`);
  } catch (err) {
    return log(`Error deleting file ${file}`, err);
  }
}

/**
 * Creates file with content inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
async function createFile(file, content) {
  try {
    const localFiles = await fs.readdir('./');
    let fileExists = false;
    localFiles.forEach(filename => {
      if (filename === file) {
        fileExists = true;
      }
    });
    if (fileExists) {
      return log(
        `File ${file} already exists`,
        new Error(`Error creating file. ${file} already exists`)
      );
    }
    log(`File ${file} created`);
    return fs.writeFile(file, JSON.stringify(content));
  } catch (err) {
    return log(`Error creating file ${file}`, err);
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
    const objectList = await Promise.all(
      jsonFiles.map(jsonfile => fs.readFile(jsonfile))
    );
    // console.log(objectList);
    const mergedString = objectList.reduce(
      (acc, obj, i) => ({
        ...acc,
        [jsonFiles[i].split('.')[0]]: JSON.parse(obj),
      }),
      {}
    );
    log('Successful merge');
    return fs.writeFile('merge.json', JSON.stringify(mergedString));
  } catch (err) {
    return log(`Error merging json files`, err);
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
async function union(fileA, fileB) {
  // readfiles
  // make list of prperties
  // log properties
  try {
    const dataA = await fs.readFile(fileA, 'utf-8');
    const dataB = await fs.readFile(fileB, 'utf-8');
    const objA = JSON.parse(dataA);
    const objB = JSON.parse(dataB);
    // console.log(objA);
    const keys = [];
    Object.keys(objA).forEach(key => {
      if (!keys.includes(key)) keys.push(key);
    });
    Object.keys(objB).forEach(key => {
      if (!keys.includes(key)) keys.push(key);
    });
    // console.log(keys);
    log(`${keys}`);
    return keys;
  } catch (err) {
    return log(`Error ${fileA} U ${fileB}`, err);
  }
}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
async function intersect(fileA, fileB) {
  try {
    const dataA = await fs.readFile(fileA);
    const dataB = await fs.readFile(fileB);
    const keysA = Object.keys(JSON.parse(dataA));
    const keysB = Object.keys(JSON.parse(dataB));
    const intersection = [];

    for (let i = 0; i < keysA.length; i++) {
      for (let j = 0; j < keysB.length; j++) {
        if (keysA[i] === keysB[j] && !intersection.includes(keysA[i])) {
          intersection.push(keysA[i]);
        }
      }
    }
    log(`${intersection}`);
    return intersection;
  } catch (err) {
    return log(`Error ${fileA} ^ ${fileB}`, err);
  }
}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
async function difference(fileA, fileB) {
  try {
    const dataA = JSON.parse(await fs.readFile(fileA));
    const dataB = JSON.parse(await fs.readFile(fileB));
    const keysA = Object.keys(dataA);
    const keysB = Object.keys(dataB);
    let diff = [];

    diff = [...keysA.filter(key => !dataB[key])];
    diff = [...diff, ...keysB.filter(key => !dataA[key])];
    log(`${diff}`);
    return diff;
  } catch (err) {
    return log(`Error ${fileA} - ${fileB}`, err);
  }
}

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

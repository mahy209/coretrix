const {
  spawn
} = require('child_process');
const fs = require('fs');

const {
  version
} = require('./package.json');

/**
 * @typedef {Object} Copy
 * @property {string} registerer - Defining key stored in the authorization server
 * @property {boolean} offline - Whether or not the application can be run offline
 * @property {string} name - Registerer name that will be displayed in the `cpanel.html`
 * @property {string} date - Registeration date
 */

/** @type {Copy[]} */
const copies = require('./copies.json');

/**
 * Exit script with exit code 1
 */
const exit = () => {
  console.error('Exiting');
  process.exit(1);
}

/**
 * Executes a command
 * @param  {string} command - Executable
 * @param  {string[]} args - Arguments passed to executable
 */
const run = (command, args) => {
  return new Promise((resolve, reject) => {
    const compiler = spawn(command, args);
    compiler.on('close', (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

/**
 * Clean previous builds
 */
const clean = async () => {
  try {
    console.log('Cleaning previous builds');
    await run('env', ['rimraf', '../dist']);
  } catch (error) {
    console.error('Failed to clean previous builds');
    exit();
  }
};

/**
 * Rewrite `build.config.json` with current copy
 * @param {Copy} copy - Copy configration
 */
const rebuildConfig = async (copy) => {
  try {
    console.log('Rebuilding `build.config.json`');
    fs.writeFileSync('build.config.json', JSON.stringify(copy));
  } catch (error) {
    console.error(`Failed to rebuild \`build.config.json\` for ${copy.registerer}`);
    exit();
  }
};

/**
 * Repalce a label in an `li` element in `cpanel.html`
 * @param  {string} data - HTML string
 * @param  {string} label - Label which value is being replace
 * @param  {string} value - New value
 * @returns {string} New replace HTML
 */
const replaceLabel = (data, label, value) => {
  const regex = new RegExp(`(?<label>${label} : )(?<content>.+)(?<ending><)`, 'gm');
  return data.replace(regex, `$<label>${value}$<ending>`);
};

/**
 * Rewrite `cpanel.html` with current copy data and version
 * @param {Copy} copy - Copy configration
 */
const rebuildHTML = async (copy) => {
  try {
    console.log('Rebuilding `cpanel.html`');
    const filename = 'views/cpanel.html';
    let cpanel = fs.readFileSync(filename).toString();
    cpanel = replaceLabel(cpanel, 'اسم المشترى', copy.name);
    cpanel = replaceLabel(cpanel, 'النسخه', version);
    cpanel = replaceLabel(cpanel, 'تاريخ التفعيل', copy.date);
    fs.writeFileSync(filename, cpanel);
  } catch (error) {
    console.error(`Failed to rebuild \`cpanel.html\` for ${copy.registerer}`);
    exit();
  }
};

/**
 * Compile `coretrix.exe`
 * @param  {Copy} copy - Copy configuration
 */
const compile = async (copy) => {
  try {
    console.log(`Compiling executable`);
    await run('env', ['pkg', '.', '--targets', 'node8-win-x86', '--no-bytecode', '--output', `../dist/${copy.registerer}/coretrix.exe`]);
  } catch (error) {
    console.error(`Failed to compile executable for ${copy.registerer}`);
    exit();
  }
};

const main = async () => {
  console.time(`Completed task in`);
  await clean();
  console.log(`Building ${copies.length} copies versioned ${version}`);
  for (const copy of copies) {
    console.log(`Building for \`${copy.registerer}\` with activation date of \`${copy.date}\``);
    await rebuildConfig(copy);
    await rebuildHTML(copy);
    await compile(copy);
  }
  console.timeEnd(`Completed task in`);
};

main();
// eval $(node build-info.js)

const join = require('path').join;
const execSync = require('child_process').execSync;

const packageJson = require(join(process.cwd(), './package.json'));

console.log(`
export REACT_APP_VERSION=${packageJson.version};
export REACT_APP_BUILD_DATE=${new Date().toISOString()};
export REACT_APP_COMMIT_HASH=${execSync('git rev-parse HEAD').toString().trim()};
`);

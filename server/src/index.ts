/* eslint-disable @typescript-eslint/no-var-requires */

/*
 * Order matters:
 * 1. sourcemap support for proper stacktraces
 * 2. loading .env
 * 3. force chalk
 */

require('source-map-support/register');
require('dotenv/config');
require('./commons/force-chalk-colors');

const { createServer } = require('./createServer');

// eslint-disable-next-line no-console
createServer().catch(console.error);

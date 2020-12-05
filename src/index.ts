import 'source-map-support/register';
import 'dotenv/config';
import './commons/force-chalk-colors';
import { server } from './server';

// eslint-disable-next-line no-console
server().catch(console.error);

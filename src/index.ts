import 'source-map-support/register';
import 'dotenv/config';
import './commons/force-chalk-colors';
import { server } from './server';

server().catch(console.error);

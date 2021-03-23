import axiosModule from 'src/commons/axios/axios';
import { ensureStackTrace } from './ensure-stack-trace';

export const axios = axiosModule.create();

ensureStackTrace(axios);

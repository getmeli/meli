import { Router } from 'express';
import { systemInfo } from './handlers/system-info';
import { systemEnv } from './handlers/system-env';

const router = Router();

router.get('/system/info', systemInfo);
router.get('/system/env', systemEnv);

export default router;

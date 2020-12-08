import { Router } from 'express';
import { systemInfo } from './handlers/system-info';

const router = Router();

router.get('/system/info', systemInfo);

export default router;

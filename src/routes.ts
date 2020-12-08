import express, { Router } from 'express';
import authRoutes from './auth/routes';
import siteRoutes from './entities/sites/routes';
import releaseRoutes from './entities/releases/routes';
import teamRoutes from './entities/teams/routes';
import orgRoutes from './entities/orgs/routes';
import userRoutes from './entities/users/routes';
import inviteRoutes from './entities/invites/routes';
import apiRoutes from './entities/api/routes';
import systemRoutes from './system/routes';
import { env } from './env';

const router = Router();

router.use(authRoutes);
router.use(siteRoutes);
router.use(releaseRoutes);
router.use(teamRoutes);
router.use(orgRoutes);
router.use(userRoutes);
router.use(inviteRoutes);
router.use(apiRoutes);
router.use(systemRoutes);

router.use('/static', express.static(env.MELI_STATIC_DIR));

export default router;

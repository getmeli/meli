import { Router } from 'express';
import authRoutes from './auth/routes';
import siteRoutes from './entities/sites/routes';
import releaseRoutes from './entities/releases/routes';
import projectRoutes from './entities/projects/routes';
import orgRoutes from './entities/orgs/routes';
import userRoutes from './entities/users/routes';
import inviteRoutes from './entities/invites/routes';
import apiRoutes from './entities/api/routes';
import memberRoutes from './entities/members/routes';
import systemRoutes from './system/routes';

const router = Router();

router.use(authRoutes);
router.use(siteRoutes);
router.use(releaseRoutes);
router.use(projectRoutes);
router.use(orgRoutes);
router.use(userRoutes);
router.use(inviteRoutes);
router.use(apiRoutes);
router.use(memberRoutes);
router.use(systemRoutes);

export default router;

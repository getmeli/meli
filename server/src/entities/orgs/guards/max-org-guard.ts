import { guard } from '../../../commons/express/guard';
import { Orgs } from '../org';
import { env } from '../../../env/env';

export const maxOrgsGuard = guard(
  async () => {
    if (env.MELI_MAX_ORGS === 0) {
      return true;
    }
    const count = await Orgs().countDocuments({}, { limit: 1 });
    return count < env.MELI_MAX_ORGS;
  },
  'Cannot create more orgs',
);

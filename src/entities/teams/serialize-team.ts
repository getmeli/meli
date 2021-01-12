import { Team } from './team';
import { env } from '../../env/env';

export function serializeTeam(team: Team) {
  return {
    _id: team._id,
    name: team.name,
    color: team.color,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    // ?id=... forces cache refresh
    logo: team.logo ? `${env.MELI_URL}/api/v1/orgs/${team._id}/logo?id=${team.logo.id}` : undefined,
  };
}

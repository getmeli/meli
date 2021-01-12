import { Team } from './team';
import { env } from '../../env/env';

export function serializeTeam(team: Team) {
  return {
    _id: team._id,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    name: team.name,
    color: team.color,
    // ?id=... forces cache refresh
    logo: team.logo ? `${env.MELI_URL}/api/v1/teams/${team._id}/logo?id=${team.logo.id}` : undefined,
  };
}

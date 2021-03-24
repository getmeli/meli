import { Team } from './team';
import { getLogoUrl } from '../../utils/get-logo-url';

export function serializeTeam(team: Team) {
  return {
    _id: team._id,
    orgId: team.orgId,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    name: team.name,
    color: team.color,
    logo: getLogoUrl('teams', team),
  };
}

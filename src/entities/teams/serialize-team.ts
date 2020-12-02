import { Team } from './team';

export function serializeTeam(team: Team) {
  return {
    _id: team._id,
    name: team.name,
    color: team.color,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}

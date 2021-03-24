import { useEffect, useState } from 'react';
import { listen } from '../../websockets/listen';
import { ReactState } from '../../commons/types/react-state';
import { useSocket } from '../../websockets/SocketProvider';
import { AppEvent } from '../../events';
import { Team } from './team';
import { useAuth } from '../../providers/AuthProvider';

export function useTeamAdded(): ReactState<Team> {
  const socket = useSocket();
  const [team, setTeam] = useState<Team>();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      return listen(socket, `user.${user._id.toString()}.${AppEvent.team_added}`, setTeam);
    }
  }, [socket, user]);
  return [team, setTeam];
}

export function useTeamDeleted(): ReactState<string> {
  const socket = useSocket();
  const { user } = useAuth();
  const [team, setTeam] = useState<string>();
  useEffect(() => {
    if (user) {
      return listen(socket, `team.${user._id.toString()}.${AppEvent.team_deleted}`, setTeam);
    }
  }, [socket, user]);
  return [team, setTeam];
}

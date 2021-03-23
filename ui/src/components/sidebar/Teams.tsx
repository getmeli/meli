import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Team } from '../teams/team';
import styles from './Teams.module.scss';
import { Bubble } from '../../commons/components/Bubble';
import { axios } from '../../providers/axios';
import { AddSite } from '../sites/AddSite';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { Sites } from './Sites';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { useRoom } from '../../websockets/use-room';
import { EventType } from '../../websockets/event-type';

function sortTeams(a: Team, b: Team) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function TeamSection({ team, className, onDelete }: { team: Team; className?; onDelete: () => void }) {
  useRoom<{ team: Team }>('team', team._id, [EventType.team_deleted], ({ team: deletedTeam }) => {
    if (team._id === deletedTeam._id) {
      onDelete();
    }
  });

  return (
    <div className={className}>
      <div className={styles.linkHeader}>
        <NavLink
          className="d-flex align-items-center"
          to={`/teams/${team._id}`}
          activeClassName={styles.active}
        >
          <Bubble color={team.color} src={team.logo}/>
          <span className="ml-2 text-uppercase">{team.name}</span>
        </NavLink>
        <div>
          <AddSite teamId={team._id}>
            <ButtonIcon>
              <FontAwesomeIcon icon={faPlus}/>
            </ButtonIcon>
          </AddSite>
        </div>
      </div>
      <Sites teamId={team._id}/>
    </div>
  );
}

export function Teams({ className }: { className? }) {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [teams, setTeams] = useState<Team[]>();
  const teamsRef = useRef<Team[]>([]);
  const { currentOrg } = useCurrentOrg();

  useRoom<{ team: Team }>('org', currentOrg.org._id, [EventType.team_added], ({ team }) => {
    if (team.orgId === currentOrg.org._id) {
      setTeams([team, ...teams]);
    }
  });

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Team[]>(`/api/v1/orgs/${currentOrg.org._id}/teams`)
      .then(({ data }) => {
        teamsRef.current = data;
        setTeams(teamsRef.current.sort(sortTeams));
      })
      .catch(setError)
      .catch(err => toast.error(`Could not list teams: ${err}`))
      .finally(() => setLoading(false));
  }, [currentOrg, setLoading]);

  const onTeamDeleted = (team: Team) => {
    setTeams(teams.filter(({ _id }) => _id !== team._id));
  };

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <div className={className}>
      {teams.length === 0 ? (
        <>
          No teams to show
        </>
      ) : (
        <>
          {teams.map(team => (
            <TeamSection
              team={team}
              key={team._id}
              onDelete={() => onTeamDeleted(team)}
              className="mb-3"
            />
          ))}
        </>
      )}
    </div>
  );
}

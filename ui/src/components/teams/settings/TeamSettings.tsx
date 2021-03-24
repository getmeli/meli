import React from 'react';
import { TeamGeneralSettings } from './TeamGeneralSettings';
import { Logo } from '../../commons/Logo';
import { useTeam } from '../TeamView';

function TeamLogo() {
  const { team, setTeam } = useTeam();
  return (
    <Logo
      context="teams"
      value={team}
      setValue={setTeam}
    />
  );
}

export function TeamSettings() {
  return (
    <>
      <TeamGeneralSettings />
      <TeamLogo />
    </>
  );
}

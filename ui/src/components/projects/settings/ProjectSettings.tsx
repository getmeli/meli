import React from 'react';
import { ProjectGeneralSettings } from './ProjectGeneralSettings';
import { Logo } from '../../commons/Logo';
import { useProject } from '../ProjectView';

function ProjectLogo() {
  const { project, setProject } = useProject();
  return (
    <Logo
      context="projects"
      value={project}
      setValue={setProject}
    />
  );
}

export function ProjectSettings() {
  return (
    <>
      <ProjectGeneralSettings />
      <ProjectLogo />
    </>
  );
}

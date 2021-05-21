import { useEffect, useState } from 'react';
import { listen } from '../../websockets/listen';
import { ReactState } from '../../commons/types/react-state';
import { useSocket } from '../../websockets/SocketProvider';
import { AppEvent } from '../../events';
import { Project } from './project';
import { useAuth } from '../../providers/AuthProvider';

export function useProjectAdded(): ReactState<Project> {
  const socket = useSocket();
  const [project, setProject] = useState<Project>();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      return listen(socket, `user.${user._id.toString()}.${AppEvent.project_added}`, setProject);
    }
  }, [socket, user]);
  return [project, setProject];
}

export function useProjectDeleted(): ReactState<string> {
  const socket = useSocket();
  const { user } = useAuth();
  const [project, setProject] = useState<string>();
  useEffect(() => {
    if (user) {
      return listen(socket, `project.${user._id.toString()}.${AppEvent.project_deleted}`, setProject);
    }
  }, [socket, user]);
  return [project, setProject];
}

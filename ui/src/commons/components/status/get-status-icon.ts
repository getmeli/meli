import {
  faBan,
  faBars,
  faCheck,
  faCog,
  faExclamationTriangle,
  faFastForward,
  faPause,
  faQuestion,
  faRocket,
  faSpinner,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export function getStatusIcon(status: string): { icon: IconDefinition; spin?: boolean } {
  switch (status) {
    case 'success':
      return {
        icon: faCheck,
      };
    case 'failure':
    case 'failed':
    case 'failing':
      return {
        icon: faTimes,
      };
    case 'partial':
      return {
        icon: faExclamationTriangle,
      };
    case 'running':
      return {
        icon: faSpinner, spin: true,
      };
    case 'created':
      return {
        icon: faBars,
      };
    case 'cancelled':
      return {
        icon: faBan,
      };
    case 'skipped':
      return {
        icon: faFastForward,
      };
    case 'unknown':
      return {
        icon: faQuestion,
      };
    case 'needs_setup':
      return {
        icon: faCog,
      };
    case 'on_hold':
      return {
        icon: faPause,
      };
    default:
      return {
        icon: faRocket,
      };
  }
}

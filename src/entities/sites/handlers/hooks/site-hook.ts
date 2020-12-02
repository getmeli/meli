import { EventType } from '../../../../events/app-event';
import {
  $hook, $hookEvent, $hookEvents,
} from '../../../../hooks/hook';

export const siteEvents = [
  EventType.site_updated,
  EventType.site_deleted,
  EventType.site_token_added,
  EventType.site_token_deleted,
  EventType.site_release_created,
  EventType.site_release_renamed,
  EventType.site_release_deleted,
  EventType.site_branch_added,
  EventType.site_branch_updated,
  EventType.site_branch_deleted,
  EventType.site_branch_release_set,
  EventType.site_branch_release_updated,
  EventType.site_branch_password_set,
  EventType.site_branch_password_removed,
];

export const $siteHhook = $hook.keys({
  events: $hookEvents.items(
    $hookEvent.valid(...siteEvents),
  ),
});

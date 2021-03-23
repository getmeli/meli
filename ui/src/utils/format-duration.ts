import moment from 'moment';

export function formatDuration(seconds, microseconds): string {
  // some random moment in time
  const start = moment('2000-01-01T00:00:00');
  const end = start
    .clone()
    .add(seconds, 'seconds')
    .add(microseconds / 1000000, 'milliseconds');
  const diff = end.diff(start);
  return moment
    .utc(diff)
    .format('HH:mm:ss');
}

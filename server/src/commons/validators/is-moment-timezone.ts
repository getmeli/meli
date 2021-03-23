import moment from 'moment-timezone';

const momentTimezones: Set<string> = new Set(moment.tz.names());

export function isMomentTimezone(tz: string) {
  if (!momentTimezones.has(tz)) {
    throw new Error('value is not a valid moment timezone');
  }
  return tz;
}

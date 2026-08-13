import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function toUtcISOString(dateStr, timeStr, tz) {
  if (!dateStr || !timeStr || !tz) return null;
  try {
    const parsed = dayjs.tz(`${dateStr}T${timeStr}`, tz);
    return parsed.isValid() ? parsed.utc().toISOString() : null;
  } catch {
    return null;
  }
}

export function fromUtcToLocalParts(utcISOString, tz) {
  if (!utcISOString || !tz) return { dateStr: '', timeStr: '' };
  try {
    const local = dayjs.utc(utcISOString).tz(tz);
    if (!local.isValid()) return { dateStr: '', timeStr: '' };
    return {
      dateStr: local.format('YYYY-MM-DD'),
      timeStr: local.format('HH:mm'),
    };
  } catch {
    return { dateStr: '', timeStr: '' };
  }
}

export function formatInTimezone(utcISOString, tz, format = 'DD MMM YYYY, hh:mm A') {
  if (!utcISOString) return '';
  try {
    const d = dayjs.utc(utcISOString).tz(tz || 'UTC');
    return d.isValid() ? d.format(format) : '';
  } catch {
    return '';
  }
}

export default dayjs;
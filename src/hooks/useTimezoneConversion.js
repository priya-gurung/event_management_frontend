import { useMemo } from 'react';
import { formatInTimezone } from '../utils/timezone';

export default function useTimezoneConversion(utcISOString, tz, format) {
  return useMemo(
    () => formatInTimezone(utcISOString, tz, format),
    [utcISOString, tz, format]
  );
}
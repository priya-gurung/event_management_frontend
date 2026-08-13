import React from 'react';
import { TIMEZONES } from '../../constants/timezones';

export default function TimezoneSelect({ value, onChange, id, className }) {
  return (
    <select id={id} className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {TIMEZONES.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  );
}

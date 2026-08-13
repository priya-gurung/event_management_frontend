import React from 'react';

export default function Loader({ label = 'Loading…' }) {
  return <p style={{ color: 'var(--color-text-muted)', padding: '12px 0' }}>{label}</p>;
}

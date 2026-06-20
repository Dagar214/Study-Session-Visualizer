import React from 'react';

export default function StatCard({ icon, label, value, sub, accent, trend }) {
  return (
    <div style={{ ...styles.card, ...(accent ? { borderColor: accent + '40', boxShadow: `0 0 24px ${accent}12` } : {}) }}>
      <div style={styles.top}>
        <div style={{ ...styles.icon, background: (accent || '#4f8ef7') + '18' }}>
          {React.cloneElement(icon, { size: 18, color: accent || '#4f8ef7' })}
        </div>
        {trend !== undefined && (
          <span style={{ ...styles.trend, color: trend >= 0 ? '#00d4aa' : '#ef4444' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}

const styles = {
  card: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  icon: {
    width: 40, height: 40, borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  trend: { fontSize: '12px', fontWeight: 600 },
  value: { fontSize: '28px', fontWeight: 700, color: '#e8edf5', lineHeight: 1.1, fontFamily: 'JetBrains Mono, monospace' },
  label: { fontSize: '13px', fontWeight: 500, color: '#7a8fa8' },
  sub: { fontSize: '12px', color: '#4a5f78', marginTop: '-4px' },
};

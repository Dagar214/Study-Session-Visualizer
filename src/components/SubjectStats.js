import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

const ProductivityBar = ({ value, color }) => (
  <div style={{ height: 6, background: '#1e2d45', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
  </div>
);

const HoursBar = ({ value, max, color }) => (
  <div style={{ height: 6, background: '#1e2d45', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
    <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
  </div>
);

export default function SubjectStats({ stats }) {
  const { subjectStats } = stats;
  const maxHours = Math.max(...subjectStats.map(s => s.hours), 1);

  const radarData = subjectStats.map(s => ({
    subject: s.name.slice(0, 4),
    hours: s.hours,
    productivity: s.avgProductivity,
    fullName: s.name,
  }));

  if (subjectStats.length === 0) {
    return (
      <div style={styles.empty}>
        <BookOpen size={40} color="#2a3f5f" />
        <p>No subject data yet. Log your first study session!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {subjectStats.map(subject => (
          <div key={subject.name} style={{ ...styles.card, borderLeftColor: subject.color }}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.dot, background: subject.color }} />
              <span style={styles.subjectName}>{subject.name}</span>
              <span style={{ ...styles.badge, background: subject.color + '22', color: subject.color }}>
                {subject.count} session{subject.count !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={styles.hours}>{subject.hours}<span style={styles.hoursUnit}>h</span></div>
            <div style={styles.sub}>{subject.minutes} minutes total</div>

            <HoursBar value={subject.hours} max={maxHours} color={subject.color} />

            <div style={styles.metaRow}>
              <div style={styles.meta}>
                <Target size={12} color="#7a8fa8" />
                <span>Avg Productivity</span>
              </div>
              <span style={{ color: subject.color, fontWeight: 600, fontSize: 13 }}>{subject.avgProductivity}%</span>
            </div>
            <ProductivityBar value={subject.avgProductivity} color={subject.color} />

            <div style={styles.metaRow}>
              <div style={styles.meta}>
                <Clock size={12} color="#7a8fa8" />
                <span>Avg session</span>
              </div>
              <span style={styles.metaVal}>{Math.round(subject.minutes / subject.count)}m</span>
            </div>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      {subjectStats.length >= 3 && (
        <div style={styles.radarCard}>
          <div style={styles.radarTitle}>Subject Balance</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e2d45" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#7a8fa8', fontSize: 12 }} />
              <Radar name="Hours" dataKey="hours" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.2} />
              <Radar name="Productivity" dataKey="productivity" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.1} />
              <Tooltip
                contentStyle={{ background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: '10px', color: '#e8edf5', fontSize: 13 }}
                formatter={(v, n) => [n === 'Hours' ? `${v}h` : `${v}%`, n]}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={styles.radarLegend}>
            <div style={styles.legendItem}><span style={{ ...styles.dot, background: '#4f8ef7' }} />Study Hours</div>
            <div style={styles.legendItem}><span style={{ ...styles.dot, background: '#00d4aa' }} />Productivity %</div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  card: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
    borderLeft: '3px solid #4f8ef7',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  subjectName: { fontSize: '14px', fontWeight: 600, color: '#e8edf5', flex: 1 },
  badge: { fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px' },
  hours: { fontSize: '32px', fontWeight: 700, color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 },
  hoursUnit: { fontSize: '18px', color: '#7a8fa8', marginLeft: '2px' },
  sub: { fontSize: '12px', color: '#4a5f78', marginTop: '-4px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' },
  meta: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#7a8fa8' },
  metaVal: { fontSize: '13px', fontWeight: 600, color: '#e8edf5' },
  radarCard: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px',
    padding: '20px',
  },
  radarTitle: { fontSize: '14px', fontWeight: 600, color: '#e8edf5', marginBottom: '8px' },
  radarLegend: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '4px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#7a8fa8' },
  empty: { textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#4a5f78' },
};

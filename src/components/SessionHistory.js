import React, { useState } from 'react';
import { Trash2, Clock, StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const SUBJECT_COLORS = {
  Mathematics: '#4f8ef7', Science: '#00d4aa', English: '#ec4899',
  History: '#f97316', Programming: '#7c5cfc', Other: '#facc15',
};

const ProductivityDot = ({ value }) => {
  const color = value >= 80 ? '#00d4aa' : value >= 60 ? '#4f8ef7' : '#f97316';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '13px', color, fontWeight: 600 }}>{value}%</span>
    </div>
  );
};

export default function SessionHistory({ sessions, onDelete }) {
  const [filter, setFilter] = useState('All');
  const [sortNewest, setSortNewest] = useState(true);
  const [expanded, setExpanded] = useState({});

  const subjects = ['All', ...Array.from(new Set(sessions.map(s => s.subject)))];

  const filtered = sessions
    .filter(s => filter === 'All' || s.subject === filter)
    .sort((a, b) => sortNewest
      ? (b.date + b.startTime).localeCompare(a.date + a.startTime)
      : (a.date + a.startTime).localeCompare(b.date + b.startTime)
    );

  // Group by date
  const grouped = {};
  filtered.forEach(s => {
    if (!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
  });
  const dates = Object.keys(grouped).sort((a, b) => sortNewest ? b.localeCompare(a) : a.localeCompare(b));

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div style={styles.container}>
      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.filterRow}>
          {subjects.map(s => (
            <button
              key={s}
              style={{ ...styles.chip, ...(filter === s ? styles.chipActive : {}) }}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button style={styles.sortBtn} onClick={() => setSortNewest(v => !v)}>
          {sortNewest ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          {sortNewest ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Timeline */}
      {dates.length === 0 ? (
        <div style={styles.empty}>No sessions found</div>
      ) : (
        <div style={styles.timeline}>
          {dates.map(date => (
            <div key={date} style={styles.dayGroup}>
              <div style={styles.dayHeader}>
                <div style={styles.dayLine} />
                <span style={styles.dayLabel}>
                  {format(parseISO(date), 'EEEE, MMMM d')}
                </span>
                <div style={styles.dayLine} />
                <span style={styles.dayCount}>{grouped[date].length} session{grouped[date].length !== 1 ? 's' : ''}</span>
              </div>
              {grouped[date].map(session => {
                const color = SUBJECT_COLORS[session.subject] || '#facc15';
                const isOpen = expanded[session.id];
                return (
                  <div key={session.id} style={{ ...styles.sessionCard, borderLeftColor: color }}>
                    <div style={styles.sessionMain} onClick={() => toggle(session.id)}>
                      <div style={styles.sessionLeft}>
                        <span style={{ ...styles.subjectTag, background: color + '20', color }}>
                          {session.subject}
                        </span>
                        <div style={styles.sessionMeta}>
                          <Clock size={12} color="#7a8fa8" />
                          <span style={styles.metaText}>{session.duration}m</span>
                          <span style={styles.metaDot}>·</span>
                          <span style={styles.metaText}>{session.startTime}</span>
                        </div>
                      </div>
                      <div style={styles.sessionRight}>
                        <ProductivityDot value={session.productivity} />
                        <button
                          style={styles.deleteBtn}
                          onClick={e => { e.stopPropagation(); onDelete(session.id); }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={styles.sessionExpanded}>
                        <div style={styles.expandGrid}>
                          <div style={styles.expandItem}>
                            <span style={styles.expandLabel}>Duration</span>
                            <span style={styles.expandVal}>{session.duration} minutes</span>
                          </div>
                          <div style={styles.expandItem}>
                            <span style={styles.expandLabel}>Productivity</span>
                            <span style={styles.expandVal}>{session.productivity}%</span>
                          </div>
                          <div style={styles.expandItem}>
                            <span style={styles.expandLabel}>Hours</span>
                            <span style={styles.expandVal}>{(session.duration / 60).toFixed(1)}h</span>
                          </div>
                          <div style={styles.expandItem}>
                            <span style={styles.expandLabel}>Start Time</span>
                            <span style={styles.expandVal}>{session.startTime}</span>
                          </div>
                        </div>
                        {session.note && (
                          <div style={styles.note}>
                            <StickyNote size={12} color="#7a8fa8" />
                            <span>{session.note}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  chip: {
    padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
    border: '1px solid #1e2d45', background: '#111827', color: '#7a8fa8', cursor: 'pointer',
  },
  chipActive: { background: 'rgba(79,142,247,0.15)', borderColor: '#4f8ef7', color: '#4f8ef7' },
  sortBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
    border: '1px solid #1e2d45', background: '#111827', color: '#7a8fa8', cursor: 'pointer',
  },
  timeline: { display: 'flex', flexDirection: 'column', gap: '20px' },
  dayGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  dayHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  dayLine: { flex: 1, height: 1, background: '#1e2d45' },
  dayLabel: { fontSize: '13px', fontWeight: 600, color: '#7a8fa8', whiteSpace: 'nowrap' },
  dayCount: { fontSize: '11px', color: '#4a5f78', whiteSpace: 'nowrap' },
  sessionCard: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '10px',
    borderLeft: '3px solid #4f8ef7', overflow: 'hidden', cursor: 'pointer',
  },
  sessionMain: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px',
  },
  sessionLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  sessionRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  subjectTag: { fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' },
  sessionMeta: { display: 'flex', alignItems: 'center', gap: '6px' },
  metaText: { fontSize: '13px', color: '#7a8fa8' },
  metaDot: { color: '#4a5f78' },
  deleteBtn: {
    background: 'none', border: 'none', color: '#4a5f78', cursor: 'pointer',
    padding: '4px', borderRadius: '6px', display: 'flex',
    transition: 'color 0.15s',
  },
  sessionExpanded: {
    padding: '0 16px 14px', borderTop: '1px solid #1e2d45', marginTop: 0,
  },
  expandGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', paddingTop: '12px' },
  expandItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  expandLabel: { fontSize: '11px', color: '#4a5f78', textTransform: 'uppercase', letterSpacing: '0.05em' },
  expandVal: { fontSize: '14px', fontWeight: 600, color: '#e8edf5' },
  note: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '13px', color: '#7a8fa8' },
  empty: { textAlign: 'center', padding: '60px', color: '#4a5f78' },
};

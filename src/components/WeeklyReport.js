import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { TrendingUp, Award, Clock, Target, Zap, BookOpen } from 'lucide-react';

const InsightCard = ({ icon, title, value, sub, color }) => (
  <div style={{ ...styles.insightCard, borderColor: color + '40' }}>
    <div style={{ ...styles.insightIcon, background: color + '18' }}>
      {React.cloneElement(icon, { size: 16, color })}
    </div>
    <div style={styles.insightValue}>{value}</div>
    <div style={styles.insightTitle}>{title}</div>
    {sub && <div style={styles.insightSub}>{sub}</div>}
  </div>
);

export default function WeeklyReport({ stats }) {
  const { dailyData, subjectStats, avgProductivity, weekHours, weekPie } = stats;

  const bestDay = [...dailyData].sort((a, b) => b.total - a.total)[0];
  const topSubject = subjectStats[0];
  const goalHours = 20;
  const goalPct = Math.min(100, Math.round((weekHours / goalHours) * 100));

  const prodLevel = avgProductivity >= 80 ? 'Excellent' : avgProductivity >= 65 ? 'Good' : avgProductivity >= 50 ? 'Fair' : 'Needs Work';
  const prodColor = avgProductivity >= 80 ? '#00d4aa' : avgProductivity >= 65 ? '#4f8ef7' : avgProductivity >= 50 ? '#facc15' : '#ef4444';

  const sessionsBySubject = subjectStats.map(s => ({
    name: s.name.slice(0, 6),
    fullName: s.name,
    hours: s.hours,
    color: s.color,
    productivity: s.avgProductivity,
  }));

  return (
    <div style={styles.container}>
      {/* Weekly Goal */}
      <div style={styles.goalCard}>
        <div style={styles.goalHeader}>
          <div>
            <div style={styles.goalTitle}>Weekly Study Goal</div>
            <div style={styles.goalSub}>Target: {goalHours} hours per week</div>
          </div>
          <div style={styles.goalPct}>{goalPct}%</div>
        </div>
        <div style={styles.goalBar}>
          <div style={{ ...styles.goalFill, width: `${goalPct}%`, background: goalPct >= 100 ? '#00d4aa' : '#4f8ef7' }} />
        </div>
        <div style={styles.goalStats}>
          <span style={{ color: '#4f8ef7', fontWeight: 600 }}>{weekHours}h completed</span>
          <span style={{ color: '#4a5f78' }}>·</span>
          <span style={{ color: '#7a8fa8' }}>{Math.max(0, goalHours - weekHours).toFixed(1)}h remaining</span>
        </div>
      </div>

      {/* Insight Cards */}
      <div style={styles.insightGrid}>
        <InsightCard
          icon={<Clock />}
          title="Total This Week"
          value={`${weekHours}h`}
          sub="study hours"
          color="#4f8ef7"
        />
        <InsightCard
          icon={<Zap />}
          title="Productivity"
          value={prodLevel}
          sub={`${avgProductivity}% average`}
          color={prodColor}
        />
        <InsightCard
          icon={<TrendingUp />}
          title="Best Day"
          value={bestDay?.day || '—'}
          sub={bestDay ? `${bestDay.total}h studied` : ''}
          color="#7c5cfc"
        />
        <InsightCard
          icon={<BookOpen />}
          title="Top Subject"
          value={topSubject?.name || '—'}
          sub={topSubject ? `${topSubject.hours}h` : ''}
          color={topSubject?.color || '#facc15'}
        />
      </div>

      {/* Subject Performance */}
      {sessionsBySubject.length > 0 && (
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Subject Performance This Week</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sessionsBySubject} barSize={36}>
              <CartesianGrid stroke="#1e2d45" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip
                contentStyle={{ background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: '10px', color: '#e8edf5', fontSize: 13 }}
                formatter={(v, n, p) => [`${v}h`, p.payload.fullName]}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {sessionsBySubject.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommendations */}
      <div style={styles.recCard}>
        <div style={styles.chartTitle}>💡 Study Insights</div>
        <div style={styles.recList}>
          {avgProductivity < 70 && (
            <div style={styles.recItem}>
              <span style={styles.recDot('#f97316')} />
              <span>Your productivity is below 70%. Try studying in shorter, focused sessions using the Pomodoro technique.</span>
            </div>
          )}
          {weekHours < 10 && (
            <div style={styles.recItem}>
              <span style={styles.recDot('#4f8ef7')} />
              <span>You've studied {weekHours}h this week. Aim for at least 2–3 hours per day to stay on track.</span>
            </div>
          )}
          {topSubject && subjectStats.length > 1 && subjectStats[subjectStats.length - 1].hours < topSubject.hours * 0.3 && (
            <div style={styles.recItem}>
              <span style={styles.recDot('#ec4899')} />
              <span>{subjectStats[subjectStats.length - 1].name} needs more attention — it's your least studied subject this period.</span>
            </div>
          )}
          {weekHours >= goalHours && (
            <div style={styles.recItem}>
              <span style={styles.recDot('#00d4aa')} />
              <span>🎉 You've hit your weekly study goal of {goalHours}h! Keep up the great work.</span>
            </div>
          )}
          {stats.streak >= 5 && (
            <div style={styles.recItem}>
              <span style={styles.recDot('#facc15')} />
              <span>🔥 Amazing! You're on a {stats.streak}-day streak. Consistency is the key to mastery.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  goalCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '24px' },
  goalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  goalTitle: { fontSize: '16px', fontWeight: 600, color: '#e8edf5' },
  goalSub: { fontSize: '13px', color: '#7a8fa8', marginTop: '2px' },
  goalPct: { fontSize: '32px', fontWeight: 700, color: '#4f8ef7', fontFamily: 'JetBrains Mono, monospace' },
  goalBar: { height: 10, background: '#1e2d45', borderRadius: 5, overflow: 'hidden', marginBottom: '10px' },
  goalFill: { height: '100%', borderRadius: 5, transition: 'width 0.6s ease' },
  goalStats: { display: 'flex', gap: '8px', fontSize: '13px' },
  insightGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  insightCard: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '16px',
    display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start',
  },
  insightIcon: { width: 36, height: 36, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' },
  insightValue: { fontSize: '20px', fontWeight: 700, color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace' },
  insightTitle: { fontSize: '12px', fontWeight: 500, color: '#7a8fa8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  insightSub: { fontSize: '12px', color: '#4a5f78' },
  chartCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '20px' },
  chartTitle: { fontSize: '14px', fontWeight: 600, color: '#e8edf5', marginBottom: '16px' },
  recCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '20px' },
  recList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  recItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#7a8fa8', lineHeight: 1.5 },
  recDot: (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: '6px' }),
};

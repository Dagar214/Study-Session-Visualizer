import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import { Clock, Zap, BookOpen, Flame, TrendingUp, Target } from 'lucide-react';
import StatCard from './StatCard';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: '10px', padding: '12px 16px' }}>
      <div style={{ fontSize: '12px', color: '#7a8fa8', marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e8edf5' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#7a8fa8' }}>{p.name}:</span>
          <strong>{p.value}h</strong>
        </div>
      ))}
    </div>
  );
};

const SUBJECT_COLORS = {
  Mathematics: '#4f8ef7', Science: '#00d4aa', English: '#ec4899',
  History: '#f97316', Programming: '#7c5cfc', Other: '#facc15',
};

export default function Dashboard({ stats }) {
  const prodColor = stats.avgProductivity >= 80 ? '#00d4aa' : stats.avgProductivity >= 60 ? '#4f8ef7' : '#f97316';

  return (
    <div style={styles.container}>
      {/* Stat Cards */}
      <div style={styles.statGrid}>
        <StatCard
          icon={<Clock />}
          label="Today's Study Time"
          value={`${stats.todayHours}h`}
          sub={`${stats.todayMinutes} minutes`}
          accent="#4f8ef7"
        />
        <StatCard
          icon={<TrendingUp />}
          label="This Week"
          value={`${stats.weekHours}h`}
          sub="weekly total"
          accent="#7c5cfc"
        />
        <StatCard
          icon={<Zap />}
          label="Avg Productivity"
          value={`${stats.avgProductivity}%`}
          sub="across all sessions"
          accent={prodColor}
        />
        <StatCard
          icon={<Flame />}
          label="Study Streak"
          value={`${stats.streak}d`}
          sub="consecutive days"
          accent="#f97316"
        />
        <StatCard
          icon={<BookOpen />}
          label="Total Hours"
          value={`${stats.totalHours}h`}
          sub="all time"
          accent="#00d4aa"
        />
        <StatCard
          icon={<Target />}
          label="Sessions Logged"
          value={stats.sessionCount}
          sub="total sessions"
          accent="#ec4899"
        />
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* Bar Chart: Daily Study Hours */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Daily Study Hours — Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.dailyData} barSize={32} barGap={4}>
              <CartesianGrid stroke="#1e2d45" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(SUBJECT_COLORS).map(([sub, color]) => (
                <Bar key={sub} dataKey={sub} stackId="a" fill={color} radius={[0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Subject Distribution */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Subject Distribution — This Week</span>
          </div>
          {stats.weekPie.length === 0 ? (
            <div style={styles.empty}>No sessions this week</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.weekPie}
                    cx="50%" cy="50%"
                    outerRadius={90}
                    labelLine={false}
                    label={renderCustomLabel}
                    dataKey="value"
                  >
                    {stats.weekPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v}h`, n]}
                    contentStyle={{ background: '#1a2235', border: '1px solid #2a3f5f', borderRadius: '10px', color: '#e8edf5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.legend}>
                {stats.weekPie.map(e => (
                  <div key={e.name} style={styles.legendItem}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ color: '#7a8fa8', fontSize: 12 }}>{e.name}</span>
                    <span style={{ color: '#e8edf5', fontSize: 12, fontWeight: 600, marginLeft: 'auto' }}>{e.value}h</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Productivity Line Chart */}
      <div style={styles.chartCardWide}>
        <div style={styles.chartHeader}>
          <span style={styles.chartTitle}>Study Hours Trend — Last 7 Days</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.dailyData}>
            <CartesianGrid stroke="#1e2d45" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#7a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="total" stroke="#4f8ef7" strokeWidth={2.5} dot={{ fill: '#4f8ef7', r: 4 }} activeDot={{ r: 6 }} name="Total" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' },
  chartCard: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '20px' },
  chartCardWide: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '20px' },
  chartHeader: { marginBottom: '16px' },
  chartTitle: { fontSize: '14px', fontWeight: 600, color: '#e8edf5' },
  legend: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  empty: { color: '#4a5f78', textAlign: 'center', padding: '40px', fontSize: '14px' },
};

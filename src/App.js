import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, History, BarChart2, Plus, BrainCircuit } from 'lucide-react';
import { useStudyData } from './hooks/useStudyData';
import Dashboard from './components/Dashboard';
import SubjectStats from './components/SubjectStats';
import SessionHistory from './components/SessionHistory';
import WeeklyReport from './components/WeeklyReport';
import AddSessionModal from './components/AddSessionModal';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'subjects', label: 'Subjects', icon: <BookOpen size={18} /> },
  { id: 'history', label: 'History', icon: <History size={18} /> },
  { id: 'report', label: 'Weekly Report', icon: <BarChart2 size={18} /> },
];

export default function App() {
  const { sessions, addSession, deleteSession, stats, activeTab, setActiveTab, SUBJECTS } = useStudyData();
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}><BrainCircuit size={22} color="#4f8ef7" /></div>
          <div>
            <div style={styles.logoName}>StudyFlow</div>
            <div style={styles.logoSub}>Session Visualizer</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              style={{ ...styles.navItem, ...(activeTab === item.id ? styles.navItemActive : {}) }}
              onClick={() => setActiveTab(item.id)}
            >
              <span style={{ opacity: activeTab === item.id ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.streakBox}>
            <div style={styles.streakNum}>{stats.streak}</div>
            <div style={styles.streakLabel}>Day Streak 🔥</div>
          </div>
          <div style={styles.quickStats}>
            <div style={styles.qStat}>
              <span style={styles.qVal}>{stats.todayHours}h</span>
              <span style={styles.qLabel}>Today</span>
            </div>
            <div style={styles.qDivider} />
            <div style={styles.qStat}>
              <span style={styles.qVal}>{stats.weekHours}h</span>
              <span style={styles.qLabel}>This Week</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
            <p style={styles.pageSub}>
              {activeTab === 'dashboard' && 'Your study performance at a glance'}
              {activeTab === 'subjects' && 'Breakdown by subject area'}
              {activeTab === 'history' && `${sessions.length} sessions logged`}
              {activeTab === 'report' && 'Weekly analysis and insights'}
            </p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Log Session
          </button>
        </header>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'dashboard' && <Dashboard stats={stats} />}
          {activeTab === 'subjects' && <SubjectStats stats={stats} />}
          {activeTab === 'history' && <SessionHistory sessions={sessions} onDelete={deleteSession} />}
          {activeTab === 'report' && <WeeklyReport stats={stats} />}
        </div>
      </main>

      {showModal && (
        <AddSessionModal
          onAdd={addSession}
          onClose={() => setShowModal(false)}
          subjects={SUBJECTS}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    display: 'flex', minHeight: '100vh', background: '#0a0e1a',
  },
  sidebar: {
    width: 240, background: '#0d1220', borderRight: '1px solid #1e2d45',
    display: 'flex', flexDirection: 'column', position: 'sticky', top: 0,
    height: '100vh', flexShrink: 0,
  },
  logo: {
    padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px',
    borderBottom: '1px solid #1e2d45',
  },
  logoIcon: {
    width: 42, height: 42, background: 'rgba(79,142,247,0.12)', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoName: { fontSize: '16px', fontWeight: 700, color: '#e8edf5' },
  logoSub: { fontSize: '11px', color: '#4a5f78', marginTop: '1px' },
  nav: { padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    borderRadius: '8px', background: 'none', border: 'none', color: '#7a8fa8',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(79,142,247,0.12)', color: '#4f8ef7',
  },
  sidebarBottom: { padding: '16px', borderTop: '1px solid #1e2d45' },
  streakBox: {
    background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: '10px', padding: '12px', textAlign: 'center', marginBottom: '12px',
  },
  streakNum: { fontSize: '28px', fontWeight: 700, color: '#f97316', fontFamily: 'JetBrains Mono, monospace' },
  streakLabel: { fontSize: '12px', color: '#7a8fa8', marginTop: '2px' },
  quickStats: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' },
  qStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  qVal: { fontSize: '16px', fontWeight: 700, color: '#e8edf5', fontFamily: 'JetBrains Mono, monospace' },
  qLabel: { fontSize: '11px', color: '#4a5f78' },
  qDivider: { width: 1, height: 30, background: '#1e2d45' },
  main: { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' },
  header: {
    padding: '28px 32px 20px', borderBottom: '1px solid #1e2d45',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#0d1220', position: 'sticky', top: 0, zIndex: 10,
  },
  pageTitle: { fontSize: '22px', fontWeight: 700, color: '#e8edf5' },
  pageSub: { fontSize: '13px', color: '#4a5f78', marginTop: '3px' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 20px', background: '#4f8ef7', border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(79,142,247,0.3)',
  },
  content: { padding: '28px 32px', flex: 1 },
};

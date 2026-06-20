import { useState, useMemo } from 'react';
import { format, subDays, startOfWeek, parseISO } from 'date-fns';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Programming', 'Other'];

const SUBJECT_COLORS = {
  Mathematics: '#4f8ef7',
  Science: '#00d4aa',
  English: '#ec4899',
  History: '#f97316',
  Programming: '#7c5cfc',
  Other: '#facc15',
};

const generateSampleData = () => {
  const sessions = [];
  const subjects = SUBJECTS;
  const now = new Date();
  let id = 1;
  for (let d = 13; d >= 0; d--) {
    const date = subDays(now, d);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = Math.floor(Math.random() * 3) + 1;
    for (let s = 0; s < count; s++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const duration = Math.floor(Math.random() * 90) + 20;
      const productivity = Math.floor(Math.random() * 40) + 60;
      sessions.push({
        id: id++,
        subject,
        duration,
        productivity,
        date: dateStr,
        note: '',
        startTime: `${String(8 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      });
    }
  }
  return sessions;
};

export function useStudyData() {
  const [sessions, setSessions] = useState(generateSampleData);
  const [activeTab, setActiveTab] = useState('dashboard');

  const addSession = (session) => {
    setSessions(prev => [
      { ...session, id: Date.now() },
      ...prev,
    ]);
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // --- Derived Stats ---
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const todaySessions = sessions.filter(s => s.date === today);
    const todayMinutes = todaySessions.reduce((a, s) => a + s.duration, 0);

    const weekSessions = sessions.filter(s => {
      try { return parseISO(s.date) >= weekStart; } catch { return false; }
    });
    const weekMinutes = weekSessions.reduce((a, s) => a + s.duration, 0);

    const totalMinutes = sessions.reduce((a, s) => a + s.duration, 0);
    const avgProductivity = sessions.length
      ? Math.round(sessions.reduce((a, s) => a + s.productivity, 0) / sessions.length)
      : 0;

    // Subject stats
    const subjectMap = {};
    sessions.forEach(s => {
      if (!subjectMap[s.subject]) subjectMap[s.subject] = { minutes: 0, count: 0, totalProd: 0 };
      subjectMap[s.subject].minutes += s.duration;
      subjectMap[s.subject].count += 1;
      subjectMap[s.subject].totalProd += s.productivity;
    });
    const subjectStats = Object.entries(subjectMap).map(([name, v]) => ({
      name,
      minutes: v.minutes,
      hours: +(v.minutes / 60).toFixed(1),
      count: v.count,
      avgProductivity: Math.round(v.totalProd / v.count),
      color: SUBJECT_COLORS[name] || '#facc15',
    })).sort((a, b) => b.minutes - a.minutes);

    // Daily chart data (last 7 days)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => s.date === dateStr);
      const bySubject = {};
      SUBJECTS.forEach(sub => { bySubject[sub] = 0; });
      daySessions.forEach(s => { bySubject[s.subject] = (bySubject[s.subject] || 0) + Math.round(s.duration / 60 * 10) / 10; });
      return {
        day: format(d, 'EEE'),
        date: dateStr,
        total: +(daySessions.reduce((a, s) => a + s.duration, 0) / 60).toFixed(1),
        ...bySubject,
      };
    });

    // Weekly subject pie
    const weekSubjectMap = {};
    weekSessions.forEach(s => {
      weekSubjectMap[s.subject] = (weekSubjectMap[s.subject] || 0) + s.duration;
    });
    const weekPie = Object.entries(weekSubjectMap).map(([name, val]) => ({
      name,
      value: Math.round(val / 60 * 10) / 10,
      color: SUBJECT_COLORS[name] || '#facc15',
    }));

    // Streak
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      if (sessions.some(s => s.date === d)) streak++;
      else break;
    }

    return {
      todayMinutes, todayHours: +(todayMinutes / 60).toFixed(1),
      weekMinutes, weekHours: +(weekMinutes / 60).toFixed(1),
      totalHours: +(totalMinutes / 60).toFixed(1),
      avgProductivity, subjectStats, dailyData, weekPie,
      streak, sessionCount: sessions.length,
    };
  }, [sessions]);

  return { sessions, addSession, deleteSession, stats, activeTab, setActiveTab, SUBJECTS, SUBJECT_COLORS };
}

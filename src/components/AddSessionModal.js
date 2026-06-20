import React, { useState } from 'react';
import { X, BookOpen, Clock, Zap, Calendar, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

export default function AddSessionModal({ onAdd, onClose, subjects }) {
  const [form, setForm] = useState({
    subject: subjects[0],
    duration: 30,
    productivity: 75,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    note: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.subject) e.subject = 'Select a subject';
    if (!form.duration || form.duration < 1) e.duration = 'Min 1 minute';
    if (!form.date) e.date = 'Select date';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({ ...form, duration: Number(form.duration), productivity: Number(form.productivity) });
    onClose();
  };

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}><BookOpen size={18} color="#4f8ef7" /></div>
            <span style={styles.title}>Log Study Session</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={styles.body}>
          {/* Subject */}
          <div style={styles.field}>
            <label style={styles.label}>Subject</label>
            <div style={styles.subjectGrid}>
              {subjects.map(s => (
                <button
                  key={s}
                  style={{ ...styles.subjectChip, ...(form.subject === s ? styles.subjectChipActive : {}) }}
                  onClick={() => set('subject', s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.subject && <span style={styles.error}>{errors.subject}</span>}
          </div>

          {/* Duration + Productivity */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}><Clock size={13} style={{ marginRight: 4 }} />Duration (mins)</label>
              <input
                type="number"
                min="1" max="480"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                style={{ ...styles.input, ...(errors.duration ? styles.inputError : {}) }}
              />
              {errors.duration && <span style={styles.error}>{errors.duration}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}><Zap size={13} style={{ marginRight: 4 }} />Productivity %</label>
              <input
                type="range" min="10" max="100" step="5"
                value={form.productivity}
                onChange={e => set('productivity', e.target.value)}
                style={styles.range}
              />
              <div style={styles.rangeVal}>{form.productivity}%</div>
            </div>
          </div>

          {/* Date + Time */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}><Calendar size={13} style={{ marginRight: 4 }} />Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                style={{ ...styles.input, ...(errors.date ? styles.inputError : {}) }}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Note */}
          <div style={styles.field}>
            <label style={styles.label}><StickyNote size={13} style={{ marginRight: 4 }} />Note (optional)</label>
            <textarea
              placeholder="What did you study?"
              value={form.note}
              onChange={e => set('note', e.target.value)}
              style={styles.textarea}
              rows={2}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.submitBtn} onClick={handleSubmit}>Log Session</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#111827', border: '1px solid #1e2d45', borderRadius: '16px',
    width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid #1e2d45',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  iconBox: {
    width: 36, height: 36, background: 'rgba(79,142,247,0.12)',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '16px', fontWeight: 600, color: '#e8edf5' },
  closeBtn: {
    background: 'none', border: 'none', color: '#7a8fa8',
    cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex',
  },
  body: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { fontSize: '12px', fontWeight: 500, color: '#7a8fa8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' },
  subjectGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  subjectChip: {
    padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
    border: '1px solid #1e2d45', background: '#1a2235', color: '#7a8fa8', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  subjectChipActive: {
    background: 'rgba(79,142,247,0.15)', borderColor: '#4f8ef7', color: '#4f8ef7',
  },
  input: {
    background: '#0a0e1a', border: '1px solid #1e2d45', borderRadius: '8px',
    color: '#e8edf5', padding: '10px 12px', fontSize: '14px', outline: 'none',
    colorScheme: 'dark',
  },
  inputError: { borderColor: '#ef4444' },
  range: { width: '100%', accentColor: '#4f8ef7', cursor: 'pointer' },
  rangeVal: {
    fontSize: '20px', fontWeight: 700, color: '#4f8ef7',
    fontFamily: 'JetBrains Mono, monospace', textAlign: 'center',
  },
  textarea: {
    background: '#0a0e1a', border: '1px solid #1e2d45', borderRadius: '8px',
    color: '#e8edf5', padding: '10px 12px', fontSize: '14px', outline: 'none',
    resize: 'none', colorScheme: 'dark',
  },
  error: { fontSize: '12px', color: '#ef4444' },
  footer: {
    display: 'flex', gap: '12px', padding: '16px 24px',
    borderTop: '1px solid #1e2d45', justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px', background: 'none', border: '1px solid #1e2d45',
    borderRadius: '8px', color: '#7a8fa8', fontSize: '14px', fontWeight: 500,
  },
  submitBtn: {
    padding: '10px 24px', background: '#4f8ef7', border: 'none',
    borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
};

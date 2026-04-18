import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ member: '', checkIn: '', checkOut: '', status: 'Present' });
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, memRes] = await Promise.all([
        axios.get('/api/attendance', { params: { date: dateFilter } }),
        axios.get('/api/members'),
      ]);
      setRecords(attRes.data);
      setMembers(memRes.data);
    } catch { toast.error('Failed to load attendance'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [dateFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member) return toast.error('Select a member');
    setSaving(true);
    try {
      const res = await axios.post('/api/attendance', form);
      setRecords([res.data, ...records]);
      setShowModal(false);
      setForm({ member: '', checkIn: '', checkOut: '', status: 'Present' });
      toast.success('Attendance marked!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error marking attendance');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`/api/attendance/${id}`);
      setRecords(records.filter(r => r._id !== id));
      toast.success('Record deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;

  return (
    <div>
      <div className="page-header">
        <h2>✅ Attendance</h2>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={() => setShowModal(true)}>+ Mark Attendance</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20}}>
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info"><h3>{records.length}</h3><p>Total Today</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info"><h3>{present}</h3><p>Present</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <div className="stat-info"><h3>{absent}</h3><p>Absent</p></div>
        </div>
      </div>

      <div className="table-controls">
        <input type="date" className="search-input" style={{flex:'none',width:'auto'}}
          value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
      </div>

      <div className="table-wrapper">
        {loading ? <div className="empty-state"><div className="spinner"></div></div>
          : records.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📅</span><p>No attendance records for this date.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div className="member-avatar-sm">{r.member?.name?.[0] || '?'}</div>
                        <div>
                          <div style={{fontWeight:600}}>{r.member?.name || 'Unknown'}</div>
                          <div style={{fontSize:12,color:'#888'}}>{r.member?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td>{r.checkIn || '—'}</td>
                    <td>{r.checkOut || '—'}</td>
                    <td>
                      <span className={`badge ${r.status === 'Present' ? 'badge-active' : 'badge-expired'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Mark Attendance</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Member *</label>
                  <select value={form.member} onChange={e => setForm({...form, member: e.target.value})} required>
                    <option value="">Choose member...</option>
                    {members.map(m => <option key={m._id} value={m._id}>{m.name} — {m.phone}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check In Time</label>
                    <input type="time" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Check Out Time</label>
                    <input type="time" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}} disabled={saving}>
                  {saving ? 'Saving...' : 'Mark Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

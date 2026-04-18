import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  experience: '',
  salary: '',
  status: 'Active'
};

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTrainer, setEditTrainer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${API}/api/trainers`);

      // ✅ FIX: handle both array and {data: []}
      const trainersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setTrainers(trainersData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrainers(); }, []);

  const openAdd = () => {
    setEditTrainer(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTrainer(t);
    setForm({
      name: t.name,
      email: t.email,
      phone: t.phone,
      specialization: t.specialization,
      experience: t.experience,
      salary: t.salary,
      status: t.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editTrainer) {
        const res = await axios.put(`${API}/api/trainers/${editTrainer._id}`, form);

        const updated = res.data?.data || res.data;

        setTrainers(prev =>
          prev.map(t => (t._id === editTrainer._id ? updated : t))
        );

        toast.success('Trainer updated!');
      } else {
        const res = await axios.post(`${API}/api/trainers`, form);

        const newTrainer = res.data?.data || res.data;

        setTrainers(prev => [newTrainer, ...prev]);

        toast.success('Trainer added!');
      }

      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving trainer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;

    try {
      await axios.delete(`${API}/api/trainers/${id}`);

      setTrainers(prev => prev.filter(t => t._id !== id));

      toast.success('Trainer deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ✅ SAFE ARRAY
  const safeTrainers = Array.isArray(trainers) ? trainers : [];

  const specializations = [
    'Weight Training', 'Cardio', 'Yoga', 'CrossFit',
    'Zumba', 'Boxing', 'Swimming', 'Pilates'
  ];

  return (
    <div>
      <div className="page-header">
        <h2>💪 Trainers ({safeTrainers.length})</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={openAdd}>
          + Add Trainer
        </button>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="empty-state"><div className="spinner"></div></div>
        ) : safeTrainers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💪</span>
            <p>No trainers yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeTrainers.map(t => (
                <tr key={t._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="member-avatar-sm">
                        {t.name?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{t.phone}</td>
                  <td>
                    <span style={{
                      background: '#f0f2f5',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {t.specialization}
                    </span>
                  </td>
                  <td>{t.experience} yrs</td>
                  <td>₹{Number(t.salary || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge badge-${t.status?.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>
                        🗑️
                      </button>
                    </div>
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
              <h3>{editTrainer ? 'Edit Trainer' : 'Add Trainer'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Specialization *</label>
                    <select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} required>
                      <option value="">Select</option>
                      {specializations.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Experience *</label>
                    <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Salary *</label>
                    <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editTrainer ? 'Update' : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

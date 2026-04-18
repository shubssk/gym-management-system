import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const emptyForm = {
  name: '', email: '', phone: '', age: '', gender: '',
  address: '', membershipPlan: '', trainer: '', status: 'Active'
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const normalize = (res) =>
    Array.isArray(res.data) ? res.data : res.data?.data || [];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const [mRes, pRes, tRes] = await Promise.all([
        axios.get(`${API}/api/members`, { params }),
        axios.get(`${API}/api/plans`),
        axios.get(`${API}/api/trainers`),
      ]);

      setMembers(normalize(mRes));
      setPlans(normalize(pRes));
      setTrainers(normalize(tRes));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [search, statusFilter]);

  const openAdd = () => {
    setEditMember(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditMember(m);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      age: m.age,
      gender: m.gender,
      address: m.address || '',
      membershipPlan: m.membershipPlan?._id || '',
      trainer: m.trainer?._id || '',
      status: m.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editMember) {
        const res = await axios.put(`${API}/api/members/${editMember._id}`, form);
        const updated = res.data?.data || res.data;

        setMembers(prev =>
          prev.map(m => (m._id === editMember._id ? updated : m))
        );

        toast.success('Member updated!');
      } else {
        const res = await axios.post(`${API}/api/members`, form);
        const created = res.data?.data || res.data;

        setMembers(prev => [created, ...prev]);

        toast.success('Member added!');
      }

      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;

    try {
      await axios.delete(`${API}/api/members/${id}`);
      setMembers(prev => prev.filter(m => m._id !== id));
      toast.success('Member deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div>
      <div className="page-header">
        <h2>👥 Members ({safeMembers.length})</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={openAdd}>
          + Add Member
        </button>
      </div>

      <div className="table-controls">
        <input
          className="search-input"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Expired</option>
        </select>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="empty-state"><div className="spinner"></div></div>
        ) : safeMembers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👤</span>
            <p>No members found. Add your first member!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Trainer</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeMembers.map(m => (
                <tr key={m._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="member-avatar-sm">{m.name?.[0] || '?'}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{m.phone}</td>
                  <td>{m.membershipPlan?.name || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td>{m.trainer?.name || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <span className={`badge badge-${m.status?.toLowerCase()}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal stays same (no logic issue there) */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editMember ? 'Edit Member' : 'Add New Member'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* (form unchanged) */}
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
                {/* rest unchanged */}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const fetchAll = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [mRes, pRes, tRes] = await Promise.all([
        axios.get('/api/members', { params }),
        axios.get('/api/plans'),
        axios.get('/api/trainers'),
      ]);
      setMembers(mRes.data);
      setPlans(pRes.data);
      setTrainers(tRes.data);
    } catch (err) {
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
      name: m.name, email: m.email, phone: m.phone, age: m.age,
      gender: m.gender, address: m.address || '',
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
        const res = await axios.put(`/api/members/${editMember._id}`, form);
        setMembers(members.map(m => m._id === editMember._id ? res.data : m));
        toast.success('Member updated!');
      } else {
        const res = await axios.post('/api/members', form);
        setMembers([res.data, ...members]);
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
      await axios.delete(`/api/members/${id}`);
      setMembers(members.filter(m => m._id !== id));
      toast.success('Member deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>👥 Members ({members.length})</h2>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={openAdd}>+ Add Member</button>
      </div>

      <div className="table-controls">
        <input className="search-input" placeholder="🔍 Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Expired</option>
        </select>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="empty-state"><div className="spinner"></div></div>
        ) : members.length === 0 ? (
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
              {members.map(m => (
                <tr key={m._id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="member-avatar-sm">{m.name[0]}</div>
                      <div>
                        <div style={{fontWeight:600}}>{m.name}</div>
                        <div style={{fontSize:12,color:'#888'}}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{m.phone}</td>
                  <td>{m.membershipPlan?.name || <span style={{color:'#ccc'}}>—</span>}</td>
                  <td>{m.trainer?.name || <span style={{color:'#ccc'}}>—</span>}</td>
                  <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span></td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>🗑️</button>
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
              <h3>{editMember ? 'Edit Member' : 'Add New Member'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Age *</label>
                    <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Expired</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Membership Plan</label>
                    <select value={form.membershipPlan} onChange={e => setForm({...form, membershipPlan: e.target.value})}>
                      <option value="">No Plan</option>
                      {plans.map(p => <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trainer</label>
                    <select value={form.trainer} onChange={e => setForm({...form, trainer: e.target.value})}>
                      <option value="">No Trainer</option>
                      {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}} disabled={saving}>
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

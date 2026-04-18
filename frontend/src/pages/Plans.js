import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const emptyForm = { name: '', duration: '', price: '', description: '', features: '', status: 'Active' };

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/plans');
      setPlans(res.data);
    } catch { toast.error('Failed to load plans'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const openAdd = () => { setEditPlan(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditPlan(p);
    setForm({ name: p.name, duration: p.duration, price: p.price, description: p.description || '', features: (p.features || []).join(', '), status: p.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, features: form.features.split(',').map(f => f.trim()).filter(Boolean) };
    try {
      if (editPlan) {
        const res = await axios.put(`/api/plans/${editPlan._id}`, payload);
        setPlans(plans.map(p => p._id === editPlan._id ? res.data : p));
        toast.success('Plan updated!');
      } else {
        const res = await axios.post('/api/plans', payload);
        setPlans([...plans, res.data]);
        toast.success('Plan added!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await axios.delete(`/api/plans/${id}`);
      setPlans(plans.filter(p => p._id !== id));
      toast.success('Plan deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const planColors = ['#e63946', '#457b9d', '#2d6a4f', '#e9c46a', '#f4a261'];

  return (
    <div>
      <div className="page-header">
        <h2>📋 Membership Plans ({plans.length})</h2>
        <button className="btn btn-primary" style={{width:'auto'}} onClick={openAdd}>+ Add Plan</button>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : plans.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📋</span><p>No plans yet.</p></div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
          {plans.map((p, i) => (
            <div key={p._id} className="card" style={{borderTop:`4px solid ${planColors[i % planColors.length]}`, position:'relative'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <h3 style={{margin:0, fontSize:18}}>{p.name}</h3>
                  <p style={{color:'#888', fontSize:13, marginTop:4}}>{p.duration} month(s)</p>
                </div>
                <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
              </div>
              <div style={{fontSize:32, fontWeight:700, color: planColors[i % planColors.length], margin:'16px 0 8px'}}>
                ₹{Number(p.price).toLocaleString('en-IN')}
              </div>
              {p.description && <p style={{fontSize:13, color:'#666', marginBottom:12}}>{p.description}</p>}
              {p.features?.length > 0 && (
                <ul style={{paddingLeft:16, fontSize:13, color:'#555', marginBottom:16}}>
                  {p.features.map((f, fi) => <li key={fi}>{f}</li>)}
                </ul>
              )}
              <div className="actions" style={{marginTop:'auto'}}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Plan Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Monthly Basic" />
                  </div>
                  <div className="form-group">
                    <label>Duration (months) *</label>
                    <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required min={1} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min={0} />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description" />
                </div>
                <div className="form-group">
                  <label>Features (comma separated)</label>
                  <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="e.g. Gym access, Locker room, 2 PT sessions" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{width:'auto'}} disabled={saving}>
                  {saving ? 'Saving...' : editPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

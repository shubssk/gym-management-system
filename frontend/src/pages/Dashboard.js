import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, expired: 0 });
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/members/stats/summary'),
      axios.get('/api/members?limit=5'),
      axios.get('/api/trainers'),
      axios.get('/api/plans'),
    ]).then(([statsRes, membersRes, trainersRes, plansRes]) => {
      setStats(statsRes.data);
      setMembers(membersRes.data.slice(0, 5));
      setTrainers(trainersRes.data.slice(0, 5));
      setPlans(plansRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const statCards = [
    { label: 'Total Members', value: stats.total, icon: '👥', color: 'blue' },
    { label: 'Active Members', value: stats.active, icon: '✅', color: 'green' },
    { label: 'Inactive', value: stats.inactive, icon: '⏸️', color: 'orange' },
    { label: 'Expired', value: stats.expired, icon: '❌', color: 'red' },
  ];

  return (
    <div>
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>👥 Recent Members</h3>
          {members.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">👤</span><p>No members yet</p></div>
          ) : console.log("DATA:", n);
            members.map(m => (
            <div key={m._id} className="member-list-item">
              <div className="member-avatar-sm">{m.name[0]}</div>
              <div className="member-list-info">
                <div className="member-list-name">{m.name}</div>
                <div className="member-list-sub">{m.email} · {m.membershipPlan?.name || 'No Plan'}</div>
              </div>
              <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>💪 Trainers</h3>
          {trainers.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🏋️</span><p>No trainers yet</p></div>
          ) : trainers.map(t => (
            <div key={t._id} className="member-list-item">
              <div className="member-avatar-sm">{t.name[0]}</div>
              <div className="member-list-info">
                <div className="member-list-name">{t.name}</div>
                <div className="member-list-sub">{t.specialization} · {t.experience} yrs exp</div>
              </div>
              <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>📋 Membership Plans</h3>
          {plans.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📋</span><p>No plans yet</p></div>
          ) : plans.map(p => (
            <div key={p._id} className="member-list-item">
              <div className="stat-icon green" style={{width:36,height:36,fontSize:16,borderRadius:8}}>📋</div>
              <div className="member-list-info">
                <div className="member-list-name">{p.name}</div>
                <div className="member-list-sub">{p.duration} month(s)</div>
              </div>
              <strong style={{color:'#e63946'}}>₹{p.price}</strong>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>📊 Quick Stats</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8f9fa',borderRadius:8}}>
              <span style={{fontSize:14}}>Total Trainers</span>
              <strong style={{fontSize:18,color:'#1a1a2e'}}>{trainers.length}</strong>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8f9fa',borderRadius:8}}>
              <span style={{fontSize:14}}>Total Plans</span>
              <strong style={{fontSize:18,color:'#1a1a2e'}}>{plans.length}</strong>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8f9fa',borderRadius:8}}>
              <span style={{fontSize:14}}>Active Rate</span>
              <strong style={{fontSize:18,color:'#2e7d32'}}>
                {stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

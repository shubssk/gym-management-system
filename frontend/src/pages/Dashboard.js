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
      axios.get(`${import.meta.env.VITE_API_URL}/api/members/stats/summary`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/members?limit=5`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/trainers`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/plans`),
    ])
      .then(([statsRes, membersRes, trainersRes, plansRes]) => {
        // ✅ FIX: handle possible object response
        setStats(statsRes.data || {});

        setMembers(
          Array.isArray(membersRes.data)
            ? membersRes.data.slice(0, 5)
            : membersRes.data?.data?.slice(0, 5) || []
        );

        setTrainers(
          Array.isArray(trainersRes.data)
            ? trainersRes.data.slice(0, 5)
            : trainersRes.data?.data?.slice(0, 5) || []
        );

        setPlans(
          Array.isArray(plansRes.data)
            ? plansRes.data
            : plansRes.data?.data || []
        );
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Members', value: stats.total, icon: '👥', color: 'blue' },
    { label: 'Active Members', value: stats.active, icon: '✅', color: 'green' },
    { label: 'Inactive', value: stats.inactive, icon: '⏸️', color: 'orange' },
    { label: 'Expired', value: stats.expired, icon: '❌', color: 'red' },
  ];

  return (
    <div>
      {/* Stats */}
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

        {/* Members */}
        <div className="card">
          <h3>👥 Recent Members</h3>
          {members.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👤</span>
              <p>No members yet</p>
            </div>
          ) : (
            members.map((m) => (
              <div key={m._id} className="member-list-item">
                <div className="member-avatar-sm">{m.name?.[0]}</div>
                <div className="member-list-info">
                  <div className="member-list-name">{m.name}</div>
                  <div className="member-list-sub">
                    {m.email} · {m.membershipPlan?.name || 'No Plan'}
                  </div>
                </div>
                <span className={`badge badge-${m.status?.toLowerCase()}`}>
                  {m.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Trainers */}
        <div className="card">
          <h3>💪 Trainers</h3>
          {trainers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🏋️</span>
              <p>No trainers yet</p>
            </div>
          ) : (
            trainers.map((t) => (
              <div key={t._id} className="member-list-item">
                <div className="member-avatar-sm">{t.name?.[0]}</div>
                <div className="member-list-info">
                  <div className="member-list-name">{t.name}</div>
                  <div className="member-list-sub">
                    {t.specialization} · {t.experience} yrs exp
                  </div>
                </div>
                <span className={`badge badge-${t.status?.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Plans */}
        <div className="card">
          <h3>📋 Membership Plans</h3>
          {plans.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No plans yet</p>
            </div>
          ) : (
            plans.map((p) => (
              <div key={p._id} className="member-list-item">
                <div className="stat-icon green" style={{ width: 36, height: 36, fontSize: 16, borderRadius: 8 }}>
                  📋
                </div>
                <div className="member-list-info">
                  <div className="member-list-name">{p.name}</div>
                  <div className="member-list-sub">{p.duration} month(s)</div>
                </div>
                <strong style={{ color: '#e63946' }}>₹{p.price}</strong>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3>📊 Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="quick-box">
              <span>Total Trainers</span>
              <strong>{trainers.length}</strong>
            </div>
            <div className="quick-box">
              <span>Total Plans</span>
              <strong>{plans.length}</strong>
            </div>
            <div className="quick-box">
              <span>Active Rate</span>
              <strong>
                {stats.total
                  ? Math.round((stats.active / stats.total) * 100)
                  : 0}%
              </strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

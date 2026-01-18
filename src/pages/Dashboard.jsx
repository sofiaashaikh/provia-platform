// src/pages/Dashboard.jsx
import { useState } from 'react';
import '../styles/landing.css';

const Dashboard = ({ proofs, onAddMore }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  // 1. Loading State: Prevents layout shift while Firebase is fetching
  if (!proofs) {
    return (
      <div className="landing-container">
        <div className="loader"></div>
        <p className="provia-subtitle">fetching your verified skills...</p>
      </div>
    );
  }

  // 2. Empty State Logic: Shows recruiters you understand the new user journey
  if (proofs.length === 0) {
    return (
      <div className="landing-container">
        <h2 style={{ color: '#1a1a1a', marginBottom: '10px' }}>you haven’t proven any skills yet.</h2>
        <p className="provia-subtitle">start with one real project to see the verification engine in action.</p>
        <button className="get-started-btn" onClick={onAddMore}>
          prove your first skill
        </button>
      </div>
    );
  }

  return (
    <div className="landing-container" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
      
      {/* 3. Visual Hierarchy: Strong Header and Subtext */}
      <div className="dashboard-header" style={{ marginBottom: '40px', width: '100%', maxWidth: '1000px' }}>
        <h1 className="provia-title" style={{ fontSize: '2.8rem' }}>your skills</h1>
        <p className="provia-subtitle" style={{ fontSize: '1.1rem', marginTop: '-10px' }}>
          proof beats claims.
        </p>

        {/* 4. Verification Transparency: Explaining the system logic */}
        <p 
          onClick={() => setShowInfo(!showInfo)} 
          style={{ 
            cursor: 'pointer', 
            textDecoration: 'underline', 
            fontSize: '0.85rem', 
            color: '#888',
            marginTop: '10px'
          }}
        >
          {showInfo ? 'hide system details' : 'how verification works'}
        </p>

        {showInfo && (
          <div style={{ 
            textAlign: 'left', 
            marginTop: '15px', 
            padding: '15px', 
            background: '#f9f9f9', 
            borderRadius: '8px', 
            maxWidth: '450px',
            margin: '15px auto',
            border: '1px solid #eee'
          }}>
            <ul style={{ fontSize: '0.85rem', color: '#444', marginLeft: '20px', lineHeight: '1.6' }}>
              <li>Verification requires: GitHub repo, commits, README, and live link.</li>
              <li>The engine scans your link for deployment markers (Vercel/Netlify).</li>
              <li>Missing signals keep a skill in "pending" status for manual review.</li>
            </ul>
          </div>
        )}
      </div>

      {/* 5. Proof Cards Grid */}
      <div className="dashboard-grid">
        {proofs.map((item, index) => (
          <div 
            key={item.id || index} 
            className="proof-card" 
            style={{ cursor: 'pointer', transition: '0.2s' }} 
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="skill-tag" style={{ fontSize: '1.2rem', fontWeight: '800' }}>{item.skill}</span>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
                <p style={{ fontSize: '10px', marginTop: '6px', color: '#999', fontWeight: '600' }}>
                  {item.status === 'verified' ? 'verified by provia' : 'awaiting signals'}
                </p>
              </div>
            </div>

            {/* 6. Engineering Logic Breakdown: Showing "Why" it was verified */}
            {expandedCard === index && item.checks && (
              <div style={{ 
                marginTop: '15px', 
                padding: '12px', 
                background: '#fafafa', 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                fontSize: '0.85rem' 
              }}>
                <p style={{ fontWeight: '700', marginBottom: '8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#666' }}>
                  Verification System Check:
                </p>
                <p style={{ color: item.checks.repoExists ? '#2e7d32' : '#d32f2f', marginBottom: '4px' }}>
                  {item.checks.repoExists ? '✓' : '✗'} repo found
                </p>
                <p style={{ color: item.checks.hasCommits ? '#2e7d32' : '#d32f2f', marginBottom: '4px' }}>
                  {item.checks.hasCommits ? '✓' : '✗'} commits detected
                </p>
                <p style={{ color: item.checks.hasReadme ? '#2e7d32' : '#d32f2f', marginBottom: '4px' }}>
                  {item.checks.hasReadme ? '✓' : '✗'} documentation present
                </p>
                <p style={{ color: item.checks.hasLiveLink ? '#2e7d32' : '#d32f2f' }}>
                  {item.checks.hasLiveLink ? '✓' : '✗'} live demo detected
                </p>
              </div>
            )}

            <p className="card-desc" style={{ marginTop: '15px', fontStyle: 'italic' }}>"{item.description}"</p>
            
            <div style={{ marginTop: '20px' }}>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card-link"
                onClick={(e) => e.stopPropagation()} 
              >
                view project ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      <button className="get-started-btn" onClick={onAddMore} style={{ marginTop: '4rem' }}>
        + add another proof
      </button>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Cpu, ShieldAlert, Layout, Server, Smartphone, Binary, ArrowLeft } from 'lucide-react';

const TECH_DOMAINS = [
  { id: 'ml', name: 'Machine Learning', icon: <Cpu size={32} strokeWidth={1.5} />, desc: 'Neural networks and predictive AI modeling.' },
  { id: 'cyber', name: 'Cybersecurity', icon: <ShieldAlert size={32} strokeWidth={1.5} />, desc: 'Network intrusion and threat detection logic.' },
  { id: 'web', name: 'Web Architecture', icon: <Layout size={32} strokeWidth={1.5} />, desc: 'High-performance React & MERN systems.' },
  { id: 'systems', name: 'System Design', icon: <Server size={32} strokeWidth={1.5} />, desc: 'Scalable backend logic and API orchestration.' },
  { id: 'mobile', name: 'Mobile Engineering', icon: <Smartphone size={32} strokeWidth={1.5} />, desc: 'Cross-platform Flutter & Dart development.' },
  { id: 'dsa', name: 'Core Algorithms', icon: <Binary size={32} strokeWidth={1.5} />, desc: 'Complex data structures and logic verification.' }
];

export default function SkillSelect({ onSelect, onCancel }) {
  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div style={{marginBottom: '50px'}}>
        <span className="label-mini">DOMAIN CLASSIFICATION</span>
        <h1 className="title-main">Select <br/><span className="outline-text">Expertise.</span></h1>
      </div>

      <div className="bento-grid">
        {TECH_DOMAINS.map((domain) => (
          <div key={domain.id} className="bento-card" onClick={() => onSelect(domain.name)}>
            <div style={{color: 'white', opacity: 0.8, marginBottom: '20px'}}>{domain.icon}</div>
            <div>
              <h3 style={{margin: '0 0 10px 0', fontWeight: 800, fontSize: '20px'}}>{domain.name}</h3>
              <p style={{margin: 0, fontSize: '13px', opacity: 0.4, lineHeight: 1.5}}>{domain.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-elite" onClick={onCancel} style={{marginTop: '40px', background: 'transparent', border: '1px solid var(--border)', color: 'white', display:'flex', alignItems:'center', gap:10}}>
        <ArrowLeft size={16}/> BACK TO DASHBOARD
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import { Edit3, Copy, Check, ExternalLink, Trash2, LogOut, Plus, Mail, Download, Linkedin, Github, Info, Globe, ShieldCheck } from 'lucide-react';
import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export default function Dashboard({ user, proofs, onAdd, onEdit, onSignOut, readOnly }) {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleDownload = () => {
    if (!user.resumeLink) return;
    const link = document.createElement("a");
    link.href = user.resumeLink;
    link.download = `${user.displayName.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/?u=${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGmail = () => {
    const email = user?.email || 'sofiafatima20@gmail.com';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Regarding your Provia Profile`;
    window.open(gmailUrl, '_blank');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'VERIFIED';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="dashboard">
      <nav className="nav-container">
        <span className="logo" onClick={() => window.location.href = window.location.origin}>provia</span>
        <div style={{display:'flex', gap: 15, alignItems:'center'}}>
          <div className="tooltip-wrap">
            <Info size={18} onClick={() => setShowInfo(!showInfo)} style={{cursor:'pointer', opacity: 0.4}} />
            <span className="tooltip">Info</span>
          </div>
          {!readOnly && (
            <div className="tooltip-wrap">
              <LogOut size={18} onClick={onSignOut} style={{ cursor: 'pointer', opacity: 0.4 }} />
              <span className="tooltip">Logout</span>
            </div>
          )}
        </div>
      </nav>

      {showInfo && (
        <div className="proof-card" style={{marginBottom: 30, border: '1px solid rgba(255,255,255,0.2)'}}>
          <p style={{fontSize: 10, fontWeight: 900, marginBottom: 10, letterSpacing: 1}}>THE PROVIA STANDARD</p>
          <p style={{fontSize: 13, opacity: 0.6, lineHeight: 1.6}}>
            Skills archived here are technically audited via GitHub API. We verify codebase architecture and logic complexity.
          </p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div className="avatar-ring">{user?.displayName?.[0]}</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 5px 0', letterSpacing: '-1.5px' }}>{user?.displayName}</h1>
        
        <div style={{display:'flex', gap: 20, justifyContent:'center', marginBottom: 20, opacity: 0.5}}>
          {user?.linkedin && (
            <div className="tooltip-wrap">
              <a href={user.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} color="white"/></a>
              <span className="tooltip">LinkedIn</span>
            </div>
          )}
          {user?.github && (
            <div className="tooltip-wrap">
              <a href={user.github} target="_blank" rel="noreferrer"><Github size={18} color="white"/></a>
              <span className="tooltip">GitHub</span>
            </div>
          )}
          <div className="tooltip-wrap">
            <Mail size={18} color="white" onClick={openGmail} style={{cursor:'pointer'}}/>
            <span className="tooltip">Email</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {!readOnly && (
            <button onClick={handleCopy} className="action-btn" style={{ width: 'auto', padding: '10px 20px', fontSize: 13 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Link Copied" : "Share"}
            </button>
          )}
          
          {user?.resumeLink && (
            <div className="tooltip-wrap">
              <button onClick={handleDownload} className="edit-trigger"><Download size={18} /></button>
              <span className="tooltip">Resume</span>
            </div>
          )}
          {!readOnly && (
            <div className="tooltip-wrap">
              <button onClick={onEdit} className="edit-trigger"><Edit3 size={18} /></button>
              <span className="tooltip">Edit</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <span style={{ fontSize: 10, fontWeight: 900, opacity: 0.3, letterSpacing: 2 }}>VERIFIED TIMELINE</span>
        {!readOnly && <Plus size={20} onClick={onAdd} style={{ cursor: 'pointer' }} />}
      </div>

      <div className="proof-list">
        {proofs.map((p) => (
          <div key={p.id} className="proof-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>{p.skill}</span>
              <div className="verified-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={10} /> VERIFIED</div>
            </div>
            <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6, marginBottom: 20 }}>{p.description}</p>
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <a href={p.link} target="_blank" rel="noreferrer" className="view-link" style={{marginTop:0}}><Globe size={14} /> Live Demo</a>
              {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="view-link" style={{marginTop:0, background:'transparent', border:'1px solid rgba(255,255,255,0.1)'}}><Github size={14} /> Source</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
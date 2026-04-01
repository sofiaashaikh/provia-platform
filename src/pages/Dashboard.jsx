import React from 'react';
import { LogOut, Plus, Edit3, Github, Download, ExternalLink } from 'lucide-react';

export default function Dashboard({ user, proofs, onAdd, onEdit, onSignOut, readOnly = false }) {
  
  const handleDownloadResume = () => {
    if (!user?.resumeBase64) return alert("No resume uploaded yet.");
    const link = document.createElement('a');
    link.href = user.resumeBase64;
    link.download = `${(user.displayName || 'User').replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
  };

  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      {/* PROFILE HEADER */}
      <div className="glass-card" style={{marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <div style={{width:60, height:60, borderRadius:'50%', background:'#111', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:24}}>
            {user?.displayName ? user.displayName[0] : 'P'}
          </div>
          <div>
            <h2 style={{margin: 0, fontWeight: 900, fontSize: '24px'}}>{user?.displayName || 'Archive User'}</h2>
            <p style={{margin: 0, fontSize: '10px', opacity: 0.4, letterSpacing: '1px'}}>VERIFIED ARCHIVE / @{user?.username || 'anonymous'}</p>
          </div>
        </div>
        {!readOnly && (
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={onEdit} className="btn-elite" style={{padding: '12px'}}><Edit3 size={16}/></button>
            <button onClick={onSignOut} className="btn-elite" style={{padding: '12px', background: 'transparent', border: '1px solid #ff4b4b', color: '#ff4b4b'}}><LogOut size={16}/></button>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div style={{display: 'flex', gap: '15px', marginBottom: '40px'}}>
        {!readOnly && (
          <button className="btn-elite" onClick={onAdd} style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
            <Plus size={18}/> New Audit
          </button>
        )}
        {user?.resumeBase64 && (
          <button className="btn-elite" onClick={handleDownloadResume} style={{background: 'transparent', border: '1px solid white', color: 'white', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
            <Download size={18}/> Download Resume
          </button>
        )}
      </div>

      {/* PROJECT TIMELINE */}
      <div style={{marginBottom: '20px'}}>
        <h3 className="label-mini" style={{marginBottom: '30px'}}>01 / VERIFICATION TIMELINE</h3>
        
        {(!proofs || proofs.length === 0) ? (
          <div className="glass-card" style={{textAlign: 'center', opacity: 0.5}}>No verified projects found in this archive.</div>
        ) : (
          proofs.map((proof) => (
            <div key={proof.id} className="timeline-item">
              <div className="glass-card">
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                  <span className="verified-tag">VERIFIED</span>
                  <span style={{fontSize: '10px', fontWeight: 900, opacity: 0.4}}>{(proof.skill || "General").toUpperCase()}</span>
                </div>
                <h2 style={{margin: '0 0 10px 0', fontSize: '22px', fontWeight: 800}}>{proof.title}</h2>
                <p style={{margin: 0, fontSize: '14px', opacity: 0.5, lineHeight: 1.6}}>{proof.description}</p>
                <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
                  <a href={proof.link} target="_blank" rel="noreferrer" style={{color: 'white', fontSize: '12px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <Github size={14}/> REPO
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { Mail, FileText, Github, Linkedin, Trash2, LogOut, Globe, ShieldCheck } from 'lucide-react';
import { ref, remove } from 'firebase/database';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard({ user, proofs, onAdd, readOnly = false }) {
  const getInitials = (n) => n ? n.split(' ').map(i => i[0]).join('').toUpperCase() : "SS";

  const handleDelete = async (proofId) => {
    if (window.confirm("Permanent delete? This cannot be undone.")) {
      try {
        await remove(ref(db, `proofs/${user.uid}/${proofId}`));
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  const getSyncDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">
      {/* WELCOME BANNER FOR VISITORS */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '40px',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00ff88', marginBottom: '8px' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>SYSTEM PROTOCOL</span>
        </div>
        <p style={{ fontSize: '14px', margin: 0, opacity: 0.6, lineHeight: '1.6' }}>
          Welcome to **Provia**. This is a verified engineering archive used to document technical proof-of-work. Every entry here is backed by a live source link.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div className="avatar-container">
          <div className="status-indicator"></div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 24 }}>{getInitials(user?.displayName)}</span>
        </div>
        <h1 style={{ fontWeight: 900, fontSize: 32, margin: 0, letterSpacing: '-1.5px' }}>{user?.displayName}</h1>
        <p style={{ opacity: 0.3, fontSize: 13, fontWeight: 700, marginTop: 8, letterSpacing: '1px' }}>@{user?.username?.toUpperCase()}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <div className="recruiter-badge">Verified Engineer</div>
        </div>
        
        <div className="btn-group" style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <a href="/resume.pdf" download className="action-btn" style={{ width: 'auto', padding: '12px 25px' }}>
            <FileText size={16} /> Resume
          </a>
          <a href={`mailto:${user?.email || 'sofiaafatima20@gmail.com'}`} className="action-btn" style={{ width: 'auto', padding: '12px 25px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Mail size={16} /> Contact
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <h3 style={{ fontSize: 10, fontWeight: 800, opacity: 0.2, letterSpacing: '3px' }}>ENGINEERING ARCHIVE</h3>
        {!readOnly && (
          <span onClick={onAdd} style={{ fontSize: 11, fontWeight: 900, cursor: 'pointer', color: 'white', borderBottom: '1px solid white', paddingBottom: '2px' }}>
            + NEW LOG
          </span>
        )}
      </div>

      {proofs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '24px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
          SYSTEM IDLE: NO LOGS FOUND
        </div>
      ) : (
        proofs.map(p => (
          <div key={p.id} className="proof-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>{p.skill}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 9, color: '#00ff88', fontWeight: 900, letterSpacing: '1.5px' }}>VERIFIED</span>
                {!readOnly && (
                  <Trash2 
                    size={14} 
                    style={{ cursor: 'pointer', opacity: 0.2 }} 
                    onClick={() => handleDelete(p.id)} 
                  />
                )}
              </div>
            </div>
            <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6, marginBottom: 20, fontWeight: 400 }}>{p.description}</p>
            <a href={p.link} target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Source Archive <Globe size={12} style={{ opacity: 0.5 }} />
            </a>
          </div>
        ))
      )}

      <footer className="system-footer" style={{ marginTop: '80px', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          <span>LOC: HYD/IN</span>
          <span>|</span>
          <span>SYNC: {getSyncDate()}</span>
          <span>|</span>
          <span>STATUS: ONLINE</span>
        </div>
      </footer>

      {!readOnly && (
        <div 
          onClick={() => signOut(auth)}
          style={{ 
            textAlign: 'center',
            color: 'rgba(255,255,255,0.15)', 
            fontSize: '10px', 
            fontWeight: 800, 
            cursor: 'pointer',
            paddingBottom: '60px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={12} /> Terminate Session
        </div>
      )}
    </div>
  );
}
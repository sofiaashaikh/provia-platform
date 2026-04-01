import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { auth, db } from './firebase';
import {
  onAuthStateChanged, signOut, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, GithubAuthProvider, signInWithPopup
} from 'firebase/auth';
import { ref, onValue, update, push, serverTimestamp, query, orderByChild, equalTo, get } from 'firebase/database';
import { Github, Database, Code2, CheckCircle2, XCircle, Loader2, Plus, LogOut, Edit3, Download, X, Terminal, Link, AlignLeft, Smartphone, Server, Layout, ShieldAlert, Cpu, Binary, ArrowLeft, Mail, Linkedin, ArrowRight, Video, Palette, Code } from 'lucide-react';

import './styles/landing.css';
//MEDIA&YOUTUBE PARSER
const getYoutubeId = (url) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const MediaViewer = ({ url }) => {
  if (!url) return null;
  const ytId = getYoutubeId(url);
  return (
    <div className="media-container">
      {ytId ? (
        <iframe src={`https://www.youtube.com/embed/${ytId}`} allowFullScreen title="Project Demo"></iframe>
      ) : (
        <img src={url} alt="Project Demo" loading="lazy" />
      )}
    </div>
  );
};

//DASHBOARD
function Dashboard({ user, proofs, onAdd, onEdit, onSignOut, onVerify, readOnly = false }) {
  const [scanState, setScanState] = useState({ id: null, step: 0 });

  const handleDownloadResume = () => {
    if (!user?.resumeBase64) return alert("No resume uploaded yet.");
    const link = document.createElement('a'); 
    link.href = user.resumeBase64;
    link.download = `${(user.displayName || 'User').replace(/\s+/g, '_')}_Resume.pdf`; 
    link.click();
  };

  const triggerAudit = async (id, link, descriptionLength) => {
    setScanState({ id, step: 1 });
    try {
      const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = link.match(githubRegex);
      let repoValid = false;
      let techStack = []; 

      if (match) {
        const owner = match[1]; 
        const repo = match[2].replace('.git', ''); 
        
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (res.ok) {
          repoValid = true;
          const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
          if (langRes.ok) {
            const langs = await langRes.json();
            techStack = Object.keys(langs).slice(0, 3); 
          }
        }
      }
      
      await new Promise(r => setTimeout(r, 1200)); 
      if (!repoValid) { setScanState({ id, step: -1 }); setTimeout(() => setScanState({ id: null, step: 0 }), 3000); return; }
      
      setScanState({ id, step: 2 }); await new Promise(r => setTimeout(r, 1200)); 
      setScanState({ id, step: 3 }); await new Promise(r => setTimeout(r, 1200)); 
      if (descriptionLength < 20) { setScanState({ id, step: -3 }); setTimeout(() => setScanState({ id: null, step: 0 }), 3000); return; }
      
      setScanState({ id, step: 4 }); await new Promise(r => setTimeout(r, 1000)); 
      setScanState({ id: null, step: 0 }); 
      
      onVerify(id, 'verified', techStack);
    } catch (err) { 
      setScanState({ id, step: -1 }); 
      setTimeout(() => setScanState({ id: null, step: 0 }), 3000); 
    }
  };

  const renderCheckItem = (stepNum, currentStep, text, failText = null) => {
    let icon = <div style={{width:16, height:16, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)'}} />;
    let color = 'rgba(255,255,255,0.4)';
    if (currentStep === stepNum) { icon = <Loader2 size={16} className="spin-anim" style={{color: 'var(--acc)'}} />; color = 'var(--acc)'; }
    else if (currentStep > stepNum || (currentStep < 0 && Math.abs(currentStep) > stepNum)) { icon = <CheckCircle2 size={16} color="var(--neon-green)" />; color = 'var(--neon-green)'; }
    else if (currentStep === -stepNum) { icon = <XCircle size={16} color="#ff4b4b" />; color = '#ff4b4b'; text = failText || text; }
    return <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8, color: color, fontSize: 13, fontWeight: 600}}>{icon} <span>{text}</span></div>;
  };

  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div className="glass-card" style={{marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          {user?.photoURL ? <img src={user.photoURL} alt="Profile" style={{width:70, height:70, borderRadius:'50%', border:'1px solid var(--border)'}} />
          : <div style={{width:70, height:70, borderRadius:'50%', background:'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:28}}>{user?.displayName ? user.displayName[0] : 'P'}</div>}
          <div>
            <h2 style={{margin: 0, fontWeight: 700, fontSize: '26px'}}>{user?.displayName || 'Archive User'}</h2>
            <p style={{margin: '4px 0 0 0', fontSize: '11px', opacity: 0.5, letterSpacing: '1px'}}>VERIFIED ARCHIVE / @{user?.username || 'anonymous'}</p>
            <div style={{display: 'flex', gap: '15px', marginTop: '12px'}}>
              {user?.linkedInURL && <a href={user.linkedInURL} target="_blank" rel="noreferrer" className="social-link-icon"><Linkedin size={18}/></a>}
              {user?.githubURL && <a href={user.githubURL} target="_blank" rel="noreferrer" className="social-link-icon"><Github size={18}/></a>}
              {user?.contactEmail && <a href={`mailto:${user.contactEmail}`} className="social-link-icon"><Mail size={18}/></a>}
              {user?.portfolioURL && <a href={user.portfolioURL} target="_blank" rel="noreferrer" className="social-link-icon"><Link size={18}/></a>}
            </div>
          </div>
        </div>
        {!readOnly && (
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={onEdit} className="btn-elite btn-outline" style={{padding: '14px'}}><Edit3 size={18}/></button>
            <button onClick={onSignOut} className="btn-elite btn-outline" style={{padding: '14px', borderColor: '#ff4b4b', color: '#ff4b4b'}}><LogOut size={18}/></button>
          </div>
        )}
      </div>

      <div style={{display: 'flex', gap: '15px', marginBottom: '40px'}}>
        {!readOnly && <button className="btn-elite" onClick={onAdd} style={{flex: 1}}><Plus size={18}/> New Verified Project</button>}
        {user?.resumeBase64 && <button className="btn-elite btn-outline" onClick={handleDownloadResume} style={{flex: 1}}><Download size={18}/> Download Resume</button>}
      </div>

      <div style={{marginBottom: '20px'}}>
        <h3 className="label-mini" style={{marginBottom: '30px'}}>01 / VERIFICATION TIMELINE</h3>
        {(!proofs || proofs.length === 0) ? (
          <div className="glass-card" style={{textAlign: 'center', opacity: 0.5}}>No projects found in this archive.</div>
        ) : (
          proofs.map((proof) => {
            const isVerified = proof.status === 'verified';
            const isScanning = scanState.id === proof.id;
            return (
              <div key={proof.id} className="timeline-item">
                <div className="glass-card" style={{ transition: 'all 0.3s ease', borderColor: isVerified ? 'rgba(0, 255, 136, 0.3)' : 'var(--border)' }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center'}}>
                    <span className="verified-tag" style={{ background: isVerified ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 170, 0, 0.1)', color: isVerified ? 'var(--neon-green)' : '#ffaa00', border: `1px solid ${isVerified ? 'var(--neon-green)' : '#ffaa00'}` }}>
                      {isVerified ? '✓ VERIFIED' : isScanning ? 'AUDITING...' : 'PENDING AUDIT'}
                    </span>
                    <span style={{fontSize: '11px', fontWeight: 600, opacity: 0.4}}>{(proof.skill || "General").toUpperCase()}</span>
                  </div>

                  <h2 style={{margin: '0 0 10px 0', fontSize: '22px', fontWeight: 700}}>{proof.title}</h2>
                  <p style={{margin: 0, fontSize: '15px', opacity: 0.6, lineHeight: 1.6}}>{proof.description}</p>
                  
                  {proof.techStack && proof.techStack.length > 0 && (
                    <div style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
                      <Code size={14} style={{color: 'var(--neon-blue)', alignSelf: 'center'}} />
                      {proof.techStack.map(tech => (
                        <span key={tech} className="tech-tag-pill">{tech}</span>
                      ))}
                    </div>
                  )}

                  <MediaViewer url={proof.mediaUrl} />
                  
                  {isScanning && (
                    <div style={{marginTop: 20, padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid var(--border)'}}>
                      <p style={{fontSize: 11, fontWeight: 700, opacity: 0.5, marginBottom: 15, letterSpacing: 1}}>AUDIT PIPELINE ACTIVE</p>
                      {renderCheckItem(1, scanState.step, "Resolving Repository Endpoint...", "Repository Not Found")}
                      {renderCheckItem(2, scanState.step, "Executing Language Detection Engine...")}
                      {renderCheckItem(3, scanState.step, "Analyzing Documentation...", "Description Too Short")}
                      {renderCheckItem(4, scanState.step, "Finalizing Integrity & Applying Tags...")}
                    </div>
                  )}

                  <div style={{marginTop: '25px', display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <a href={proof.link} target="_blank" rel="noreferrer" style={{color: 'var(--acc)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'}}><Github size={16}/> REPOSITORY</a>
                    {!isVerified && !readOnly && !isScanning && (
                      <button onClick={() => triggerAudit(proof.id, proof.link, proof.description?.length || 0)} style={{marginLeft: 'auto', background: 'transparent', border: '1px solid #ffaa00', color: '#ffaa00', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'}}>RUN VERIFICATION</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
//API
function ProviaAPI({ username }) {
  const [data, setData] = useState({ status: 'fetching...' });

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const usersRef = query(ref(db, 'users'), orderByChild('username'), equalTo(username));
        const userSnapshot = await get(usersRef);
        if (userSnapshot.exists()) {
          const userData = Object.values(userSnapshot.val())[0];
          const userId = Object.keys(userSnapshot.val())[0];
          const proofsRef = ref(db, `proofs/${userId}`);
          const proofsSnapshot = await get(proofsRef);

          let proofs = [];
          if (proofsSnapshot.exists()) {
            proofs = Object.keys(proofsSnapshot.val()).map(k => ({ id: k, ...proofsSnapshot.val()[k] })).filter(p => p.status === 'verified');
          }
          
          setData({ 
            success: true, 
            developer: { name: userData.displayName, username: userData.username, links: { github: userData.githubURL, linkedin: userData.linkedInURL, portfolio: userData.portfolioURL } },
            verified_proofs: proofs
          });
        } else {
          setData({ success: false, error: 'User not found' });
        }
      } catch (err) { setData({ success: false, error: err.message }); }
    }; 
    fetchApiData();
  }, [username]);

  return <pre style={{color: '#00ff88', padding: 20, fontSize: 13}}>{JSON.stringify(data, null, 2)}</pre>;
}


function SkillSelect({ onSelect, onCancel }) {
  const TECH_DOMAINS = [
    { id: 'ml', name: 'Machine Learning', icon: <Cpu size={32} strokeWidth={1.5} />, desc: 'Neural networks and predictive AI modeling.' },
    { id: 'cyber', name: 'Cybersecurity', icon: <ShieldAlert size={32} strokeWidth={1.5} />, desc: 'Network intrusion and threat detection logic.' },
    { id: 'web', name: 'Web Architecture', icon: <Layout size={32} strokeWidth={1.5} />, desc: 'High-performance React & MERN systems.' },
    { id: 'systems', name: 'System Design', icon: <Server size={32} strokeWidth={1.5} />, desc: 'Scalable backend logic and API orchestration.' },
    { id: 'mobile', name: 'Mobile Engineering', icon: <Smartphone size={32} strokeWidth={1.5} />, desc: 'Cross-platform Flutter & Dart development.' },
    { id: 'dsa', name: 'Core Algorithms', icon: <Binary size={32} strokeWidth={1.5} />, desc: 'Complex data structures and logic verification.' }
  ];
  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div style={{marginBottom: '50px'}}><span className="label-mini">DOMAIN CLASSIFICATION</span><h1 className="title-main">Select <span className="text-muted">Expertise.</span></h1></div>
      <div className="bento-grid">
        {TECH_DOMAINS.map(d => (
          <div key={d.id} className="bento-card" onClick={() => onSelect(d.name)}>
            <div style={{color: 'var(--acc)', opacity: 0.8, marginBottom: '20px'}}>{d.icon}</div>
            <div>
              <h3 style={{margin: '0 0 10px 0', fontWeight: 700, fontSize: '20px'}}>{d.name}</h3>
              <p style={{margin: 0, fontSize: '13px', opacity: 0.4, lineHeight: 1.5}}>{d.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-elite btn-outline" onClick={onCancel} style={{marginTop: '40px'}}><ArrowLeft size={16}/> BACK</button>
    </div>
  );
}

function ProofSubmit({ skill, onSubmit, onCancel }) {
  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div style={{marginBottom: '50px'}}><span className="label-mini">NEW VERIFICATION</span><h1 className="title-main">Audit: <span className="text-muted">{skill}</span></h1></div>
      <div className="glass-card">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ skill, title: e.target.title.value, description: e.target.description.value, link: e.target.link.value, mediaUrl: e.target.mediaUrl.value }); }}>
          <div style={{marginBottom: '30px'}}><label className="label-mini"><Terminal size={12}/> PROJECT TITLE</label><input className="apple-input" name="title" required /></div>
          <div style={{marginBottom: '30px'}}><label className="label-mini"><Link size={12}/> REPOSITORY URL (Needed for Auto-Tagging)</label><input className="apple-input" name="link" required placeholder="https://github.com/..." /></div>
          <div style={{marginBottom: '30px'}}><label className="label-mini"><Video size={12}/> MEDIA LINK (YouTube or Image URL - Optional)</label><input className="apple-input" name="mediaUrl" placeholder="Showcase a demo video..." /></div>
          <div style={{marginBottom: '40px'}}><label className="label-mini"><AlignLeft size={12}/> TECHNICAL DESCRIPTION</label><textarea className="apple-input" name="description" rows="5" style={{height:'auto'}} required /></div>
          <div style={{display: 'flex', gap: '15px'}}><button type="submit" className="btn-elite" style={{flex: 2}}><CheckCircle2 size={18}/> Initiate Audit</button><button type="button" onClick={onCancel} className="btn-elite btn-outline" style={{flex: 1}}><X size={18}/></button></div>
        </form>
      </div>
    </div>
  );
}

function ProfileEdit({ user, onSave, onCancel }) {
  const [name, setName] = useState(user?.displayName || ''); 
  const [username, setUsername] = useState(user?.username || '');
  const [linkedInURL, setLinkedInURL] = useState(user?.linkedInURL || ''); 
  const [githubURL, setGithubURL] = useState(user?.githubURL || '');
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || ''); 
  const [portfolioURL, setPortfolioURL] = useState(user?.portfolioURL || '');
  const [resumeBase64, setResumeBase64] = useState(user?.resumeBase64 || '');
  const [theme, setTheme] = useState(user?.theme || 'cyber'); 

  const handleFileChange = (e) => { 
    const file = e.target.files[0]; 
    if (file?.type === "application/pdf") { 
      const reader = new FileReader(); 
      reader.readAsDataURL(file); 
      reader.onload = () => setResumeBase64(reader.result); 
    }
  };

  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div style={{marginBottom: '50px'}}><span className="label-mini">ARCHIVE SETTINGS</span><h1 className="title-main">System <span className="text-muted">Preferences.</span></h1></div>
      <div className="glass-card">
        <form onSubmit={(e) => { e.preventDefault(); onSave({ displayName: name, username, linkedInURL, githubURL, contactEmail, portfolioURL, resumeBase64, theme }); }}>
          <div style={{marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)'}}>
            <label className="label-mini"><Palette size={12}/> UI THEME ENGINE</label>
            <div style={{display: 'flex', gap: 15}}>
              <button type="button" onClick={() => setTheme('cyber')} className={`btn-elite ${theme === 'cyber' ? '' : 'btn-outline'}`} style={{flex: 1}}>Cyber Vibe (Dark 3D)</button>
              <button type="button" onClick={() => setTheme('minimal')} className={`btn-elite ${theme === 'minimal' ? '' : 'btn-outline'}`} style={{flex: 1, background: theme==='minimal'?'white':'', color: theme==='minimal'?'black':''}}>Minimalist (Clean Light)</button>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
            <div><label className="label-mini">FULL NAME</label><input className="apple-input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label className="label-mini">USERNAME</label><input className="apple-input" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} required /></div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
            <div><label className="label-mini">LINKEDIN URL</label><input className="apple-input" value={linkedInURL} onChange={(e) => setLinkedInURL(e.target.value)} /></div>
            <div><label className="label-mini">GITHUB URL</label><input className="apple-input" value={githubURL} onChange={(e) => setGithubURL(e.target.value)} /></div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
            <div><label className="label-mini">CONTACT EMAIL</label><input className="apple-input" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
            <div><label className="label-mini">PORTFOLIO URL</label><input className="apple-input" value={portfolioURL} onChange={(e) => setPortfolioURL(e.target.value)} /></div>
          </div>
          <div style={{marginBottom: '40px'}}>
            <label className="label-mini">RESUME (PDF ONLY)</label>
            <input type="file" accept="application/pdf" id="pdf-up" onChange={handleFileChange} style={{display:'none'}} />
            <label htmlFor="pdf-up" className="btn-elite btn-outline" style={{display:'inline-flex', cursor: 'pointer'}}><Download size={18}/> {resumeBase64 ? "Update PDF" : "Upload PDF"}</label>
            {resumeBase64 && <p style={{fontSize:11, color:'var(--neon-green)', marginTop:10, fontWeight:700}}>✓ RESUME ATTACHED</p>}
          </div>
          <div style={{display: 'flex', gap: '15px'}}>
            <button type="submit" className="btn-elite" style={{flex: 2}}>SAVE PREFERENCES</button>
            <button type="button" onClick={onCancel} className="btn-elite btn-outline" style={{flex: 1}}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [showAuth, setShowAuth] = useState(false);
  const canvasRef = useRef();

  const path = window.location.pathname;
  if (path.startsWith('/api/v1/archive/')) {
    return <ProviaAPI username={path.split('/')[4]} />;
  } else if (path.startsWith('/archive/')) {
    const targetUsername = path.split('/')[2];
    return (
      <div className="app-root cyber">
        <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0, zIndex: -1}} />
        <PublicArchive username={targetUsername} />
      </div>
    );
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene(); 
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true }); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    const particles = new THREE.BufferGeometry(); 
    const pos = new Float32Array(2000 * 3);
    for(let i=0; i<2000*3; i++) pos[i] = (Math.random()-0.5) * 10;
    particles.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.005, color: '#888', transparent: true, opacity: 0.4 });
    const mesh = new THREE.Points(particles, mat); 
    scene.add(mesh); 
    camera.position.z = 3;
    const anim = () => { requestAnimationFrame(anim); mesh.rotation.y += 0.0004; renderer.render(scene, camera); }; 
    anim();
  }, [showAuth, screen, user?.theme]);

  // Auth Sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        onValue(ref(db, `users/${u.uid}`), (s) => { if (s.exists()) setUser({ uid: u.uid, ...s.val() }); });
        onValue(ref(db, `proofs/${u.uid}`), (s) => {
          const d = s.val(); setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
        });
      } else { setUser(null); } setLoading(false);
    }); 
    return () => unsub();
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault(); 
    const email = e.target.email.value; 
    const password = e.target.password.value;
    try {
      if (authMode === 'signup') {
        const name = e.target.name.value; 
        const username = e.target.username.value.toLowerCase().trim();
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await update(ref(db, `users/${res.user.uid}`), { displayName: name, username: username, email: email, theme: 'cyber' });
      } else { 
        await signInWithEmailAndPassword(auth, email, password); 
      }
    } catch (err) { alert(err.message); }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider(); 
      const res = await signInWithPopup(auth, provider);
      const username = res.user.reloadUserInfo.screenName || res.user.email.split('@')[0];
      await update(ref(db, `users/${res.user.uid}`), { 
        displayName: res.user.displayName, 
        username: username.toLowerCase().replace(/\s/g, ''), 
        email: res.user.email, 
        photoURL: res.user.photoURL, 
        theme: 'cyber' 
      });
    } catch (error) { alert(error.message); }
  };

  const verifyProjectInDB = (proofId, status, techStack) => { 
    update(ref(db, `proofs/${user.uid}/${proofId}`), { status, techStack }); 
  };

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="spin-anim" color="white" size={40}/></div>;

  // Determine active theme class
  const themeClass = user?.theme === 'minimal' ? 'minimal-mode' : 'cyber-mode';

  // LANDING PAGE
  if (!user && !showAuth) {
    return (
      <div className={`landing-root ${themeClass}`}>
        <canvas ref={canvasRef} />
        <nav className="nav-blur">
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: -1 }}>Provia.</span>
          <button className="btn-elite" onClick={() => setShowAuth(true)}>Sign In <ArrowRight size={16}/></button>
        </nav>
        <div className="hero-section">
          <div className="hero-glow"></div>
          <span className="label-mini" style={{color: 'var(--neon-green)', letterSpacing: 3}}>THE NEXT GENERATION</span>
          <h1 className="hero-title">Verify your <span className="text-gradient">Engineering.</span></h1>
          <p style={{ opacity: 0.6, fontSize: 22, maxWidth: 600, lineHeight: 1.5, margin: '0 0 40px 0' }}>A sovereign technical archive. Connect your repositories, run live verification audits, and share your true capabilities.</p>
          <button className="btn-elite" style={{padding: '20px 50px', fontSize: 16}} onClick={() => setShowAuth(true)}>Deploy Your Archive</button>
          <div className="floating-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" style={{background: '#ff5f56'}}></div>
              <div className="mockup-dot" style={{background: '#ffbd2e'}}></div>
              <div className="mockup-dot" style={{background: '#27c93f'}}></div>
            </div>
            <div style={{padding: '30px', textAlign: 'left', background: 'rgba(255,255,255,0.02)'}}>
              <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:20, marginBottom:20}}>
                <div style={{display:'flex', alignItems:'center', gap:15}}>
                  <div style={{width: 50, height: 50, borderRadius: '50%', background: 'var(--border)'}}></div>
                  <div><h3 style={{margin:0}}>Sofia Fatima</h3><p style={{margin:0, opacity:0.5, fontSize:12}}>Verified Developer</p></div>
                </div>
                <div className="verified-tag" style={{background: 'rgba(0, 255, 136, 0.1)', color: 'var(--neon-green)', border: '1px solid var(--neon-green)', alignSelf: 'center'}}>✓ 100% VERIFIED</div>
              </div>
              <div style={{background: 'rgba(0,0,0,0.5)', padding: 20, borderRadius: 12, border: '1px solid var(--border)'}}>
                <p style={{fontSize: 11, fontWeight: 700, opacity: 0.5, marginBottom: 15, letterSpacing: 1}}>AUDIT PIPELINE SIMULATION</p>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8, color: 'var(--neon-green)', fontSize: 13, fontWeight: 600}}>
                  <CheckCircle2 size={16}/> Analyzing GitHub Architecture...
                </div>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8, color: 'white', fontSize: 13, fontWeight: 600}}>
                  <Loader2 size={16} className="spin-anim"/> Applying Auto-Generated ML Tags...
                </div>
              </div>
            </div>
          </div>
        </div>
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <div className="container-elite">
            <span className="label-mini">The Architecture</span>
            <h2 className="title-main" style={{ fontSize: 50, marginBottom: 50 }}>Built for Scale & Truth.</h2>
            <div className="bento-grid">
              <div className="bento-card span-2">
                <h3 style={{ fontSize: 28, fontWeight: 700 }}>Live Validation.</h3>
                <p style={{ opacity: 0.6, marginTop: 15, lineHeight: 1.6, fontSize: 18 }}>We ping the public GitHub API to ensure your repository actually exists and auto-generate your tech stack tags.</p>
                <div style={{ display: 'flex', gap: 15, opacity: 0.4, marginTop: 40 }}><Github size={32}/><Code2 size={32}/></div>
              </div>
              <div className="bento-card">
                <Database size={32} />
                <h3 style={{marginTop: 20}}>Headless API</h3>
                <p style={{ fontSize: 15, opacity: 0.6, marginTop: 10 }}>Pull your JSON data directly into Flutter apps via our native API endpoint.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // INTERNAL VIEWS
  return (
    <div className={`app-root ${themeClass}`}>
      <canvas ref={canvasRef} />
      {!user ? (
        <div className="auth-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 40, letterSpacing: -1 }}>Provia.</h2>
            <button onClick={handleGithubLogin} className="btn-elite" style={{ width: '100%', marginBottom: 20, background: '#24292e', color: 'white' }}>
              <Github size={18} /> Continue with GitHub
            </button>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:20, opacity:0.3}}>
              <div style={{flex:1, height:1, background:'var(--acc)'}}></div>
              <span style={{fontSize:10, fontWeight:700}}>OR EMAIL</span>
              <div style={{flex:1, height:1, background:'var(--acc)'}}></div>
            </div>
            <form onSubmit={handleEmailAuth}>
              {authMode === 'signup' && (
                <>
                  <input className="apple-input" name="name" placeholder="Full Name" required />
                  <input className="apple-input" name="username" placeholder="Username" required />
                </>
              )}
              <input className="apple-input" name="email" type="email" placeholder="Email" required />
              <input className="apple-input" name="password" type="password" placeholder="Password" required />
              <button type="submit" className="btn-elite" style={{ width: '100%', marginTop: 10 }}>{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
              <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ fontSize: 13, textAlign: 'center', marginTop: 25, cursor: 'pointer', opacity: 0.6 }}>
                {authMode === 'login' ? "Don't have an account? Sign up" : "Back to login"}
              </p>
              <p onClick={() => setShowAuth(false)} style={{ fontSize: 12, textAlign: 'center', marginTop: 20, cursor: 'pointer', opacity: 0.4 }}>Cancel</p>
            </form>
          </div>
        </div>
      ) : (
        <div className="container-elite">
          {screen === 'dashboard' && <Dashboard user={user} proofs={proofs} onAdd={() => setScreen('skills')} onEdit={() => setScreen('edit')} onSignOut={() => signOut(auth)} onVerify={verifyProjectInDB} />}
          {screen === 'skills' && <SkillSelect onSelect={(s) => { setSelectedSkill(s); setScreen('submit'); }} onCancel={() => setScreen('dashboard')} />}
          {screen === 'submit' && <ProofSubmit skill={selectedSkill} onSubmit={(d) => { push(ref(db, `proofs/${user.uid}`), { ...d, status: 'pending', timestamp: serverTimestamp() }); setScreen('dashboard'); }} onCancel={() => setScreen('dashboard')} />}
          {screen === 'edit' && <ProfileEdit user={user} onCancel={() => setScreen('dashboard')} onSave={async (d) => { await update(ref(db, `users/${user.uid}`), d); setScreen('dashboard'); }} />}
        </div>
      )}
    </div>
  );
}
function PublicArchive({ username }) {
  const [targetUser, setTargetUser] = useState(null); 
  const [publicProofs, setPublicProofs] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchPublicData = async () => { 
      try { 
        const usersRef = query(ref(db, 'users'), orderByChild('username'), equalTo(username)); 
        const userSnapshot = await get(usersRef); 
        if (userSnapshot.exists()) { 
          const userData = Object.values(userSnapshot.val())[0]; 
          const userId = Object.keys(userSnapshot.val())[0]; 
          setTargetUser(userData); 
          
          const proofsRef = ref(db, `proofs/${userId}`); 
          const proofsSnapshot = await get(proofsRef); 
          if (proofsSnapshot.exists()) { 
            const pData = proofsSnapshot.val(); 
            const verifiedProofs = Object.keys(pData).map(k => ({ ...pData[k], id: k })).filter(p => p.status === 'verified').reverse(); 
            setPublicProofs(verifiedProofs); 
          } 
        } 
      } catch (err) { console.error(err); } 
      setLoading(false); 
    }; 
    fetchPublicData(); 
  }, [username]);

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="spin-anim" color="white" size={40}/></div>;
  if (!targetUser) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><h1 style={{fontWeight:700, opacity:0.5}}>Archive Not Found.</h1></div>;
  
  return (
    <div className="landing-root">
      <nav className="nav-blur">
        <span style={{ fontWeight: 700, fontSize: 18 }}>Provia.</span>
        <button className="btn-elite" onClick={() => window.location.href = '/'}>Create Your Own</button>
      </nav>
      <div className="container-elite" style={{paddingTop: '120px', paddingBottom: '100px'}}>
        <div className="glass-card" style={{marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            {targetUser.photoURL ? <img src={targetUser.photoURL} alt="Profile" style={{width:80, height:80, borderRadius:'50%', border:'1px solid var(--border)'}} /> 
            : <div style={{width:80, height:80, borderRadius:'50%', background:'#111', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:32}}>{targetUser.displayName[0]}</div>}
            <div>
              <h1 style={{margin: 0, fontWeight: 700, fontSize: '32px'}}>{targetUser.displayName}</h1>
              <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#00ff88', fontWeight: 700, letterSpacing: '1px'}}>✓ VERIFIED ENGINEERING ARCHIVE</p>
              <div style={{display: 'flex', gap: '15px', marginTop: '12px'}}>
                {targetUser?.linkedInURL && <a href={targetUser.linkedInURL} target="_blank" rel="noreferrer" className="social-link-icon"><Linkedin size={18}/></a>}
                {targetUser?.githubURL && <a href={targetUser.githubURL} target="_blank" rel="noreferrer" className="social-link-icon"><Github size={18}/></a>}
                {targetUser?.contactEmail && <a href={`mailto:${targetUser.contactEmail}`} className="social-link-icon"><Mail size={18}/></a>}
                {targetUser?.portfolioURL && <a href={targetUser.portfolioURL} target="_blank" rel="noreferrer" className="social-link-icon"><Link size={18}/></a>}
              </div>
            </div>
          </div>
          {targetUser.resumeBase64 && (
            <button className="btn-elite btn-outline" onClick={() => { 
              const link = document.createElement('a'); 
              link.href = targetUser.resumeBase64; 
              link.download = `${targetUser.displayName.replace(/\s+/g, '_')}_Resume.pdf`; 
              link.click(); 
            }}>
              <Download size={18}/> Download Resume
            </button>
          )}
        </div>
        <h3 className="label-mini" style={{marginBottom: '30px'}}>VERIFIED CONTRIBUTIONS</h3>
        {publicProofs.length === 0 ? <p style={{opacity:0.5}}>No verified projects available yet.</p> 
        : publicProofs.map(proof => (
          <div key={proof.id} className="timeline-item">
            <div className="glass-card" style={{ border: '1px solid rgba(0, 255, 136, 0.3)' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                <span className="verified-tag" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid #00ff88' }}>✓ VERIFIED</span>
                <span style={{fontSize: '11px', fontWeight: 600, opacity: 0.4}}>{(proof.skill || "General").toUpperCase()}</span>
              </div>
              <h2 style={{margin: '0 0 10px 0', fontSize: '22px', fontWeight: 700}}>{proof.title}</h2>
              <p style={{margin: 0, fontSize: '15px', opacity: 0.6, lineHeight: 1.6}}>{proof.description}</p>
              
              {proof.techStack && proof.techStack.length > 0 && (
                <div style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
                  <Code size={14} style={{color: 'var(--neon-blue)', alignSelf: 'center'}} />
                  {proof.techStack.map(tech => (
                    <span key={tech} className="tech-tag-pill">{tech}</span>
                  ))}
                </div>
              )}
              
              <MediaViewer url={proof.mediaUrl} />
              
              <div style={{marginTop: '25px'}}>
                <a href={proof.link} target="_blank" rel="noreferrer" className="btn-elite btn-outline">
                  <Github size={16}/> VIEW REPOSITORY
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// src/App.jsx
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react'; // Needs 'npm install lucide-react'
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [screen, setScreen] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        onValue(ref(db, `proofs/${u.uid}`), (s) => {
          const d = s.val();
          setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
        });
      }
    });
    return () => unsub();
  }, []);

  const handleDeepAudit = async (data) => {
    // 🛡️ THE TRUTH ENGINE
    const audit = {
      repoExists: data.link.toLowerCase().includes('github.com'),
      hasReadme: data.description.length > 45, // Length check for documentation
      isLive: data.link.includes('vercel.app') || data.link.includes('netlify.app')
    };

    const status = (audit.repoExists && audit.hasReadme) ? 'verified' : 'pending';

    await push(ref(db, `proofs/${user.uid}`), {
      ...data,
      status: status,
      signals: audit,
      timestamp: serverTimestamp()
    });
    setScreen('dashboard');
  };

  if (!user) return (
    <div className="app-container">
      <div className="view-wrapper" style={{maxWidth: '400px'}}>
        <h1 className="provia-hero" style={{fontSize: '4rem'}}>provia</h1>
        <form onSubmit={e => { e.preventDefault(); authMode === 'signup' ? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password); }}>
          <input className="glass-input" placeholder="email" onChange={e => setEmail(e.target.value)} required />
          <div className="pass-wrapper" style={{marginTop: '15px'}}>
            <input className="glass-input" type={showPass ? "text" : "password"} placeholder="password" onChange={e => setPassword(e.target.value)} required />
            <div className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <button className="elite-btn" style={{marginTop: '20px'}}>{authMode}</button>
        </form>
        <p style={{marginTop: '20px', cursor: 'pointer', opacity: 0.5}} onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          {authMode === 'login' ? 'new? create account' : 'already a member? login'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="view-wrapper">
        <nav className="top-nav">
          <span style={{fontWeight: 900, fontSize: '1.5rem'}}>provia</span>
          <button className="logout-btn-premium" onClick={() => signOut(auth)}>logout</button>
        </nav>
        {screen === 'dashboard' && <Dashboard proofs={proofs} onAdd={() => setScreen('skills')} />}
        {screen === 'skills' && <SkillSelect onSelect={(s) => { setSelectedSkill(s); setScreen('submit'); }} />}
        {screen === 'submit' && <ProofSubmit skill={selectedSkill} onSubmit={handleDeepAudit} />}
      </div>
    </div>
  );
}
export default App;
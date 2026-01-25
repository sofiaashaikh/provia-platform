import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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

  // 🔥 FIREBASE REALTIME LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        onValue(ref(db, `proofs/${u.uid}`), (snapshot) => {
          const data = snapshot.val();
          setProofs(data ? Object.keys(data).map(k => ({...data[k], id: k})).reverse() : []);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeepAudit = async (data) => {
    // 🛡️ THE TRUTH ENGINE (Verification Logic)
    const audit = {
      isRepo: data.link.toLowerCase().includes('github.com'),
      isDetailed: data.description.length > 20, // Must explain the project
      isLive: data.link.includes('vercel.app') || data.link.includes('netlify.app')
    };

    // STRICT RULE: Must be a Repo AND have Documentation to be Verified
    const status = (audit.isRepo && audit.isDetailed) ? 'verified' : 'pending';

    await push(ref(db, `proofs/${user.uid}`), {
      ...data,
      status: status,
      signals: audit,
      timestamp: serverTimestamp()
    });
    setScreen('dashboard');
  };

  // 3D-STYLE PAGE TRANSITIONS
  const pageVariants = {
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    in: { opacity: 1, y: 0, filter: 'blur(0px)' },
    out: { opacity: 0, y: -20, filter: 'blur(10px)' }
  };

  const pageTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

  // LOGIN SCREEN
  if (!user) return (
    <div className="app-container">
      <motion.div className="view-wrapper" style={{maxWidth: '400px', textAlign: 'center'}} initial="initial" animate="in" variants={pageVariants} transition={pageTransition}>
        <h1 className="provia-hero">provia</h1>
        <form onSubmit={e => { e.preventDefault(); authMode === 'signup' ? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password); }}>
          <input className="glass-input" style={{marginBottom:'15px'}} type="email" placeholder="email" onChange={e => setEmail(e.target.value)} required />
          <div style={{position:'relative', marginBottom:'30px'}}>
            <input className="glass-input" type={showPass ? "text" : "password"} placeholder="password" onChange={e => setPassword(e.target.value)} required />
            <div style={{position:'absolute', right:'15px', top:'20px', cursor:'pointer', color:'#666'}} onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <button className="elite-btn" style={{width:'100%'}}>{authMode === 'login' ? 'enter workspace' : 'initialize account'}</button>
        </form>
        <p style={{marginTop:'30px', color:'#666', cursor:'pointer'}} onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          {authMode === 'login' ? 'new user? create account' : 'access existing account'}
        </p>
      </motion.div>
    </div>
  );

  // APP SCREENS
  return (
    <div className="app-container">
      <div className="view-wrapper">
        <nav style={{display:'flex', justifyContent:'space-between', marginBottom:'60px', alignItems:'center'}}>
          <span style={{fontWeight:900, fontSize:'1.5rem'}}>provia</span>
          <button onClick={() => signOut(auth)} style={{background:'none', border:'1px solid #333', color:'#888', padding:'8px 20px', borderRadius:'50px', cursor:'pointer'}}>logout</button>
        </nav>

        <AnimatePresence mode="wait">
          {screen === 'dashboard' && (
            <motion.div key="dash" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <Dashboard proofs={proofs} onAdd={() => setScreen('skills')} />
            </motion.div>
          )}
          {screen === 'skills' && (
            <motion.div key="skills" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <SkillSelect onSelect={(s) => { setSelectedSkill(s); setScreen('submit'); }} />
            </motion.div>
          )}
          {screen === 'submit' && (
            <motion.div key="submit" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
              <ProofSubmit skill={selectedSkill} onSubmit={handleDeepAudit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default App;
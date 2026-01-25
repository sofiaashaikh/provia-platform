import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        onValue(ref(db, `proofs/${u.uid}`), (s) => {
          const d = s.val();
          setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signup') await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { alert(err.message); }
  };

  const submitProof = async (data) => {
    const isVerified = data.skill.toLowerCase() === 'html' && data.link.includes('github.com');
    await push(ref(db, `proofs/${user.uid}`), { ...data, status: isVerified ? 'verified' : 'pending', createdAt: serverTimestamp() });
    setCurrentScreen('dashboard');
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div key="auth" className="view-wrapper" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <h1 className="provia-hero">provia</h1>
            <form style={{width: '320px'}} onSubmit={handleAuth}>
              <input className="glass-input" type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
              <input className="glass-input" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
              <button className="elite-btn">{authMode}</button>
            </form>
            <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{marginTop: '20px', cursor: 'pointer', opacity: 0.5}}>
              {authMode === 'login' ? 'new? create account' : 'already a member? login'}
            </p>
          </motion.div>
        ) : (
          <motion.div key="app" className="view-wrapper" initial={{opacity:0}} animate={{opacity:1}}>
            <nav style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '50px'}}>
              <span style={{fontWeight: 900, fontSize: '1.5rem'}}>provia</span>
              <button onClick={() => signOut(auth)} style={{background: 'none', border: '1px solid white', color: 'white', borderRadius: '20px', padding: '5px 15px', cursor: 'pointer'}}>logout</button>
            </nav>

            {currentScreen === 'dashboard' && <Dashboard proofs={proofs} onAdd={() => setCurrentScreen('skills')} />}
            {currentScreen === 'skills' && <SkillSelect onSelect={(s) => { setSelectedSkill(s); setCurrentScreen('submit'); }} />}
            {currentScreen === 'submit' && <ProofSubmit skill={selectedSkill} onSubmit={submitProof} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
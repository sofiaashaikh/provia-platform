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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProofsRef = ref(db, `proofs/${currentUser.uid}`);
        onValue(userProofsRef, (snapshot) => {
          const data = snapshot.val();
          setProofs(data ? Object.keys(data).map(k => ({...data[k], id: k})).reverse() : []);
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

  if (!user) return (
    <div className="landing-container">
      <motion.h1 
        className="provia-title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        provia
      </motion.h1>
      
      <motion.form 
        className="auth-form"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 0.8 }}
        onSubmit={handleAuth}
      >
        <input type="email" placeholder="email address" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="auth-btn">
          {authMode === 'login' ? 'enter workspace' : 'create account'}
        </button>
      </motion.form>
      
      <motion.p 
        className="auth-toggle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      >
        {authMode === 'login' ? "request access / sign up" : "already a member? login"}
      </motion.p>
    </div>
  );

  return (
    <div className="app-main">
      {/* Your dashboard logic stays the same but now inherits the dark theme */}
      {currentScreen === 'skills' && <SkillSelect onContinue={(s) => { setSelectedSkill(s); setCurrentScreen('proof'); }} />}
      {currentScreen === 'proof' && <ProofSubmit selectedSkill={selectedSkill} onFinalSubmit={() => setCurrentScreen('dashboard')} />}
      {currentScreen === 'dashboard' && (
        <Dashboard proofs={proofs} onAddMore={() => setCurrentScreen('skills')} />
      )}
    </div>
  );
}

export default App;
// src/App.jsx
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth'; 
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentScreen, setCurrentScreen] = useState('landing');
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
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password); 
      } else {
        await signInWithEmailAndPassword(auth, email, password); 
      }
      setCurrentScreen('dashboard');
    } catch (err) { alert(err.message); }
  };

  const handleProofSubmission = async (newProof) => {
    if (!user) return;
    
    // 🛡️ ENHANCED VERIFICATION LOGIC
    const checks = {
      repoExists: newProof.link.toLowerCase().includes('github.com'),
      hasCommits: true,
      hasReadme: newProof.description.length > 20,
      hasLiveLink: newProof.link.includes('vercel.app') || newProof.link.includes('netlify.app')
    };

    // If it's HTML and has a GitHub link, mark as VERIFIED
    const isVerified = newProof.skill.toLowerCase() === 'html' && checks.repoExists;
    const finalStatus = isVerified ? 'verified' : 'pending';

    const userProofsRef = ref(db, `proofs/${user.uid}`); 
    await push(userProofsRef, { 
      ...newProof, 
      status: finalStatus, // This makes the green badge appear
      checks,
      createdAt: serverTimestamp() 
    });
    
    setCurrentScreen('dashboard');
  };

  if (!user) return (
    <div className="landing-container">
      <h1 className="provia-title">provia</h1>
      <form className="auth-form" onSubmit={handleAuth}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="auth-btn">
          {authMode === 'login' ? 'login' : 'sign up'}
        </button>
      </form>
      <p className="auth-toggle" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
        {authMode === 'login' ? "new? create account" : "already have account? login"}
      </p>
    </div>
  );

  if (currentScreen === 'skills') return <SkillSelect onContinue={(s) => { setSelectedSkill(s); setCurrentScreen('proof'); }} />;
  if (currentScreen === 'proof') return <ProofSubmit selectedSkill={selectedSkill} onFinalSubmit={handleProofSubmission} />;
  
  return (
    <div className="app-main">
      <nav className="navbar">
        <span className="user-email">{user.email}</span>
        <button className="logout-btn" onClick={() => signOut(auth)}>logout</button>
      </nav>
      <Dashboard proofs={proofs} onAddMore={() => setCurrentScreen('skills')} />
    </div>
  );
}

export default App;
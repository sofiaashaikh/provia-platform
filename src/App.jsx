// src/App.jsx
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth'; //
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proofs, setProofs] = useState([]);

  // 🛡️ Watch for User Login/Logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Only load proofs belonging to THIS user
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
        await createUserWithEmailAndPassword(auth, email, password); //
      } else {
        await signInWithEmailAndPassword(auth, email, password); //
      }
      setCurrentScreen('dashboard');
    } catch (err) { alert(err.message); }
  };

  const handleProofSubmission = async (newProof) => {
    if (!user) return;
    const userProofsRef = ref(db, `proofs/${user.uid}`); // Save under User ID
    await push(userProofsRef, { ...newProof, createdAt: serverTimestamp() });
    setCurrentScreen('dashboard');
  };

  // 1. Landing Screen with Login Form
  if (!user) return (
    <div className="landing-container">
      <h1 className="provia-title">provia</h1>
      <form className="auth-form" onSubmit={handleAuth}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{authMode === 'login' ? 'login' : 'sign up'}</button>
      </form>
      <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
        {authMode === 'login' ? "new? create account" : "already have account? login"}
      </p>
    </div>
  );

  // 2. Logged In Screens
  if (currentScreen === 'skills') return <SkillSelect onContinue={(s) => { setSelectedSkill(s); setCurrentScreen('proof'); }} />;
  if (currentScreen === 'proof') return <ProofSubmit selectedSkill={selectedSkill} onFinalSubmit={handleProofSubmission} />;
  
  return (
    <div className="app-main">
      <button className="logout-btn" onClick={() => signOut(auth)}>logout</button>
      <Dashboard proofs={proofs} onAddMore={() => setCurrentScreen('skills')} />
    </div>
  );
}

export default App;
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

  // 🛡️ Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Only load data for the logged-in user
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
    
    // ⚙️ Automated Verification Logic
    const checks = {
      repoExists: newProof.link.toLowerCase().includes('github.com'),
      hasReadme: newProof.description.length > 20,
      hasLiveLink: newProof.link.includes('vercel.app') || newProof.link.includes('netlify.app')
    };

    // Auto-verify if it's a GitHub repo for HTML
    const isVerified = newProof.skill.toLowerCase() === 'html' && checks.repoExists;
    const finalStatus = isVerified ? 'verified' : 'pending';

    const userProofsRef = ref(db, `proofs/${user.uid}`); 
    await push(userProofsRef, { 
      ...newProof, 
      status: finalStatus,
      checks,
      createdAt: serverTimestamp() 
    });
    
    setCurrentScreen('dashboard');
  };

  // 1. Landing & Authentication Screen
  if (!user) return (
    <div className="landing-container">
      <h1 className="provia-title">provia</h1>
      <form className="auth-form" onSubmit={handleAuth}>
        <input 
          type="email" 
          placeholder="email address" 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="password" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="auth-btn">
          {authMode === 'login' ? 'login' : 'create account'}
        </button>
      </form>
      <p className="auth-toggle" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
        {authMode === 'login' ? "new? create account" : "already have account? login"}
      </p>
    </div>
  );

  // 2. Skill Selection Screen
  if (currentScreen === 'skills') {
    return (
      <SkillSelect 
        onContinue={(skill) => { 
          setSelectedSkill(skill); 
          setCurrentScreen('proof'); 
        }} 
      />
    );
  }

  // 3. Proof Submission Screen
  if (currentScreen === 'proof') {
    return (
      <ProofSubmit 
        selectedSkill={selectedSkill} 
        onFinalSubmit={handleProofSubmission} 
      />
    );
  }
  
  // 4. Main Dashboard Screen
  return (
    <div className="app-main">
      <nav style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 0', 
        borderBottom: '1px solid #eee',
        marginBottom: '40px'
      }}>
        <span style={{fontWeight: '900', fontSize: '1.8rem', letterSpacing: '-2px'}}>provia</span>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{fontSize: '0.8rem', color: '#666'}}>{user.email}</span>
          <button 
            onClick={() => signOut(auth)} 
            style={{
              background: 'none', 
              border: '1px solid #000', 
              borderRadius: '6px',
              padding: '5px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            logout
          </button>
        </div>
      </nav>
      
      <Dashboard 
        proofs={proofs} 
        onAddMore={() => setCurrentScreen('skills')} 
      />
    </div>
  );
}

export default App;
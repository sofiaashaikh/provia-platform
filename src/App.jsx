// src/App.jsx
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [proofs, setProofs] = useState([]);

  // Load data from Realtime Database
  useEffect(() => {
    const proofsRef = ref(db, 'proofs');
    return onValue(proofsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        })).reverse();
        setProofs(list);
      } else {
        setProofs([]);
      }
    });
  }, []);

  const handleProofSubmission = async (newProof) => {
    const proofsRef = ref(db, 'proofs');
    
    // Engineering Logic
    const checks = {
      repoExists: newProof.link.toLowerCase().includes('github.com'),
      hasCommits: true,
      hasReadme: newProof.description.length > 20,
      hasLiveLink: newProof.link.includes('vercel.app') || newProof.link.includes('netlify.app')
    };

    const isVerified = newProof.skill.toLowerCase() === 'html' && checks.repoExists;
    const finalStatus = isVerified ? 'verified' : 'pending';

    // Save to Firebase
    await push(proofsRef, {
      ...newProof,
      status: finalStatus,
      checks,
      createdAt: serverTimestamp()
    });

    setCurrentScreen('dashboard');
  };

  if (currentScreen === 'landing') return (
    <div className="landing-container">
      <h1 className="provia-title">provia</h1>
      <p className="provia-subtitle">stop listing skills. start proving them.</p>
      <button className="get-started-btn" onClick={() => setCurrentScreen('skills')}>get started</button>
    </div>
  );

  if (currentScreen === 'skills') return <SkillSelect onContinue={(s) => { setSelectedSkill(s); setCurrentScreen('proof'); }} />;
  if (currentScreen === 'proof') return <ProofSubmit selectedSkill={selectedSkill} onFinalSubmit={handleProofSubmission} />;
  return <Dashboard proofs={proofs} onAddMore={() => setCurrentScreen('skills')} />;
}

export default App;
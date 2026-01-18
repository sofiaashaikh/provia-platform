// src/App.jsx
import { useState } from 'react';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import Dashboard from './pages/Dashboard';
import './styles/landing.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  // TASK 13: Store verification checks in the initial state
  const [proofs, setProofs] = useState([
    {
      skill: "HTML",
      status: "verified",
      link: "https://github.com/sofiaashaikh/provia-app",
      description: "Semantic structure for a documentation site.",
      checks: { repoExists: true, hasCommits: true, hasReadme: true, hasLiveLink: true }
    }
  ]);

  const handleProofSubmission = (newProof) => {
    // TASK 13: Simulated Verification Engine
    const checks = {
      repoExists: newProof.link.includes('github.com'),
      hasCommits: true, // Simulated
      hasReadme: newProof.description.length > 30, // Logic: Long desc = better docs
      hasLiveLink: newProof.link.includes('vercel.app') || newProof.link.includes('netlify.app')
    };

    // Logical Rule: All must be true for auto-verification
    const isAllValid = Object.values(checks).every(check => check === true);
    const finalStatus = isAllValid ? 'verified' : 'pending';

    const proofWithChecks = { ...newProof, status: finalStatus, checks };
    setProofs([...proofs, proofWithChecks]);
    setCurrentScreen('dashboard');
  };

  if (currentScreen === 'landing') {
    return (
      <div className="landing-container">
        <h1 className="provia-title">provia</h1>
        <p className="provia-subtitle">stop listing skills. start proving them.</p>
        <button className="get-started-btn" onClick={() => setCurrentScreen('skills')}>get started</button>
      </div>
    );
  }

  if (currentScreen === 'skills') {
    return <SkillSelect onContinue={(s) => { setSelectedSkill(s); setCurrentScreen('proof'); }} />;
  }

  if (currentScreen === 'proof') {
    return <ProofSubmit selectedSkill={selectedSkill} onFinalSubmit={handleProofSubmission} />;
  }

  return <Dashboard proofs={proofs} onAddMore={() => setCurrentScreen('skills')} />;
}

export default App;
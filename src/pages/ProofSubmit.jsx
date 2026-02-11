import React, { useState } from 'react';

export default function ProofSubmit({ skill, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const githubUrl = e.target.github.value;
    
    // Check if it's a real GitHub link
    if (!githubUrl.includes("github.com")) {
      setError("Please provide a valid GitHub link.");
      setLoading(false);
      return;
    }

    try {
      const repoPath = githubUrl.split("github.com/")[1];
      const res = await fetch(`https://api.github.com/repos/${repoPath}`);
      
      if (res.ok) {
        onSubmit({
          skill,
          description: e.target.desc.value,
          github: githubUrl,
          link: e.target.live.value,
          verified: true
        });
      } else {
        setError("Repository not found. Is it private?");
        setLoading(false);
      }
    } catch (err) {
      setError("Verification failed. Check your internet.");
      setLoading(false);
    }
  };

  return (
    <div className="submit-panel">
      <h2 className="provia-title" style={{fontSize: 24}}>Verify {skill}</h2>
      <form onSubmit={handleVerify}>
        <div className="input-container">
          <textarea name="desc" className="glass-input" placeholder="Technical breakdown of your project..." required style={{minHeight: '120px'}} />
          <input name="github" className="glass-input" placeholder="GitHub Repository URL" required />
          <input name="live" className="glass-input" placeholder="Live Demo URL" required />
        </div>
        {error && <p style={{color: '#ff4444', fontSize: 12, textAlign: 'center', marginBottom: 15}}>{error}</p>}
        <button className="action-btn" disabled={loading}>
          {loading ? "VERIFYING..." : "VERIFY & SAVE"}
        </button>
      </form>
    </div>
  );
}
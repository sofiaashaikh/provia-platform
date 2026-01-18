// src/pages/ProofSubmit.jsx
import { useState } from 'react';

const ProofSubmit = ({ selectedSkill, onFinalSubmit }) => {
  const [formData, setFormData] = useState({ link: '', description: '', ownership: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinalSubmit({ ...formData, skill: selectedSkill });
  };

  return (
    <div className="landing-container">
      <h2>prove your {selectedSkill} skill</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <input 
          className="proof-input" required type="url" placeholder="project link"
          onChange={(e) => setFormData({...formData, link: e.target.value})}
        />
        <textarea 
          className="proof-input" required placeholder="what does this project show?"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        {/* STEP 2: Ownership Field */}
        <textarea 
          className="proof-input" placeholder="what did you personally build or decide here? (optional)"
          style={{ height: '100px' }}
          onChange={(e) => setFormData({...formData, ownership: e.target.value})}
        />
        <button type="submit" className="get-started-btn" style={{ width: '100%' }}>submit proof</button>
      </form>
    </div>
  );
};

export default ProofSubmit;
// src/pages/SkillSelect.jsx
import { useState } from 'react';
import '../styles/landing.css';

const SkillSelect = ({ onContinue }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const skills = ['HTML', 'CSS', 'JavaScript', 'Git'];

  return (
    <div className="landing-container">
      <h2>what’s the first skill you want to prove?</h2>
      <p className="provia-subtitle">you can add more later. start with one.</p>
      
      <div className="skill-grid">
        {skills.map((skill) => (
          <div 
            key={skill}
            className={`skill-card ${selectedSkill === skill ? 'selected' : ''}`}
            onClick={() => setSelectedSkill(skill)}
          >
            {skill}
          </div>
        ))}
      </div>

      <button 
        className="get-started-btn" 
        disabled={!selectedSkill}
        onClick={() => onContinue(selectedSkill)}
        style={{ marginTop: '2rem' }}
      >
        continue
      </button>
    </div>
  );
};

export default SkillSelect;
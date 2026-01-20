import React, { useState } from 'react';

function SkillSelect({ onContinue }) {
  const [selected, setSelected] = useState('');
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Firebase'];

  return (
    <div className="page-container">
      <h1>select a skill to prove</h1>
      <div className="skill-grid">
        {skills.map(skill => (
          <div 
            key={skill} 
            className={`skill-card ${selected === skill ? 'selected' : ''}`}
            onClick={() => setSelected(skill)}
          >
            {skill}
          </div>
        ))}
      </div>
      <button 
        className="action-btn" 
        style={{width: '200px'}}
        onClick={() => selected && onContinue(selected)}
      >
        continue
      </button>
    </div>
  );
}

export default SkillSelect;
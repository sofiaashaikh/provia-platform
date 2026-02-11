import React, { useState } from 'react';

export default function SkillSelect({ onSelect }) {
  const [search, setSearch] = useState('');
  const skills = ['React', 'Python', 'Machine Learning', 'Node.js', 'Java 8', 'Firebase', 'CSS', 'HTML', 'JavaScript', 'Flutter'];

  const filtered = skills.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input 
        className="search-input" 
        placeholder="Search engineering modules..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="skill-grid">
        {filtered.map(s => (
          <div key={s} className="skill-card" onClick={() => onSelect(s)}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
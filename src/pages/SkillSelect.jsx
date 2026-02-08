import { Box, Terminal, Cpu, Globe, Layers, FileCode } from 'lucide-react';

export default function SkillSelect({ onSelect }) {
  const skills = [
    { name: 'React', type: 'Library', icon: <Box size={24} /> },
    { name: 'Python', type: 'Backend', icon: <Terminal size={24} /> },
    { name: 'Machine Learning', type: 'AI/ML', icon: <Cpu size={24} /> },
    { name: 'HTML', type: 'Structure', icon: <Globe size={24} /> },
    { name: 'CSS', type: 'Design', icon: <Layers size={24} /> },
    { name: 'JavaScript', type: 'Logic', icon: <FileCode size={24} /> }
  ];

  return (
    <div>
      <h2 style={{textAlign:'center', fontWeight:900, fontSize:28, marginBottom:30}}>Select Module</h2>
      <div className="skill-grid">
        {skills.map(s => (
          <div key={s.name} className="skill-box" onClick={() => onSelect(s.name)}>
            {s.icon}
            <span>{s.name}</span>
            <i>{s.type}</i>
          </div>
        ))}
      </div>
    </div>
  );
}
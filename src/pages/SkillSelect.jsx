import { motion } from 'framer-motion';

export default function SkillSelect({ onSelect }) {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Firebase', 'Git'];
  return (
    <div style={{textAlign: 'center', width: '100%'}}>
      <h2 style={{fontSize: '3rem', fontWeight: 900, marginBottom: '40px', letterSpacing: '-2px'}}>select expertise</h2>
      <div className="proof-grid" style={{maxWidth: '700px', margin: '0 auto'}}>
        {skills.map((s, i) => (
          <motion.div 
            key={s} className="glass-card" 
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
            onClick={() => onSelect(s)}
            style={{cursor: 'pointer', textAlign: 'center', padding: '40px'}}
          >
            <span style={{fontWeight: 900, fontSize: '1.2rem'}}>{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
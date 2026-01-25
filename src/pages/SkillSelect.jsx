import { motion } from 'framer-motion';

export default function SkillSelect({ onSelect }) {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Firebase'];
  return (
    <div style={{textAlign: 'center'}}>
      <h2 style={{fontSize: '3rem', marginBottom: '40px'}}>select expertise</h2>
      <div className="elite-grid" style={{maxWidth: '600px'}}>
        {skills.map((s, i) => (
          <motion.div 
            key={s} className="glass-card" 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            onClick={() => onSelect(s)}
            style={{cursor: 'pointer', textAlign: 'center'}}
          >
            {s}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';

export default function SkillSelect({ onSelect }) {
  // Added 'Python' to the list
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Firebase', 'Git'];
  
  return (
    <div style={{textAlign:'center'}}>
      <h2 style={{fontSize:'3rem', fontWeight:900, marginBottom:'60px'}}>select_module</h2>
      <div className="proof-grid" style={{marginTop:0}}>
        {skills.map((s, i) => (
          <motion.div 
            key={s} 
            className="glass-card"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.5)' }}
            onClick={() => onSelect(s)}
            style={{cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'150px'}}
          >
            <span style={{fontWeight:900, fontSize:'1.5rem'}}>{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
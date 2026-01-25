import { motion } from 'framer-motion';

export default function Dashboard({ proofs, onAdd }) {
  return (
    <div style={{width: '100%'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px'}}>
        <div>
          <h2 style={{fontSize: '3rem', margin: 0}}>workspace</h2>
          <p style={{opacity: 0.5}}>active expertise index</p>
        </div>
        <button className="elite-btn" style={{width: 'auto', padding: '12px 30px'}} onClick={onAdd}>+ add proof</button>
      </div>

      <div className="elite-grid">
        {proofs.map((p, i) => (
          <motion.div key={p.id} className="glass-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <span style={{fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem'}}>{p.skill}</span>
              <span style={{color: p.status === 'verified' ? '#4ade80' : '#fbbf24'}}>{p.status}</span>
            </div>
            <p style={{fontSize: '1.1rem', marginBottom: '20px'}}>"{p.description}"</p>
            <a href={p.link} target="_blank" style={{color: 'white', opacity: 0.4, fontSize: '0.8rem'}}>source code ↗</a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
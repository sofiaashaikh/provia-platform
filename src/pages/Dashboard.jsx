import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ proofs, onAdd }) {
  const [showSystem, setShowSystem] = useState(false);

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'60px'}}>
        <div>
          <h1 style={{fontSize:'3rem', fontWeight:900, margin:0, letterSpacing:'-2px'}}>workspace</h1>
          <p style={{color:'#666', cursor:'pointer', marginTop:'10px', fontFamily:'JetBrains Mono, monospace', fontSize:'0.8rem'}} onClick={() => setShowSystem(!showSystem)}>
            [{showSystem ? 'HIDE_LOGIC' : 'VIEW_VERIFICATION_LOGIC'}]
          </p>
        </div>
        <button className="elite-btn" onClick={onAdd}>+ Add Proof</button>
      </div>

      <AnimatePresence>
        {showSystem && (
          <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{background:'rgba(255,255,255,0.03)', padding:'20px', borderRadius:'12px', marginBottom:'40px', border:'1px solid #333', color:'#888', fontSize:'0.9rem'}}>
            <strong>System Logic:</strong><br/>
            • STATUS: Verified = Github_Link + Detailed_Docs.<br/>
            • STATUS: Pending = Missing data signals.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="proof-grid">
        {proofs.map((p, i) => (
          <motion.div key={p.id} className="glass-card" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
              <span style={{fontWeight:900, fontSize:'1.1rem'}}>{p.skill}</span>
              <span className={`status-pill ${p.status}`}>{p.status}</span>
            </div>

            <div className="audit-box">
              <div className={`audit-item ${p.signals?.isRepo ? 'pass' : 'fail'}`}>
                <div className="dot"></div> GITHUB REPOSITORY
              </div>
              <div className={`audit-item ${p.signals?.isDetailed ? 'pass' : 'fail'}`}>
                <div className="dot"></div> DOCUMENTATION DEPTH
              </div>
              <div className={`audit-item ${p.signals?.isLive ? 'pass' : 'fail'}`}>
                <div className="dot"></div> LIVE DEPLOYMENT
              </div>
            </div>

            <p style={{fontStyle:'italic', color:'#888', marginBottom:'20px'}}>"{p.description}"</p>
            <a href={p.link} target="_blank" style={{color:'white', textDecoration:'none', borderBottom:'1px solid #333', paddingBottom:'2px', fontSize:'0.8rem'}}>VIEW SOURCE ↗</a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
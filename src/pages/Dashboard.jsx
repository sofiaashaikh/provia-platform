import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ proofs, onAdd }) {
  const [showSystem, setShowSystem] = useState(false);

  return (
    <div className="full-width">
      <div className="dash-header">
        <h1 className="provia-hero-sm">your skills</h1>
        <p className="tagline">proof beats claims.</p>
        
        <button className="system-toggle" onClick={() => setShowSystem(!showSystem)}>
          {showSystem ? 'hide system details' : 'how verification works'}
        </button>

        <AnimatePresence>
          {showSystem && (
            <motion.div className="system-info" initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}}>
              <p>Provia audits repository metadata and documentation depth to verify technical competence.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="proof-grid-elite">
        {proofs.map((p, i) => (
          <motion.div key={p.id} className="evidence-card-glass" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}}>
            <div className="card-top">
              <span className="skill-name">{p.skill}</span>
              <span className={`status-badge-elite ${p.status}`}>{p.status}</span>
            </div>

            <div className="signal-list">
              <div className={p.signals?.repoExists ? 'sig-pass' : 'sig-fail'}>
                {p.signals?.repoExists ? '●' : '○'} github repository found
              </div>
              <div className={p.signals?.hasReadme ? 'sig-pass' : 'sig-fail'}>
                {p.signals?.hasReadme ? '●' : '○'} technical documentation
              </div>
              <div className={p.signals?.isLive ? 'sig-pass' : 'sig-fail'}>
                {p.signals?.isLive ? '●' : '○'} live deployment signal
              </div>
            </div>

            <p className="evidence-quote">"{p.description}"</p>
            <a href={p.link} target="_blank" className="view-link">view project ↗</a>
          </motion.div>
        ))}
      </div>
      <button className="add-btn-fixed" onClick={onAdd}>+ add another proof</button>
    </div>
  );
}
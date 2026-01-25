import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProofSubmit({ skill, onSubmit }) {
  const [form, setForm] = useState({ link: '', description: '', contribution: '' });

  return (
    <motion.div style={{width: '100%', maxWidth: '500px'}} initial={{opacity: 0}} animate={{opacity: 1}}>
      <h2 style={{fontSize: '3rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-2px'}}>proving {skill}</h2>
      <p style={{opacity: 0.4, marginBottom: '40px'}}>the audit engine will verify repository metadata.</p>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input className="glass-input" placeholder="github repository link" onChange={e => setForm({...form, link: e.target.value})} />
        <textarea className="glass-input" style={{height: '100px', resize: 'none'}} placeholder="project intent & purpose" onChange={e => setForm({...form, description: e.target.value})} />
        <textarea className="glass-input" style={{height: '100px', resize: 'none'}} placeholder="your specific contribution" onChange={e => setForm({...form, contribution: e.target.value})} />
        <button className="elite-btn" onClick={() => onSubmit(form)}>run verification audit</button>
      </div>
    </motion.div>
  );
}
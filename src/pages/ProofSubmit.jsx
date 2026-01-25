import { useState } from 'react';

export default function ProofSubmit({ skill, onSubmit }) {
  const [form, setForm] = useState({ link: '', description: '', contribution: '' });
  return (
    <div style={{width: '100%', maxWidth: '500px'}}>
      <h2 style={{fontSize: '3rem', marginBottom: '10px'}}>proving {skill}</h2>
      <p style={{opacity: 0.5, marginBottom: '30px'}}>submit repository metadata for verification</p>
      <input className="glass-input" placeholder="repository link" onChange={e => setForm({...form, link: e.target.value})} />
      <textarea className="glass-input" style={{height: '100px'}} placeholder="project intent" onChange={e => setForm({...form, description: e.target.value})} />
      <textarea className="glass-input" style={{height: '100px'}} placeholder="your role" onChange={e => setForm({...form, contribution: e.target.value})} />
      <button className="elite-btn" onClick={() => onSubmit({ ...form, skill })}>verify expertise</button>
    </div>
  );
}
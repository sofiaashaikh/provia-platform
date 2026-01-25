import { useState } from 'react';

export default function ProofSubmit({ skill, onSubmit }) {
  const [form, setForm] = useState({ link: '', description: '', contribution: '' });

  return (
    <div style={{maxWidth:'600px', margin:'0 auto'}}>
      <h2 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:'10px'}}>proving {skill}</h2>
      <p style={{color:'#666', marginBottom:'40px'}}>Initialize audit sequence.</p>
      
      <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
        <input className="glass-input" placeholder="github_repository_url" onChange={e => setForm({...form, link: e.target.value})} />
        <textarea className="glass-input" style={{minHeight:'120px', resize:'none'}} placeholder="project_documentation (What did you build?)" onChange={e => setForm({...form, description: e.target.value})} />
        <textarea className="glass-input" style={{minHeight:'100px', resize:'none'}} placeholder="your_contribution" onChange={e => setForm({...form, contribution: e.target.value})} />
        
        <button className="elite-btn" onClick={() => onSubmit(form)}>RUN AUDIT</button>
      </div>
    </div>
  );
}
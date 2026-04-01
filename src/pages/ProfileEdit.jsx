import React from 'react';
import { CheckCircle, X, Terminal, Link, AlignLeft } from 'lucide-react';

export default function ProofSubmit({ skill, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      skill: skill,
      title: e.target.title.value,
      description: e.target.description.value,
      link: e.target.link.value,
    });
  };

  return (
    <div className="container-elite" style={{paddingTop: '40px'}}>
      <div style={{marginBottom: '50px'}}>
        <span className="label-mini">NEW VERIFICATION</span>
        <h1 className="title-main">Audit: <br/><span className="outline-text">{skill}</span></h1>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '30px'}}>
            <label className="label-mini"><Terminal size={12}/> PROJECT TITLE</label>
            <input className="apple-input" name="title" placeholder="e.g., Network Intrusion Detection AI" required />
          </div>

          <div style={{marginBottom: '30px'}}>
            <label className="label-mini"><Link size={12}/> REPOSITORY URL</label>
            <input className="apple-input" name="link" placeholder="https://github.com/username/project" required />
          </div>

          <div style={{marginBottom: '40px'}}>
            <label className="label-mini"><AlignLeft size={12}/> TECHNICAL DESCRIPTION</label>
            <textarea className="apple-input" name="description" placeholder="Detail the architectural logic and stack used..." rows="5" style={{height:'auto'}} required />
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <button type="submit" className="btn-elite" style={{flex: 2, display: 'flex', alignItems:'center', justifyContent:'center', gap:10}}><CheckCircle size={18}/> Initiate Audit</button>
            <button type="button" onClick={onCancel} className="btn-elite" style={{flex: 1, background: 'transparent', color: 'white', border: '1px solid var(--border)'}}><X size={18}/></button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { User, Mail, Cpu, AlignLeft, Linkedin, Github, FileUp, CheckCircle, Loader2 } from 'lucide-react';

export default function ProfileEdit({ user, onSave, onCancel }) {
  const [resumeData, setResumeData] = useState(user.resumeLink || '');
  const [name, setName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [skills, setSkills] = useState(user.skills || '');
  const [bio, setBio] = useState(user.bio || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [github, setGithub] = useState(user.github || '');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1048576) {
      alert("File too large. Please use a PDF under 1MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setResumeData(reader.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="edit-panel">
      <h2 className="provia-title" style={{fontSize: 24, marginBottom: 30}}>Identity Settings</h2>
      
      <div className="input-container">
        <p style={{fontSize: 10, opacity: 0.4, padding: '15px 20px 0', fontWeight: 800}}>DISPLAY NAME</p>
        <div style={{display: 'flex', alignItems: 'center', paddingRight: 15}}>
          <input className="glass-input" value={name} onChange={(e) => setName(e.target.value)} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}} />
          <User size={16} style={{opacity: 0.3}} />
        </div>

        <p style={{fontSize: 10, opacity: 0.4, padding: '15px 20px 0', fontWeight: 800}}>PROFESSIONAL BIO</p>
        <textarea className="glass-input" value={bio} onChange={(e) => setBio(e.target.value)} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '60px', resize: 'none'}} />

        <p style={{fontSize: 10, opacity: 0.4, padding: '15px 20px 0', fontWeight: 800}}>RESUME (PDF)</p>
        <label className="cute-upload-label" style={{margin: '10px 15px 20px'}}>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} hidden />
          {uploading ? (
            <div style={{display:'flex', gap:8, alignItems:'center'}}><Loader2 className="spinner" size={16}/> Processing...</div>
          ) : resumeData ? (
            <div style={{display:'flex', gap:8, alignItems:'center', color:'#fff'}}><CheckCircle size={16}/> Resume Ready</div>
          ) : (
            <div style={{display:'flex', gap:8, alignItems:'center', opacity:0.5}}><FileUp size={16}/> Tap to Upload PDF</div>
          )}
        </label>
      </div>

      <div style={{marginTop: 40}}>
        <button className="action-btn" onClick={() => onSave({ ...user, displayName: name, resumeLink: resumeData, email, skills, bio, linkedin, github })}>
          SAVE PROFILE
        </button>
        <p onClick={onCancel} className="auth-toggle">CANCEL</p>
      </div>
    </div>
  );
}
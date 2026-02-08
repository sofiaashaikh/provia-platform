import React, { useState } from 'react';
import { ArrowLeft, Send, Link, AlignLeft } from 'lucide-react';

export default function ProofSubmit({ skill, onSubmit }) {
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      skill,
      description,
      link,
      imageUrl: imageUrl || null
    });
  };

  return (
    <div className="proof-submit-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>Archive {skill}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <div style={{ padding: '15px 20px 0', opacity: 0.3 }}>
             <AlignLeft size={16} />
          </div>
          <textarea 
            className="glass-input" 
            placeholder="What did you build? (Short description)" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ minHeight: '120px', resize: 'none', paddingTop: '10px' }}
          />
          
          <div style={{ padding: '15px 20px 0', opacity: 0.3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
             <Link size={16} />
          </div>
          <input 
            className="glass-input" 
            type="url" 
            placeholder="Proof Link (GitHub/Drive/Live)" 
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />

          <input 
            className="glass-input" 
            type="url" 
            placeholder="Image URL (Optional Preview)" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="action-btn">
          <Send size={16} /> Confirm Verification
        </button>
      </form>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '24px', fontWeight: 600 }}>
        PROVIA SECURE LOGGING SYSTEM
      </p>
    </div>
  );
}
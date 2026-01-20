import React, { useState } from 'react';

function ProofSubmit({ selectedSkill, onFinalSubmit }) {
  const [link, setLink] = useState('');
  const [desc1, setDesc1] = useState('');
  const [desc2, setDesc2] = useState('');

  const handleSubmit = () => {
    onFinalSubmit({
      skill: selectedSkill,
      link: link,
      description: desc1,
      contribution: desc2
    });
  };

  return (
    <div className="page-container">
      <h1>proving {selectedSkill}</h1>
      <div className="proof-form">
        <input 
          placeholder="github repository link" 
          onChange={(e) => setLink(e.target.value)}
        />
        <textarea 
          placeholder="what does this project show?" 
          onChange={(e) => setDesc1(e.target.value)}
        />
        <textarea 
          placeholder="what did you personally build?" 
          onChange={(e) => setDesc2(e.target.value)}
        />
        <button className="action-btn" onClick={handleSubmit}>
          submit for verification
        </button>
      </div>
    </div>
  );
}

export default ProofSubmit;
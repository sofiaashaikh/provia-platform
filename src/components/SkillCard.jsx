// src/components/SkillCard.jsx
const SkillCard = ({ name, isSelected, onSelect }) => {
  return (
    <div 
      className={`skill-card ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
    >
      {name}
    </div>
  );
};

export default SkillCard;
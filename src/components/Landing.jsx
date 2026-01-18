// src/components/Landing.jsx
import '../styles/landing.css';

const Landing = () => {
  const handleStart = () => {
    console.log("Button clicked - intentional start");
  };

  return (
    <div className="landing-container">
      <h1 className="provia-title">provia</h1>
      <p className="provia-subtitle">stop listing skills. start proving them.</p>
      <button className="get-started-btn" onClick={handleStart}>
        get started
      </button>
    </div>
  );
};

export default Landing;
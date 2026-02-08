import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, push, onValue, update, serverTimestamp, get, query, orderByChild, equalTo } from 'firebase/database';
import Dashboard from './pages/Dashboard';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import './styles/landing.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState('Project');
  const [proofs, setProofs] = useState([]);
  const [publicProfile, setPublicProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    if (u) {
      const q = query(ref(db, 'users'), orderByChild('username'), equalTo(u.toLowerCase().trim()));
      get(q).then((snap) => {
        if (snap.exists()) {
          const uid = Object.keys(snap.val())[0];
          setPublicProfile({ uid, ...Object.values(snap.val())[0] });
          onValue(ref(db, `proofs/${uid}`), (s) => {
            const d = s.val();
            setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
          });
        }
        setLoading(false);
      });
    } else {
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          onValue(ref(db, `users/${u.uid}`), (s) => setUser({ uid: u.uid, ...s.val() }));
          onValue(ref(db, `proofs/${u.uid}`), (s) => {
            const d = s.val();
            setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
          });
        } else { setUser(null); }
        setLoading(false);
      });
      return () => unsub();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await update(ref(db, `users/${res.user.uid}`), { displayName: fullName, username: username.toLowerCase().trim(), email: email });
      } else { await signInWithEmailAndPassword(auth, email, password); }
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div style={{background:'black', height:'100vh'}} />;

  return (
    <div className="app-container">
      {!user && !publicProfile ? (
        <>
          <div className="provia-title">provia</div>
          <form onSubmit={handleAuth}>
            <div className="input-container">
              {authMode === 'signup' && (
                <>
                  <input className="glass-input" placeholder="Full Name" onChange={e => setFullName(e.target.value)} required />
                  <input className="glass-input" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                </>
              )}
              <input className="glass-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
              <input className="glass-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="action-btn">Continue</button>
            <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{textAlign:'center', fontSize:12, opacity:0.4, cursor:'pointer', marginTop:20}}>
              {authMode === 'login' ? "Create Account" : "Back to Login"}
            </p>
          </form>
        </>
      ) : (
        <>
          {user && !publicProfile && (
            <nav style={{display:'flex', justifyContent:'space-between', marginBottom:40, alignItems:'center'}}>
              <span style={{fontWeight:900, fontSize:20}} onClick={() => setScreen('dashboard')}>provia</span>
              <span style={{opacity:0.4, fontSize:12, cursor:'pointer'}} onClick={() => signOut(auth)}>Sign Out</span>
            </nav>
          )}
          {publicProfile ? ( <Dashboard user={publicProfile} proofs={proofs} readOnly={true} /> ) : (
            <>
              {screen === 'dashboard' && <Dashboard user={user} proofs={proofs} onAdd={() => setScreen('skills')} />}
              {screen === 'skills' && <SkillSelect onSelect={(s) => { setSelectedSkill(s); setScreen('submit'); }} />}
              {screen === 'submit' && <ProofSubmit skill={selectedSkill} onSubmit={(data) => {
                 push(ref(db, `proofs/${user.uid}`), { ...data, timestamp: serverTimestamp() });
                 setScreen('dashboard');
              }} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
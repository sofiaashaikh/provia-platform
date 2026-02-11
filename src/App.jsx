import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, onValue, update, push, serverTimestamp, get, query, orderByChild, equalTo } from 'firebase/database';

import Dashboard from './pages/Dashboard';
import SkillSelect from './pages/SkillSelect';
import ProofSubmit from './pages/ProofSubmit';
import ProfileEdit from './pages/ProfileEdit';
import './styles/landing.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [publicProfile, setPublicProfile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');

    if (u) {
      const q = query(ref(db, 'users'), orderByChild('username'), equalTo(u.toLowerCase().trim()));
      get(q).then((snap) => {
        if (snap.exists()) {
          const uid = Object.keys(snap.val())[0];
          const data = Object.values(snap.val())[0];
          setPublicProfile({ uid, ...data });
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
          onValue(ref(db, `users/${u.uid}`), (s) => {
            if (s.exists()) setUser({ uid: u.uid, ...s.val() });
          });
          onValue(ref(db, `proofs/${u.uid}`), (s) => {
            const d = s.val();
            setProofs(d ? Object.keys(d).map(k => ({...d[k], id: k})).reverse() : []);
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      if (authMode === 'signup') {
        const n = e.target.name.value;
        const un = e.target.username.value.toLowerCase().trim();
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await update(ref(db, `users/${res.user.uid}`), { displayName: n, username: un, email });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("AUTH_ERROR:", err.code);
      alert(err.message);
    }
  };

  if (loading) return (
    <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <h1 className="provia-title" style={{color:'#fff', fontSize:'40px', fontWeight:900}}>provia</h1>
    </div>
  );

  if (publicProfile) return (
    <div className="app-container">
      <Dashboard user={publicProfile} proofs={proofs} readOnly={true} />
    </div>
  );

  return (
    <div className="app-container">
      {!user ? (
        <div className="auth-container">
          <h1 className="provia-title">provia</h1>
          <form onSubmit={handleAuth}>
            <div className="input-container">
              {authMode === 'signup' && (
                <>
                  <input className="glass-input" name="name" placeholder="Full Name" required />
                  <input className="glass-input" name="username" placeholder="Username" required />
                </>
              )}
              <input className="glass-input" name="email" type="email" placeholder="Email" required />
              <input className="glass-input" name="password" type="password" placeholder="Password" required />
            </div>
            <button type="submit" className="action-btn">Continue</button>
            <p onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="auth-toggle">
              {authMode === 'login' ? "CREATE ACCOUNT" : "BACK TO LOGIN"}
            </p>
          </form>
        </div>
      ) : (
        <>
          {screen === 'dashboard' && (
            <Dashboard 
              user={user} 
              proofs={proofs} 
              onAdd={() => setScreen('skills')} 
              onEdit={() => setScreen('edit')}
              onSignOut={() => signOut(auth)}
            />
          )}
          {screen === 'skills' && <SkillSelect onSelect={(s) => { setSelectedSkill(s); setScreen('submit'); }} />}
          {screen === 'submit' && (
            <ProofSubmit 
              skill={selectedSkill} 
              onSubmit={(d) => {
                push(ref(db, `proofs/${user.uid}`), { ...d, timestamp: serverTimestamp() });
                setScreen('dashboard');
              }} 
            />
          )}
          {screen === 'edit' && (
            <ProfileEdit 
              user={user} 
              onCancel={() => setScreen('dashboard')} 
              onSave={async (d) => {
                await update(ref(db, `users/${user.uid}`), d);
                setScreen('dashboard');
              }} 
            />
          )}
        </>
      )}
    </div>
  );
}
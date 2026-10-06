"use client";

import { useEffect, useState } from "react";
import { signInWithGoogle, logout, onAuth } from "../lib/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => onAuth(async (u) => {
    setUser(u);
    if (!u) { setProfile(null); return; }
    const res = await fetch("/api/profile", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({firebaseUid:u.uid,email:u.email})
    });
    if (res.ok) setProfile(await res.json());
  }), []);

  async function saveName() {
    const res = await fetch("/api/profile", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({firebaseUid:user.uid,email:user.email,displayName:name})
    });
    const data = await res.json();
    if (res.ok) setProfile(data);
    else setStatus(data.error || "Something went wrong");
  }

  if (!user) return <main className="center"><section className="card">
    <div className="logo">🎲</div><h1>Zaid Ludo</h1>
    <p>Play online Ludo with 2, 3 or 4 players.</p>
    <button onClick={signInWithGoogle}>Continue with Google</button>
  </section></main>;

  if (!profile?.displayName) return <main className="center"><section className="card">
    <div className="logo">👋</div><h1>Welcome</h1>
    <p>Choose your display name to create your Ludo account.</p>
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Display name" maxLength={20}/>
    <button onClick={saveName} disabled={!name.trim()}>Create account</button>
    {status && <p className="error">{status}</p>}
  </section></main>;

  return <main className="dashboard">
    <header><div><h1>🎲 Zaid Ludo</h1><p>Welcome, {profile.displayName}</p></div>
      <button className="ghost" onClick={logout}>Logout</button></header>
    <section className="card"><h2>Your UID</h2><code>{profile.uid}</code>
      <p>Use your UID or display name to find friends.</p></section>
    <section className="grid">
      <div className="card"><h2>👥 Friends</h2><p>Search players and send or accept friend requests.</p><button disabled>Friends — Coming next</button></div>
      <div className="card"><h2>🎮 Ludo</h2><p>Create a 2–4 player room and invite your friends.</p><button disabled>Play — Coming next</button></div>
    </section>
  </main>;
}

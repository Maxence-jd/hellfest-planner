import React from 'react';
import { supabase } from '../../lib/supabase';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) setMessage(result.error.message);
    else if (mode === 'signup') setMessage('Compte créé. Vérifie ton email si demandé.');
  }

  if (loading) return <div className="authPage">Chargement...</div>;

  if (!user) {
    return (
      <div className="authPage">
        <div className="authCard">
          <img src="/logo-fr.png" className="authLogo" />
          <h1>Hellfest Planner</h1>
          <p>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</p>

          <form onSubmit={submit}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required />
            <button type="submit">{mode === 'login' ? 'Se connecter' : 'Créer le compte'}</button>
          </form>

          {message && <small>{message}</small>}

          <button className="authSwitch" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Créer un compte' : 'Déjà un compte ? Connexion'}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
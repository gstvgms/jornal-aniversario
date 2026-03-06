'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase-client';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const supabaseInstance = supabase;
    supabaseInstance.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabaseInstance.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <header className="bg-ink text-paper py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide hover:opacity-80 transition-opacity">
            📰 Jornal Histórico
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/gerar" className="text-sm hover:underline">
              Gerar Jornal
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm hover:underline">
                  Meus Jornais
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm bg-paper text-ink px-3 py-1 rounded hover:bg-paper-dark transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm bg-paper text-ink px-4 py-1.5 rounded hover:bg-paper-dark transition-colors font-medium"
              >
                Entrar
              </button>
            )}
          </nav>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

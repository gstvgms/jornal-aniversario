'use client';
import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Login realizado com sucesso!');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Conta criada! Verifique seu e-mail.');
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-lg shadow-2xl w-full max-w-md p-8 relative border-2 border-ink">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink/60 hover:text-ink text-2xl leading-none"
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="font-serif text-2xl font-bold text-ink mb-6 text-center">
          {tab === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}
        </h2>

        {/* Tabs */}
        <div className="flex border-b border-ink/20 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'login' ? 'border-ink text-ink' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'register' ? 'border-ink text-ink' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/30 rounded px-3 py-2 bg-white/50 focus:outline-none focus:border-ink text-ink"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-ink/30 rounded px-3 py-2 bg-white/50 focus:outline-none focus:border-ink text-ink"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-2.5 rounded font-medium hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-paper text-ink/50">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full border border-ink/30 bg-white/50 text-ink py-2.5 rounded font-medium hover:bg-white/80 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>
      </div>
    </div>
  );
}

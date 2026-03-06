'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthModal from './AuthModal';
import { createSupabaseClient } from '@/lib/supabase-client';

const NOMES_JORNAL = [
  'Jornal do Aniversário',
  'O Diário do Dia',
  'Folha Histórica',
  'Gazeta do Passado',
  'O Mensageiro',
  'Tribuna Histórica',
  'Diário Nacional',
];

export default function FormGerarJornal() {
  const router = useRouter();
  const [nomeJornal, setNomeJornal] = useState(NOMES_JORNAL[0]);
  const [nomeCustom, setNomeCustom] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [nomeAniversariante, setNomeAniversariante] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idioma, setIdioma] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const supabase = createSupabaseClient();

  const handleNomeJornalChange = (value: string) => {
    if (value === 'outro') {
      setIsCustom(true);
      setNomeJornal('');
    } else {
      setIsCustom(false);
      setNomeJornal(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuth(true);
      return;
    }

    const finalNome = isCustom ? nomeCustom : nomeJornal;
    if (!finalNome.trim()) {
      toast.error('Por favor, insira o nome do jornal.');
      return;
    }

    // Parse date DD/MM/YYYY
    const parts = dataNascimento.split('/');
    if (parts.length !== 3) {
      toast.error('Data inválida. Use o formato DD/MM/AAAA.');
      return;
    }
    const [dd, mm, yyyy] = parts;
    const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) {
      toast.error('Data inválida.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('O jornal está sendo impresso... Aguarde ~30-60 segundos 🗞️');

    try {
      const res = await fetch('/api/gerar-jornal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeJornal: finalNome,
          nomeAniversariante,
          dataNascimento: isoDate,
          idioma,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao gerar jornal');
      }

      const { id } = await res.json();
      toast.success('Jornal gerado com sucesso!', { id: toastId });
      router.push(`/preview/${id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar jornal';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        {/* Nome do jornal */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Nome do Jornal
          </label>
          <select
            value={isCustom ? 'outro' : nomeJornal}
            onChange={(e) => handleNomeJornalChange(e.target.value)}
            className="w-full border-2 border-ink/30 rounded px-3 py-2.5 bg-paper focus:outline-none focus:border-ink text-ink font-body"
          >
            {NOMES_JORNAL.map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
            <option value="outro">Outro (digitar)</option>
          </select>
          {isCustom && (
            <input
              type="text"
              value={nomeCustom}
              onChange={(e) => setNomeCustom(e.target.value)}
              placeholder="Digite o nome do jornal..."
              className="mt-2 w-full border-2 border-ink/30 rounded px-3 py-2.5 bg-paper focus:outline-none focus:border-ink text-ink"
            />
          )}
        </div>

        {/* Nome do aniversariante */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Nome do Aniversariante
          </label>
          <input
            type="text"
            value={nomeAniversariante}
            onChange={(e) => setNomeAniversariante(e.target.value)}
            required
            placeholder="Ex: Maria Silva"
            className="w-full border-2 border-ink/30 rounded px-3 py-2.5 bg-paper focus:outline-none focus:border-ink text-ink"
          />
          <p className="text-xs text-ink/50 mt-1">Aparecerá na manchete: &quot;NASCE MARIA SILVA&quot;</p>
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Data de Nascimento
          </label>
          <input
            type="text"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(formatDate(e.target.value))}
            required
            placeholder="DD/MM/AAAA"
            maxLength={10}
            className="w-full border-2 border-ink/30 rounded px-3 py-2.5 bg-paper focus:outline-none focus:border-ink text-ink font-mono"
          />
        </div>

        {/* Idioma */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Idioma
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="pt"
                checked={idioma === 'pt'}
                onChange={() => setIdioma('pt')}
                className="text-ink"
              />
              <span className="text-sm">🇧🇷 Português (PT)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="en"
                checked={idioma === 'en'}
                onChange={() => setIdioma('en')}
                className="text-ink"
              />
              <span className="text-sm">🇺🇸 English (EN)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-4 rounded text-lg font-serif font-bold hover:bg-ink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span>
              Imprimindo o jornal...
            </>
          ) : (
            <>📰 Gerar Meu Jornal</>
          )}
        </button>
      </form>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            // Re-submit after auth
            const form = document.querySelector('form');
            form?.requestSubmit();
          }}
        />
      )}
    </>
  );
}

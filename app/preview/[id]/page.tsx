'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase-client';
import JornalPreview from '@/components/JornalPreview';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import type { Jornal } from '@/types';

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const [jornal, setJornal] = useState<Jornal | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const fetchJornal = async () => {
      const { data, error } = await supabase
        .from('jornais')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Jornal não encontrado.');
        router.push('/gerar');
        return;
      }
      setJornal(data);
      setLoading(false);
    };

    fetchJornal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Pagamento confirmado! Seu PDF está sendo gerado.');
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jornalId: id }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar pagamento';
      toast.error(message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🗞️</div>
            <h2 className="font-serif text-2xl font-bold mb-2">O jornal está sendo impresso...</h2>
            <p className="text-ink/60 font-body">Aguarde enquanto preparamos sua edição especial.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!jornal) return null;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />

      {/* Mobile warning */}
      <div className="md:hidden bg-amber-50 border-b border-amber-300 px-4 py-3 text-sm text-amber-800">
        📱 Para melhor experiência do jornal, visualize no desktop.
      </div>

      {/* Action bar */}
      <div className="no-print bg-[#ede8db] border-b-2 border-ink sticky top-0 z-20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-lg">{jornal.nome_jornal}</h1>
            <p className="text-xs text-ink/60">
              {jornal.nome_aniversariante} — {new Date(jornal.data_nascimento).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 border-2 border-ink text-ink rounded font-medium text-sm hover:bg-ink/10 transition-colors"
            >
              🔗 Compartilhar preview
            </button>
            {jornal.status === 'pago' && jornal.pdf_url ? (
              <a
                href={jornal.pdf_url}
                download
                className="px-6 py-2 bg-green-700 text-white rounded font-bold text-sm hover:bg-green-800 transition-colors"
              >
                ⬇️ Baixar PDF
              </a>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="px-6 py-2 bg-ink text-paper rounded font-bold text-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? '⏳ Aguarde...' : '💳 Baixar PDF — R$ 9,90'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="mb-4 text-center">
          {jornal.status !== 'pago' && (
            <p className="text-xs text-ink/50 font-body">
              ⚠️ Preview com marca d&apos;água. Compre o PDF para a versão completa sem marca d&apos;água.
            </p>
          )}
        </div>
        <JornalPreview jornal={jornal} watermark={jornal.status !== 'pago'} />
      </main>

      <Footer />
    </div>
  );
}

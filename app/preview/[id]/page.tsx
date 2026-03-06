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
  const [checkoutLoading, setCheckoutLoading] = useState<'digital' | 'impressao' | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();
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
  }, [id, router]);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'digital') {
      toast.success('🎉 Download disponível! Sua imagem está pronta.');
    } else if (success === 'impressao') {
      toast.success('🎉 PDF pronto! Leve a qualquer gráfica para imprimir em papel de jornal.');
    }
  }, [searchParams]);

  const handleCheckout = async (tipo: 'digital' | 'impressao') => {
    setCheckoutLoading(tipo);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jornalId: id, tipo }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar pagamento';
      toast.error(message);
    } finally {
      setCheckoutLoading(null);
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

  const isPago = jornal?.status === 'pago_digital' || jornal?.status === 'pago_impressao';
  const hasPngDownload = !!(jornal?.imagem_url);
  const hasPdfDownload = !!(jornal?.pdf_url);

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
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif font-bold text-lg">{jornal.nome_jornal}</h1>
            <p className="text-xs text-ink/60">
              {jornal.nome_aniversariante} — {new Date(jornal.data_nascimento).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleShare}
              className="px-4 py-2 border-2 border-ink text-ink rounded font-medium text-sm hover:bg-ink/10 transition-colors"
            >
              🔗 Compartilhar preview
            </button>
            {hasPngDownload && (
              <a
                href={jornal.imagem_url!}
                download
                className="px-6 py-2 bg-green-700 text-white rounded font-bold text-sm hover:bg-green-800 transition-colors"
              >
                ⬇️ Baixar Imagem PNG
              </a>
            )}
            {hasPdfDownload && (
              <a
                href={jornal.pdf_url!}
                download
                className="px-6 py-2 bg-blue-700 text-white rounded font-bold text-sm hover:bg-blue-800 transition-colors"
              >
                ⬇️ Baixar PDF para Impressão
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Preview with overlay when not paid */}
      <main className="flex-1 p-6 overflow-x-auto relative">
        {!isPago ? (
          <div className="relative">
            {/* Blurred journal */}
            <div style={{ filter: 'blur(6px)', opacity: 0.5, pointerEvents: 'none' }}>
              <JornalPreview jornal={jornal} watermark={true} />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="bg-white border-2 border-ink rounded-lg shadow-2xl p-8 max-w-lg w-full mx-4 text-center"
                style={{ backdropFilter: 'blur(2px)' }}
              >
                <div className="text-4xl mb-3">🗞️</div>
                <h2 className="font-serif text-2xl font-bold mb-2">Seu Jornal Histórico está pronto!</h2>
                <p className="text-ink/70 text-sm mb-6 font-body">
                  Desbloqueie para ver, baixar e compartilhar:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* Digital */}
                  <button
                    onClick={() => handleCheckout('digital')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-center p-4 border-2 border-ink rounded-lg hover:bg-ink/5 transition-colors disabled:opacity-50"
                  >
                    <span className="text-2xl mb-1">💾</span>
                    <span className="font-serif font-bold text-lg">Digital</span>
                    <span className="text-green-700 font-bold text-xl">R$ 9,90</span>
                    <span className="text-xs text-ink/60 mt-1">Imagem PNG • Download imediato</span>
                  </button>

                  {/* Impressão */}
                  <div className="relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap z-10">
                      Melhor Presente
                    </span>
                    <button
                      onClick={() => handleCheckout('impressao')}
                      disabled={checkoutLoading !== null}
                      className="w-full flex flex-col items-center p-4 border-2 border-amber-500 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                    >
                      <span className="text-2xl mb-1">🖨️</span>
                      <span className="font-serif font-bold text-lg">Impressão Profissional</span>
                      <span className="text-amber-700 font-bold text-xl">R$ 29,90</span>
                      <span className="text-xs text-ink/60 mt-1">PDF Tablóide • Para gráfica</span>
                    </button>
                  </div>
                </div>

                {checkoutLoading && (
                  <p className="text-sm text-ink/60 mb-4">⏳ Redirecionando para o pagamento...</p>
                )}

                <div className="flex justify-center gap-4 text-xs text-ink/50">
                  <span>✅ Entrega imediata</span>
                  <span>✅ Sem assinatura</span>
                  <span>✅ Pagamento seguro</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <JornalPreview jornal={jornal} watermark={false} />
        )}
      </main>

      <Footer />
    </div>
  );
}


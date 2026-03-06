import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/gerar');
  }

  const { data: jornais, error } = await supabase
    .from('jornais')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-2 border-double border-ink pb-6 mb-8">
            <h1 className="font-serif text-4xl font-bold">Meus Jornais</h1>
            <p className="text-ink/60 font-body mt-2">
              Seus jornais históricos gerados — {jornais?.length || 0} no total
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded p-4 mb-6 text-red-800">
              Erro ao carregar jornais. Por favor, tente novamente.
            </div>
          )}

          {!jornais?.length ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="font-serif text-2xl font-bold mb-2">Nenhum jornal ainda</h2>
              <p className="text-ink/60 font-body mb-6">
                Gere seu primeiro jornal histórico personalizado!
              </p>
              <Link
                href="/gerar"
                className="inline-block bg-ink text-paper px-8 py-3 rounded font-serif font-bold hover:bg-ink/80 transition-colors"
              >
                📰 Gerar meu primeiro jornal
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jornais.map((jornal) => (
                <div key={jornal.id} className="border-2 border-ink bg-[#f5f0e8] rounded shadow-md overflow-hidden">
                  {/* Thumbnail header */}
                  <div className="bg-ink text-paper p-4">
                    <div className="text-[10px] uppercase tracking-wider mb-1 opacity-60">Edição Especial</div>
                    <h3 className="font-serif font-bold text-lg leading-tight">{jornal.nome_jornal}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-body text-ink/80 mb-1">
                      <span className="font-bold">Aniversariante:</span> {jornal.nome_aniversariante}
                    </p>
                    <p className="text-sm font-body text-ink/80 mb-3">
                      <span className="font-bold">Data:</span>{' '}
                      {new Date(jornal.data_nascimento).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          jornal.status === 'pago'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : jornal.status === 'processando'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {jornal.status === 'pago'
                          ? '✅ Disponível para download'
                          : jornal.status === 'processando'
                          ? '⏳ Processando'
                          : '👁️ Preview'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/preview/${jornal.id}`}
                        className="flex-1 text-center text-xs border border-ink rounded py-1.5 hover:bg-ink hover:text-paper transition-colors font-medium"
                      >
                        Ver preview
                      </Link>
                      {jornal.status === 'pago' && jornal.pdf_url && (
                        <a
                          href={jornal.pdf_url}
                          download
                          className="flex-1 text-center text-xs bg-green-700 text-white rounded py-1.5 hover:bg-green-800 transition-colors font-medium"
                        >
                          Baixar PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/gerar"
              className="inline-block bg-ink text-paper px-8 py-3 rounded font-serif font-bold hover:bg-ink/80 transition-colors"
            >
              📰 Gerar novo jornal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

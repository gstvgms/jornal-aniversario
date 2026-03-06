import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FormGerarJornal from '@/components/FormGerarJornal';

export const dynamic = 'force-dynamic';

export default function GerarPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-10 border-b-2 border-double border-ink pb-6">
            <div className="text-xs tracking-[0.3em] uppercase text-ink/60 mb-3">— Jornal Histórico —</div>
            <h1 className="font-serif text-4xl font-bold mb-3">Gerar Meu Jornal</h1>
            <p className="text-ink/70 font-body">
              Preencha os dados abaixo e receba seu jornal personalizado estilo vintage em instantes.
            </p>
          </div>

          {/* Mobile warning */}
          <div className="md:hidden bg-amber-50 border border-amber-300 rounded p-4 mb-6 text-sm text-amber-800">
            📱 Para melhor experiência, visualize o jornal no desktop. O formato é otimizado para telas maiores.
          </div>

          <FormGerarJornal />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />

      {/* Hero */}
      <main className="flex-1">
        <section className="py-24 px-6 text-center border-b-2 border-double border-ink">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs tracking-[0.3em] uppercase text-ink/60 mb-4 font-body">
              — Edição Especial de Aniversário —
            </div>
            <h1
              className="font-serif font-black mb-6 leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Descubra o que aconteceu
              <br />
              <span className="italic">no dia em que você nasceu</span>
            </h1>
            <p className="text-lg text-ink/70 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
              Receba um jornal personalizado estilo vintage com notícias históricas geradas por IA
              sobre o dia exato do seu nascimento — o presente perfeito para você ou quem você ama.
            </p>
            <Link
              href="/gerar"
              className="inline-block bg-ink text-paper px-10 py-4 text-xl font-serif font-bold rounded hover:bg-ink/80 transition-colors shadow-lg"
            >
              📰 Gerar Meu Jornal
            </Link>
            <p className="mt-4 text-sm text-ink/50">Primeiro preview gratuito • Download em PDF por R$ 9,90</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-[#ede8db]">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Como funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 'I',
                  title: 'Informe os dados',
                  desc: 'Digite a data de nascimento, o nome do aniversariante e escolha o nome do jornal.',
                  icon: '✍️',
                },
                {
                  step: 'II',
                  title: 'IA gera o jornal',
                  desc: 'Nossa IA pesquisa eventos históricos da época e cria um jornal vintage personalizado em ~30 segundos.',
                  icon: '🤖',
                },
                {
                  step: 'III',
                  title: 'Baixe e compartilhe',
                  desc: 'Faça o download do PDF em alta resolução para imprimir ou compartilhar digitalmente.',
                  icon: '🗞️',
                },
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center mx-auto mb-4 font-serif text-xl font-bold">
                    {step}
                  </div>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
                  <p className="text-ink/70 font-body text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Um presente único e memorável</h2>
            <p className="text-ink/70 font-body mb-10 max-w-2xl mx-auto">
              Imagine presentear alguém com um jornal do dia em que nasceu — manchetes históricas,
              fotos da época, horóscopo, anúncios retrô e até a lista de músicas mais tocadas.
              Tudo com o nome dela na manchete principal.
            </p>

            {/* Fake newspaper preview */}
            <div
              className="border-2 border-black bg-[#f5f0e8] p-4 max-w-2xl mx-auto shadow-2xl text-left"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <div className="border-b border-black pb-1 mb-1 flex justify-between text-[10px]">
                <span>Edição Especial — Ano MCMLXXX — N.° 4521</span>
                <span>Segunda-feira, 15 de setembro de 1980</span>
                <span>Preço R$ 1,20</span>
              </div>
              <div className="text-center border-b-4 border-double border-black pb-2 mb-2">
                <h1 className="font-black text-4xl uppercase tracking-tight">Jornal do Aniversário</h1>
              </div>
              <div className="text-center border-b-2 border-black pb-2 mb-2">
                <h2 className="text-2xl font-black uppercase tracking-widest">NASCE: MARIA SILVA</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px]">
                <div className="border-r border-black pr-3">
                  <div className="font-bold text-[11px] mb-1">Mundo celebra nova vida</div>
                  <p className="text-justify">Nesta data histórica, em meio a grandes acontecimentos mundiais, uma nova história começa...</p>
                </div>
                <div className="border-r border-black px-3">
                  <div className="font-bold text-[11px] mb-1">Principais eventos do ano</div>
                  <ul className="space-y-0.5">
                    <li>◆ Economia global em transformação</li>
                    <li>◆ Avanços na tecnologia surpreendem</li>
                    <li>◆ Cultura pop domina o mundo</li>
                  </ul>
                </div>
                <div className="pl-3">
                  <div className="font-bold text-[11px] mb-1">Horóscopo — Virgem</div>
                  <p className="text-justify">Os astros anunciam um destino brilhante para quem nasce sob este signo...</p>
                </div>
              </div>
            </div>

            <Link
              href="/gerar"
              className="inline-block mt-10 bg-ink text-paper px-8 py-3 text-lg font-serif font-bold rounded hover:bg-ink/80 transition-colors"
            >
              Criar o meu agora →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

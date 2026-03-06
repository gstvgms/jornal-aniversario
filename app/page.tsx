import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero — dark, impactful */}
        <section
          className="py-28 px-6 text-center"
          style={{ background: '#1a1008', color: '#f5f0e8' }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="text-xs tracking-[0.3em] uppercase mb-6 font-body"
              style={{ color: '#c9b47a' }}
            >
              — Edição Especial de Aniversário —
            </div>
            <h1
              className="font-serif font-black mb-6 leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#f5f0e8' }}
            >
              O presente que ninguém
              <br />
              <span className="italic" style={{ color: '#c9b47a' }}>
                vai esquecer.
              </span>
            </h1>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto font-body leading-relaxed"
              style={{ color: '#c8bda6' }}
            >
              Receba um jornal histórico do dia em que alguém nasceu — com notícias reais da época,
              impressão em papel de jornal e o nome do aniversariante na manchete principal.
            </p>
            <Link
              href="/gerar"
              className="inline-block px-10 py-4 text-xl font-serif font-bold rounded shadow-lg transition-opacity hover:opacity-90"
              style={{ background: '#c9b47a', color: '#1a1008' }}
            >
              🗞️ Criar meu Jornal Agora
            </Link>
            <p className="mt-4 text-sm" style={{ color: '#7a6a54' }}>
              Preview gratuito · Digital a partir de R$ 9,90 · Impressão a partir de R$ 29,90
            </p>
          </div>
        </section>

        {/* Social proof */}
        <section
          className="py-5 px-6 text-center border-b border-ink/20"
          style={{ background: '#f5f0e8' }}
        >
          <p className="text-sm font-body text-ink/60 tracking-wide">
            Mais de 1.200 jornais criados &nbsp;·&nbsp; Presente favorito de aniversário &nbsp;·&nbsp; Entrega digital imediata
          </p>
        </section>

        {/* For whom */}
        <section className="py-20 px-6 bg-paper">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Para quem você vai presentear?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🎂', title: 'Aniversariante', desc: 'Qualquer idade — do primeiro ao centésimo aniversário.' },
                { icon: '👴', title: 'Avós e idosos', desc: 'Um mergulho emocional nas memórias de quem viveu a história.' },
                { icon: '💑', title: 'Casal', desc: 'Surpreenda no aniversário de namoro ou casamento.' },
                { icon: '🍼', title: 'Bebê recém-nascido', desc: 'O jornal do dia em que um novo amor chegou ao mundo.' },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="text-center p-6 border border-ink/15 rounded-lg bg-[#faf7f1] hover:shadow-md transition-shadow"
                >
                  <div className="text-5xl mb-3">{icon}</div>
                  <h3 className="font-serif text-lg font-bold mb-2">{title}</h3>
                  <p className="text-sm text-ink/60 font-body leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6" style={{ background: '#ede8db' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Como funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  icon: '📅',
                  title: 'Digite a data',
                  desc: 'Informe a data de nascimento e o nome de quem vai receber o presente.',
                },
                {
                  step: '2',
                  icon: '🗞️',
                  title: 'Personalizamos tudo',
                  desc: 'Criamos um jornal histórico completo com notícias reais da época em segundos.',
                },
                {
                  step: '3',
                  icon: '🖨️',
                  title: 'Receba e imprima',
                  desc: 'Baixe a imagem para compartilhar ou o PDF para imprimir em papel de jornal.',
                },
              ].map(({ step, icon, title, desc }) => (
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

        {/* Pricing */}
        <section className="py-20 px-6 bg-paper">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Escolha como quer receber
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Digital */}
              <div className="border-2 border-ink/20 rounded-lg p-8 bg-[#faf7f1]">
                <div className="text-3xl mb-3">💾</div>
                <h3 className="font-serif text-2xl font-bold mb-1">Digital</h3>
                <p className="text-3xl font-black text-green-700 mb-5">R$ 9,90</p>
                <ul className="space-y-2 text-sm font-body text-ink/80 mb-6">
                  <li>✅ Imagem PNG em alta resolução</li>
                  <li>✅ Download imediato</li>
                  <li>✅ Para compartilhar no WhatsApp/Instagram</li>
                  <li>✅ Imprime em casa</li>
                </ul>
                <Link
                  href="/gerar"
                  className="block text-center px-6 py-3 border-2 border-ink text-ink font-bold rounded hover:bg-ink hover:text-paper transition-colors"
                >
                  Criar Agora
                </Link>
              </div>

              {/* Impressão */}
              <div className="relative border-2 border-amber-500 rounded-lg p-8 bg-amber-50">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Mais Popular
                </span>
                <div className="text-3xl mb-3">🖨️</div>
                <h3 className="font-serif text-2xl font-bold mb-1">Impressão Profissional</h3>
                <p className="text-3xl font-black text-amber-700 mb-5">R$ 29,90</p>
                <ul className="space-y-2 text-sm font-body text-ink/80 mb-6">
                  <li>✅ PDF otimizado para gráfica</li>
                  <li>✅ Formato Tablóide (28×43cm)</li>
                  <li>✅ 300 DPI — qualidade profissional</li>
                  <li>✅ Leve a qualquer gráfica e imprima em papel de jornal</li>
                </ul>
                <Link
                  href="/gerar"
                  className="block text-center px-6 py-3 font-bold rounded transition-colors"
                  style={{ background: '#c9b47a', color: '#1a1008' }}
                >
                  Criar Agora
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6" style={{ background: '#ede8db' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              O que dizem quem já deu de presente
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: 'Dei de aniversário pro meu pai de 70 anos. Ele chorou quando viu o jornal do dia que nasceu.',
                  author: 'Mariana S.',
                  city: 'São Paulo',
                },
                {
                  quote: 'Comprei pra minha namorada no aniversário de namoro. Foi o presente mais criativo que já dei.',
                  author: 'Carlos R.',
                  city: 'Belo Horizonte',
                },
                {
                  quote: 'Minha mãe ficou sem palavras. Ela nunca tinha visto nada assim.',
                  author: 'Fernanda L.',
                  city: 'Porto Alegre',
                },
              ].map(({ quote, author, city }) => (
                <div key={author} className="bg-paper p-6 rounded-lg border border-ink/10 shadow-sm">
                  <p className="font-body text-ink/80 italic mb-4 leading-relaxed">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <p className="font-serif font-bold text-sm">
                    {author} <span className="font-normal text-ink/50">— {city}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-24 px-6 text-center"
          style={{ background: '#1a1008', color: '#f5f0e8' }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-serif font-black mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f5f0e8' }}
            >
              Não deixe esse aniversário passar em branco.
            </h2>
            <Link
              href="/gerar"
              className="inline-block px-10 py-4 text-xl font-serif font-bold rounded shadow-lg transition-opacity hover:opacity-90"
              style={{ background: '#c9b47a', color: '#1a1008' }}
            >
              Criar meu Jornal Agora →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


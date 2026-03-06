import { ConteudoJornal } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import Image from 'next/image';

interface JornalLayoutProps {
  jornal: {
    nome_jornal: string;
    nome_aniversariante: string;
    data_nascimento: string;
    conteudo_json: ConteudoJornal;
    imagens_urls: string[] | null;
    idioma: string;
  };
  watermark?: boolean;
}

function deterministicEditionNumber(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 9000) + 1000;
}

function toRoman(num: number): string {
  const values = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const symbols = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  return result;
}

export default function JornalLayout({ jornal, watermark = false }: JornalLayoutProps) {
  const { nome_jornal, nome_aniversariante, data_nascimento, conteudo_json, imagens_urls, idioma } = jornal;
  const { manchete, noticias, horoscopo, anuncio, musicas } = conteudo_json;

  const locale = idioma === 'en' ? enUS : ptBR;
  const dataObj = parseISO(data_nascimento);
  const dataExtenso = format(dataObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale });
  const dataExtensoEn = format(dataObj, "EEEE, MMMM do, yyyy", { locale });
  const dataDisplay = idioma === 'en' ? dataExtensoEn : dataExtenso;
  const anoRomano = toRoman(dataObj.getFullYear());
  const numeroEdicao = deterministicEditionNumber(data_nascimento + nome_jornal);

  const [n1, n2, n3, n4, n5] = noticias;
  const imgs = imagens_urls || [];

  return (
    <div
      className="relative bg-[#f5f0e8] text-[#1a1a1a] font-serif"
      style={{
        width: '1120px',
        minHeight: '793px',
        padding: '20px 24px',
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: '11px',
        lineHeight: '1.5',
      }}
    >
      {watermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ transform: 'rotate(-30deg)' }}
        >
          <span
            style={{
              fontSize: '48px',
              color: 'rgba(0,0,0,0.10)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              letterSpacing: '4px',
              userSelect: 'none',
            }}
          >
            JORNAL HISTÓRICO — jornalaniversario.com.br
          </span>
        </div>
      )}

      {/* Header */}
      <div className="border-t-2 border-b border-black pt-1 pb-1 mb-1">
        <div className="flex justify-between items-center text-[9px]">
          <span>Edição Especial — Ano {anoRomano} — N.° {numeroEdicao}</span>
          <span className="capitalize">{dataDisplay}</span>
          <span>{idioma === 'en' ? 'Price $ 1.20' : 'Preço R$ 1,20'}</span>
        </div>
      </div>

      {/* Masthead */}
      <div className="text-center border-b-4 border-double border-black pb-2 mb-2">
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '52px',
            fontWeight: '900',
            lineHeight: 1,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
          }}
        >
          {nome_jornal}
        </h1>
        <div className="border-t border-black mt-1 pt-1">
          <p className="text-[10px] tracking-widest uppercase">
            {idioma === 'en' ? 'Special Birthday Edition' : 'Edição Especial de Aniversário'} — {format(dataObj, 'yyyy')}
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          {manchete || `${idioma === 'en' ? 'BORN' : 'NASCE'}: ${nome_aniversariante.toUpperCase()}`}
        </h2>
        {n1 && (
          <p className="text-[10px] mt-1 italic">{n1.subtitulo}</p>
        )}
      </div>

      {/* Main content - 3 columns */}
      <div className="flex gap-0 border-b border-black pb-3 mb-3">
        {/* Left column 25% */}
        <div className="w-[25%] pr-3 border-r border-black">
          {n1 && (
            <article className="mb-4">
              <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">{n1.categoria}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '14px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '4px',
                }}
              >
                {n1.titulo}
              </h3>
              <p className="text-[9px] italic text-gray-700 mb-1">{n1.subtitulo}</p>
              <div className="text-[9px] leading-[1.5] text-justify">
                {n1.corpo.split('\n').map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>
            </article>
          )}

          {n2 && (
            <article className="border-t border-black pt-3">
              <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">{n2.categoria}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '4px',
                }}
              >
                {n2.titulo}
              </h3>
              <p className="text-[9px] italic text-gray-700 mb-1">{n2.subtitulo}</p>
              <div className="text-[9px] leading-[1.5] text-justify">
                {n2.corpo.split('\n').slice(0, 3).map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>
            </article>
          )}
        </div>

        {/* Center column 50% */}
        <div className="w-[50%] px-4 border-r border-black">
          {/* Main image */}
          {imgs[0] && (
            <div className="mb-3 border border-black">
              <div className="relative w-full" style={{ height: '200px' }}>
                <Image
                  src={imgs[0]}
                  alt={n1?.titulo || 'Foto histórica'}
                  fill
                  className="object-cover"
                  style={{ filter: 'grayscale(80%) sepia(20%)' }}
                />
              </div>
              <p className="text-[8px] text-center italic p-1 bg-[#ede8db] border-t border-black">
                {n1?.subtitulo}
              </p>
            </div>
          )}

          {/* Principais notícias */}
          <div className="border border-black p-2 mb-3 bg-[#ede8db]">
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                textAlign: 'center',
                borderBottom: '1px solid #1a1a1a',
                paddingBottom: '2px',
                marginBottom: '4px',
              }}
            >
              {idioma === 'en' ? 'Main news of this year' : 'Principais notícias deste ano'}
            </h4>
            <ul className="text-[9px] space-y-1">
              {noticias.map((n, i) => (
                <li key={i} className="flex gap-1">
                  <span className="font-bold">◆</span>
                  <span>{n.titulo}</span>
                </li>
              ))}
            </ul>
          </div>

          {n3 && (
            <article>
              <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">{n3.categoria}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '4px',
                }}
              >
                {n3.titulo}
              </h3>
              <p className="text-[9px] italic text-gray-700 mb-1">{n3.subtitulo}</p>
              <div className="text-[9px] leading-[1.5] text-justify columns-2 gap-3">
                {n3.corpo.split('\n').map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>
            </article>
          )}
        </div>

        {/* Right column 25% */}
        <div className="w-[25%] pl-3">
          {n4 && (
            <article className="mb-4">
              <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">{n4.categoria}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '4px',
                }}
              >
                {n4.titulo}
              </h3>
              <div className="text-[9px] leading-[1.5] text-justify">
                {n4.corpo.split('\n').slice(0, 2).map((p, i) => (
                  <p key={i} className="mb-1">{p}</p>
                ))}
              </div>
            </article>
          )}

          {/* Horoscopo */}
          {horoscopo && (
            <div className="border border-black p-2 mb-3 bg-[#ede8db]">
              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '11px',
                  fontWeight: '700',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #1a1a1a',
                  paddingBottom: '2px',
                  marginBottom: '4px',
                }}
              >
                {idioma === 'en' ? 'Horoscope' : 'Horóscopo'} — {horoscopo.signo}
              </h4>
              <p className="text-[9px] leading-relaxed text-justify">{horoscopo.texto}</p>
            </div>
          )}

          {/* Ad */}
          {anuncio && (
            <div className="border-2 border-double border-black p-2 text-center">
              <div className="border border-black p-2">
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {anuncio.nome_produto}
                </p>
                <p className="text-[10px] italic my-1">&ldquo;{anuncio.slogan}&rdquo;</p>
                <p className="text-[8px] text-justify">{anuncio.descricao}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex gap-4">
        {/* Musicas */}
        {musicas && musicas.length > 0 && (
          <div className="w-[35%] border border-black p-2 bg-[#ede8db]">
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                textAlign: 'center',
                borderBottom: '1px solid #1a1a1a',
                paddingBottom: '2px',
                marginBottom: '4px',
              }}
            >
              {idioma === 'en' ? 'Most requested songs' : 'Músicas mais pedidas'}
            </h4>
            <ol className="text-[9px] space-y-0.5">
              {musicas.map((m, i) => (
                <li key={i} className="flex gap-1">
                  <span className="font-bold w-4">{i + 1}.</span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* n5 */}
        {n5 && (
          <div className="flex-1">
            <div className="flex gap-3">
              {imgs[4] && (
                <div className="w-32 flex-shrink-0 border border-black">
                  <div className="relative w-full" style={{ height: '80px' }}>
                    <Image
                      src={imgs[4]}
                      alt={n5.titulo}
                      fill
                      className="object-cover"
                      style={{ filter: 'grayscale(80%) sepia(20%)' }}
                    />
                  </div>
                </div>
              )}
              <article>
                <div className="text-[8px] uppercase tracking-widest text-gray-600 mb-0.5">{n5.categoria}</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '3px',
                  }}
                >
                  {n5.titulo}
                </h3>
                <div className="text-[9px] leading-[1.5] text-justify">
                  {n5.corpo.split('\n').slice(0, 2).map((p, i) => (
                    <p key={i} className="mb-1">{p}</p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-double border-black mt-2 pt-1 text-center">
        <p className="text-[8px] text-gray-600">
          {idioma === 'en'
            ? `Generated by Jornal Histórico — jornalaniversario.com.br — All stories are historically plausible recreations`
            : `Gerado por Jornal Histórico — jornalaniversario.com.br — Todas as histórias são recriações historicamente plausíveis`}
        </p>
      </div>
    </div>
  );
}

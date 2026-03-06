import type { ConteudoJornal } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

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

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paragraphs(text: string, limit?: number): string {
  const lines = text.split('\n').filter(Boolean);
  const sliced = limit ? lines.slice(0, limit) : lines;
  return sliced.map((p) => `<p style="margin-bottom:4px;">${esc(p)}</p>`).join('');
}

export function generateJornalHtml(jornal: {
  nome_jornal: string;
  nome_aniversariante: string;
  data_nascimento: string;
  conteudo_json: ConteudoJornal;
  imagens_urls: string[] | null;
  idioma: string;
}): string {
  const { nome_jornal, nome_aniversariante, data_nascimento, conteudo_json, imagens_urls, idioma } = jornal;
  const { manchete, noticias, horoscopo, anuncio, musicas } = conteudo_json;

  const locale = idioma === 'en' ? enUS : ptBR;
  const dataObj = parseISO(data_nascimento);
  const dataDisplay = idioma === 'en'
    ? format(dataObj, 'EEEE, MMMM do, yyyy', { locale })
    : format(dataObj, "EEEE, dd 'de' MMMM 'de' yyyy", { locale });
  const anoRomano = toRoman(dataObj.getFullYear());
  const numeroEdicao = Math.floor(Math.random() * 9000) + 1000;

  const [n1, n2, n3, n4, n5] = noticias;
  const imgs = imagens_urls || [];

  const imgTag = (src: string, alt: string, style: string) =>
    src ? `<img src="${esc(src)}" alt="${esc(alt)}" style="${style}" />` : '';

  return `
<div style="width:1120px;min-height:793px;padding:20px 24px;background:#f5f0e8;color:#1a1a1a;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;line-height:1.5;position:relative;">

  <!-- Header bar -->
  <div style="border-top:2px solid black;border-bottom:1px solid black;padding:2px 0;margin-bottom:4px;display:flex;justify-content:space-between;font-size:9px;">
    <span>Edição Especial — Ano ${anoRomano} — N.° ${numeroEdicao}</span>
    <span style="text-transform:capitalize;">${esc(dataDisplay)}</span>
    <span>${idioma === 'en' ? 'Price $ 1.20' : 'Preço R$ 1,20'}</span>
  </div>

  <!-- Masthead -->
  <div style="text-align:center;border-bottom:4px double black;padding-bottom:8px;margin-bottom:8px;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:52px;font-weight:900;line-height:1;letter-spacing:-1px;text-transform:uppercase;margin:0;">${esc(nome_jornal)}</h1>
    <div style="border-top:1px solid black;margin-top:4px;padding-top:4px;font-size:10px;letter-spacing:4px;text-transform:uppercase;">
      ${idioma === 'en' ? 'Special Birthday Edition' : 'Edição Especial de Aniversário'} — ${format(dataObj, 'yyyy')}
    </div>
  </div>

  <!-- Headline -->
  <div style="text-align:center;border-bottom:2px solid black;padding-bottom:8px;margin-bottom:12px;">
    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0;">
      ${esc(manchete || `${idioma === 'en' ? 'BORN' : 'NASCE'}: ${nome_aniversariante.toUpperCase()}`)}
    </h2>
    ${n1 ? `<p style="font-size:10px;font-style:italic;margin-top:4px;">${esc(n1.subtitulo)}</p>` : ''}
  </div>

  <!-- 3-column layout -->
  <div style="display:flex;border-bottom:1px solid black;padding-bottom:12px;margin-bottom:12px;">

    <!-- Left 25% -->
    <div style="width:25%;padding-right:12px;border-right:1px solid black;">
      ${n1 ? `
      <div style="margin-bottom:16px;">
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#555;margin-bottom:2px;">${esc(n1.categoria)}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;line-height:1.2;margin:0 0 4px;">${esc(n1.titulo)}</h3>
        <p style="font-size:9px;font-style:italic;color:#555;margin-bottom:4px;">${esc(n1.subtitulo)}</p>
        <div style="font-size:9px;line-height:1.5;text-align:justify;">${paragraphs(n1.corpo)}</div>
      </div>` : ''}
      ${n2 ? `
      <div style="border-top:1px solid black;padding-top:12px;">
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#555;margin-bottom:2px;">${esc(n2.categoria)}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;line-height:1.2;margin:0 0 4px;">${esc(n2.titulo)}</h3>
        <p style="font-size:9px;font-style:italic;color:#555;margin-bottom:4px;">${esc(n2.subtitulo)}</p>
        <div style="font-size:9px;line-height:1.5;text-align:justify;">${paragraphs(n2.corpo, 3)}</div>
      </div>` : ''}
    </div>

    <!-- Center 50% -->
    <div style="width:50%;padding:0 16px;border-right:1px solid black;">
      ${imgs[0] ? `
      <div style="margin-bottom:12px;border:1px solid black;">
        <div style="height:200px;overflow:hidden;">
          ${imgTag(imgs[0], n1?.titulo || 'Foto histórica', 'width:100%;height:200px;object-fit:cover;filter:grayscale(80%) sepia(20%);display:block;')}
        </div>
        <p style="font-size:8px;text-align:center;font-style:italic;padding:4px;background:#ede8db;border-top:1px solid black;margin:0;">${esc(n1?.subtitulo || '')}</p>
      </div>` : ''}

      <div style="border:1px solid black;padding:8px;margin-bottom:12px;background:#ede8db;">
        <h4 style="font-family:'Playfair Display',serif;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;border-bottom:1px solid #1a1a1a;padding-bottom:2px;margin:0 0 4px;">
          ${idioma === 'en' ? 'Main news of this year' : 'Principais notícias deste ano'}
        </h4>
        <ul style="font-size:9px;list-style:none;padding:0;margin:0;">
          ${noticias.map(n => `<li style="margin-bottom:2px;">&#9670; ${esc(n.titulo)}</li>`).join('')}
        </ul>
      </div>

      ${n3 ? `
      <div>
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#555;margin-bottom:2px;">${esc(n3.categoria)}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;line-height:1.2;margin:0 0 4px;">${esc(n3.titulo)}</h3>
        <p style="font-size:9px;font-style:italic;color:#555;margin-bottom:4px;">${esc(n3.subtitulo)}</p>
        <div style="font-size:9px;line-height:1.5;text-align:justify;columns:2;gap:12px;">${paragraphs(n3.corpo)}</div>
      </div>` : ''}
    </div>

    <!-- Right 25% -->
    <div style="width:25%;padding-left:12px;">
      ${n4 ? `
      <div style="margin-bottom:16px;">
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#555;margin-bottom:2px;">${esc(n4.categoria)}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;line-height:1.2;margin:0 0 4px;">${esc(n4.titulo)}</h3>
        <div style="font-size:9px;line-height:1.5;text-align:justify;">${paragraphs(n4.corpo, 2)}</div>
      </div>` : ''}

      ${horoscopo ? `
      <div style="border:1px solid black;padding:8px;margin-bottom:12px;background:#ede8db;">
        <h4 style="font-family:'Playfair Display',serif;font-size:11px;font-weight:700;text-align:center;text-transform:uppercase;border-bottom:1px solid #1a1a1a;padding-bottom:2px;margin:0 0 4px;">
          ${idioma === 'en' ? 'Horoscope' : 'Horóscopo'} — ${esc(horoscopo.signo)}
        </h4>
        <p style="font-size:9px;line-height:1.5;text-align:justify;">${esc(horoscopo.texto)}</p>
      </div>` : ''}

      ${anuncio ? `
      <div style="border:2px double black;padding:8px;text-align:center;">
        <div style="border:1px solid black;padding:8px;">
          <p style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">${esc(anuncio.nome_produto)}</p>
          <p style="font-size:10px;font-style:italic;margin:4px 0;">&ldquo;${esc(anuncio.slogan)}&rdquo;</p>
          <p style="font-size:8px;text-align:justify;">${esc(anuncio.descricao)}</p>
        </div>
      </div>` : ''}
    </div>
  </div>

  <!-- Bottom section -->
  <div style="display:flex;gap:16px;">
    ${musicas && musicas.length > 0 ? `
    <div style="width:35%;border:1px solid black;padding:8px;background:#ede8db;">
      <h4 style="font-family:'Playfair Display',serif;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;border-bottom:1px solid #1a1a1a;padding-bottom:2px;margin:0 0 4px;">
        ${idioma === 'en' ? 'Most requested songs' : 'Músicas mais pedidas'}
      </h4>
      <ol style="font-size:9px;padding:0;margin:0;list-style:none;">
        ${musicas.map((m, i) => `<li style="margin-bottom:2px;"><strong>${i + 1}.</strong> ${esc(m)}</li>`).join('')}
      </ol>
    </div>` : ''}

    ${n5 ? `
    <div style="flex:1;">
      <div style="display:flex;gap:12px;">
        ${imgs[4] ? `
        <div style="width:128px;flex-shrink:0;border:1px solid black;">
          ${imgTag(imgs[4], n5.titulo, 'width:128px;height:80px;object-fit:cover;filter:grayscale(80%) sepia(20%);display:block;')}
        </div>` : ''}
        <div>
          <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#555;margin-bottom:2px;">${esc(n5.categoria)}</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;line-height:1.2;margin:0 0 3px;">${esc(n5.titulo)}</h3>
          <div style="font-size:9px;line-height:1.5;text-align:justify;">${paragraphs(n5.corpo, 2)}</div>
        </div>
      </div>
    </div>` : ''}
  </div>

  <!-- Footer -->
  <div style="border-top:2px double black;margin-top:8px;padding-top:4px;text-align:center;">
    <p style="font-size:8px;color:#666;">
      ${idioma === 'en'
        ? 'Generated by Jornal Histórico — jornalaniversario.com.br — All stories are historically plausible recreations'
        : 'Gerado por Jornal Histórico — jornalaniversario.com.br — Todas as histórias são recriações historicamente plausíveis'}
    </p>
  </div>
</div>`;
}

export function wrapJornalHtml(bodyContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f5f0e8; font-family: 'Libre Baskerville', Georgia, serif; }
  </style>
</head>
<body>${bodyContent}</body>
</html>`;
}

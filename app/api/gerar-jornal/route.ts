import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { getSupabaseAdmin } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { ConteudoJornal } from '@/types';

async function fetchWikipediaEvents(mm: string, dd: string, yyyy: number): Promise<string> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return '';
    const data = await res.json();
    const allEvents: { year: number; text: string }[] = data.events || [];

    // Filter events from the exact year ±2 years
    const nearby = allEvents
      .filter((e) => Math.abs(e.year - yyyy) <= 2)
      .slice(0, 8)
      .map((e) => `${e.year}: ${e.text}`)
      .join('\n');

    if (nearby.length > 0) return nearby;

    // Fallback: 5 most recent events before the year
    return allEvents
      .filter((e) => e.year <= yyyy)
      .sort((a, b) => b.year - a.year)
      .slice(0, 5)
      .map((e) => `${e.year}: ${e.text}`)
      .join('\n');
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { nomeJornal, nomeAniversariante, dataNascimento, idioma } = await req.json();

    if (!nomeJornal || !nomeAniversariante || !dataNascimento) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const dateObj = new Date(dataNascimento);
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const decade = Math.floor(yyyy / 10) * 10;

    const langInstruction = idioma === 'en' ? 'English' : 'Portuguese (Brazil)';

    // Fetch real historical events from Wikipedia
    const eventosReais = await fetchWikipediaEvents(mm, dd, yyyy);

    const eventosContext = eventosReais
      ? `Eventos REAIS que aconteceram nesta data ou período (use como base factual):\n${eventosReais}\n\nCom base NESSES EVENTOS REAIS (não invente eventos), gere`
      : 'Gere';

    const systemPrompt = `Você é um jornalista histórico especializado.
Data do jornal: ${dd}/${mm}/${yyyy}

${eventosContext} o conteúdo de um jornal impresso da época com:
- 1 manchete principal sobre o nascimento do aniversariante "${nomeAniversariante}"
- 5 notícias baseadas nos eventos reais acima (quando disponíveis), formatadas jornalisticamente, cada uma com:
  - titulo (máx 8 palavras)
  - subtitulo (máx 15 palavras)
  - corpo (3-4 parágrafos, estilo jornalístico da época)
  - categoria (politica | esporte | cultura | economia | curiosidade)
  - prompt_imagem (descrição em inglês para gerar foto jornalística da época)
- 1 horoscopo do signo correspondente à data (signo + texto)
- 1 anuncio publicitário fictício de produto da época (nome_produto, slogan, descricao)
- 1 coluna "Músicas mais pedidas" com array de 5 strings "Artista — Música" (reais da época)
IMPORTANTE: Não invente eventos esportivos, políticos ou culturais que não aconteceram. Use apenas os eventos fornecidos acima quando disponíveis.
Responda SOMENTE em JSON válido, sem markdown, sem blocos de código, seguindo exatamente esta estrutura:
{
  "manchete": "string",
  "noticias": [{"titulo":"","subtitulo":"","corpo":"","categoria":"","prompt_imagem":""}],
  "horoscopo": {"signo":"","texto":""},
  "anuncio": {"nome_produto":"","slogan":"","descricao":""},
  "musicas": [""]
}
Idioma de resposta: ${langInstruction}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: systemPrompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('GPT não retornou conteúdo');

    const conteudoJson: ConteudoJornal = JSON.parse(content);

    // Generate images with DALL-E 3 in parallel for speed
    const imagePromises = conteudoJson.noticias.map((noticia) =>
      openai.images
        .generate({
          model: 'dall-e-3',
          prompt: `Black and white photojournalism photograph from the ${decade}s, grainy film, high contrast, documentary style. Scene: ${noticia.prompt_imagem}. No text, no captions, no watermarks. Historical documentary aesthetic.`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        })
        .then((res) => res.data?.[0]?.url || '')
        .catch(() => '')
    );
    const imagensUrls = await Promise.all(imagePromises);

    // Save to Supabase
    const { data, error } = await getSupabaseAdmin()
      .from('jornais')
      .insert({
        user_id: user.id,
        nome_jornal: nomeJornal,
        nome_aniversariante: nomeAniversariante,
        data_nascimento: dataNascimento,
        idioma: idioma || 'pt',
        conteudo_json: conteudoJson,
        imagens_urls: imagensUrls,
        status: 'preview',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    console.error('Erro ao gerar jornal:', err);
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


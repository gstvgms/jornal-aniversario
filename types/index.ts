export interface Noticia {
  titulo: string;
  subtitulo: string;
  corpo: string;
  categoria: 'politica' | 'esporte' | 'cultura' | 'economia' | 'curiosidade';
  prompt_imagem: string;
}

export interface Horoscopo {
  signo: string;
  texto: string;
}

export interface Anuncio {
  nome_produto: string;
  slogan: string;
  descricao: string;
}

export interface ConteudoJornal {
  manchete: string;
  noticias: Noticia[];
  horoscopo: Horoscopo;
  anuncio: Anuncio;
  musicas: string[];
}

export interface Jornal {
  id: string;
  user_id: string;
  nome_jornal: string;
  nome_aniversariante: string;
  data_nascimento: string;
  idioma: string;
  conteudo_json: ConteudoJornal;
  imagens_urls: string[] | null;
  status: 'preview' | 'processando' | 'pago';
  stripe_session_id: string | null;
  pdf_url: string | null;
  created_at: string;
}

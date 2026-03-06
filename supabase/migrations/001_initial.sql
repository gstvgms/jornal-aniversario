CREATE TABLE jornais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_jornal TEXT NOT NULL,
  nome_aniversariante TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  idioma TEXT DEFAULT 'pt',
  conteudo_json JSONB NOT NULL,
  imagens_urls JSONB,
  status TEXT DEFAULT 'preview',
  stripe_session_id TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jornais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jornais"
  ON jornais FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jornais"
  ON jornais FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update jornais"
  ON jornais FOR UPDATE
  USING (true);

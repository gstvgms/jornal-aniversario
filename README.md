# 📰 Jornal Histórico

> Descubra o que aconteceu no dia em que você nasceu — um jornal personalizado estilo vintage gerado por IA.

Gere um jornal com notícias históricas, fotos da época, horóscopo e anúncios retrô com o seu nome na manchete principal. O presente perfeito para você ou quem você ama.

## Funcionalidades

- 🤖 **Notícias geradas por IA** (GPT-4o) com eventos históricos reais e plausíveis da data de nascimento
- 🖼️ **Imagens históricas** geradas pelo DALL-E 3 em estilo fotojornalismo preto e branco
- 📰 **Layout de jornal vintage** com tipografia Playfair Display, diagramação em colunas e papel envelhecido
- 💳 **Pagamento via Stripe** (R$ 9,90) para download do PDF sem marca d'água em alta resolução
- 🔐 **Autenticação** via Supabase (e-mail/senha + Google OAuth)
- 📱 **Desktop-first** com aviso de melhor experiência no desktop

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [OpenAI](https://platform.openai.com) (API Key com acesso ao GPT-4o e DALL-E 3)
- Conta no [Stripe](https://stripe.com)

## Setup Local

### 1. Clone e instale dependências

```bash
git clone <url-do-repositorio>
cd jornal-aniversario
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha todas as variáveis em `.env.local`:

| Variável | Descrição |
|---|---|
| `OPENAI_API_KEY` | Chave da API OpenAI (sk-...) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role do Supabase (secreta) |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe (whsec_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave publicável do Stripe (pk_test_...) |
| `NEXT_PUBLIC_APP_URL` | URL base da aplicação (ex: http://localhost:3000) |

### 3. Configure o Supabase

1. Crie um novo projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor** e execute o arquivo `supabase/migrations/001_initial.sql`
3. Em **Storage**, crie um bucket chamado `jornais-pdf` com acesso **público**
4. (Opcional) Para Google OAuth: vá em **Authentication > Providers > Google** e configure suas credenciais OAuth

### 4. Configure o Stripe (Webhooks locais)

Instale o [Stripe CLI](https://stripe.com/docs/stripe-cli) e execute:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

O CLI mostrará o `whsec_...` — copie para `STRIPE_WEBHOOK_SECRET`.

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Faça push do repositório para GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure todas as variáveis de ambiente no painel da Vercel
4. Configure o webhook do Stripe apontando para `https://seudominio.com/api/stripe/webhook`
5. Atualize `NEXT_PUBLIC_APP_URL` para a URL de produção

## Estrutura de Pastas

```
jornal-aniversario/
├── app/
│   ├── layout.tsx                     # Layout raiz com fontes Google
│   ├── page.tsx                       # Landing page
│   ├── api/
│   │   ├── gerar-jornal/route.ts      # Orquestra GPT-4o + DALL-E 3
│   │   ├── gerar-pdf/route.ts         # Puppeteer → PDF
│   │   └── stripe/
│   │       ├── checkout/route.ts      # Cria sessão de pagamento
│   │       └── webhook/route.ts       # Confirma pagamento e libera download
│   ├── auth/callback/route.ts         # OAuth callback
│   ├── dashboard/page.tsx             # Jornais do usuário logado
│   ├── gerar/page.tsx                 # Formulário de geração
│   └── preview/[id]/page.tsx          # Preview do jornal gerado
├── components/
│   ├── AuthModal.tsx                  # Modal de login/cadastro
│   ├── Footer.tsx
│   ├── FormGerarJornal.tsx            # Formulário principal
│   ├── Header.tsx                     # Header com estado de auth
│   ├── JornalLayout.tsx               # Layout vintage do jornal (React)
│   └── JornalPreview.tsx              # Wrapper com scroll horizontal
├── lib/
│   ├── html.ts                        # Gerador de HTML para PDF
│   ├── openai.ts                      # Cliente OpenAI (lazy)
│   ├── pdf.ts                         # Geração de PDF com Puppeteer
│   ├── stripe.ts                      # Cliente Stripe
│   ├── supabase.ts                    # Cliente admin Supabase
│   ├── supabase-client.ts             # Cliente browser Supabase
│   └── supabase-server.ts             # Cliente server Supabase (SSR)
├── supabase/migrations/
│   └── 001_initial.sql                # Schema do banco + RLS
├── types/index.ts                     # Tipos TypeScript
└── .env.example                       # Exemplo de variáveis de ambiente
```

## Preços

- **Preview gratuito** com marca d'água diagonal
- **R$ 9,90** para download do PDF em alta resolução sem marca d'água (formato A3 paisagem)

## Roadmap V2

- [ ] Suporte a múltiplos idiomas (ES, FR, DE, IT)
- [ ] Modo presente com link direto para compartilhar com quem recebe
- [ ] Impressão via serviço de gráfica parceiro
- [ ] Integração com WhatsApp para compartilhamento direto
- [ ] Plano assinatura para agências e papelarias
- [ ] Templates de jornal adicionais (anos 20, 50, 70)
- [ ] Miniatura/thumbnail automática no dashboard

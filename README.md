# 📰 Jornal Histórico

Gere um jornal personalizado estilo vintage com notícias geradas por IA sobre o dia do seu nascimento.

## Funcionalidades

- 🤖 **Notícias geradas por IA** (GPT-4o) com eventos históricos reais e plausíveis da data de nascimento
- 🖼️ **Imagens históricas** geradas pelo DALL-E 3 em estilo fotojornalismo PB
- 📰 **Layout de jornal vintage** com tipografia e diagramação autentica
- 💳 **Pagamento via Stripe** para download do PDF sem marca d'água
- 🔐 **Autenticação** via Supabase (e-mail/senha + Google OAuth)
- 📱 **Responsivo** com aviso de melhor experiência no desktop

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [OpenAI](https://platform.openai.com)
- Conta no [Stripe](https://stripe.com)

## Configuração

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

Preencha todas as variáveis em `.env.local`.

### 3. Configure o Supabase

1. Crie um novo projeto no Supabase Dashboard
2. Execute a migration em SQL Editor (arquivo: `supabase/migrations/001_initial.sql`)
3. Crie um bucket de Storage chamado `jornais-pdf` (público)
4. Ative o Google OAuth em Authentication > Providers (opcional)

### 4. Configure o Stripe

Para desenvolvimento local, use o Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Execute o projeto

```bash
npm run dev
```

## Estrutura de Pastas

```
jornal-aniversario/
├── app/
│   ├── api/
│   │   ├── gerar-jornal/     # Gera conteúdo via GPT-4o + DALL-E 3
│   │   ├── gerar-pdf/        # Gera PDF via Puppeteer
│   │   └── stripe/
│   │       ├── checkout/     # Cria sessão de pagamento
│   │       └── webhook/      # Processa pagamentos confirmados
│   ├── auth/callback/        # OAuth callback
│   ├── dashboard/            # Lista de jornais do usuário
│   ├── gerar/                # Formulário de geração
│   └── preview/[id]/         # Visualização do jornal
├── components/
│   ├── AuthModal.tsx
│   ├── Footer.tsx
│   ├── FormGerarJornal.tsx
│   ├── Header.tsx
│   ├── JornalLayout.tsx
│   └── JornalPreview.tsx
├── lib/
│   ├── openai.ts
│   ├── pdf.ts
│   ├── stripe.ts
│   ├── supabase.ts
│   ├── supabase-client.ts
│   └── supabase-server.ts
├── supabase/migrations/
│   └── 001_initial.sql
└── types/index.ts
```

## Preços

- **Preview gratuito** com marca d'água
- **R$ 9,90** para download do PDF sem marca d'água

## Roadmap V2

- [ ] Suporte a múltiplos idiomas (ES, FR, DE)
- [ ] Modo presente com link direto para compartilhar
- [ ] Impressão via serviço de gráfica
- [ ] Integração com WhatsApp
- [ ] Plano assinatura para agências e papelarias

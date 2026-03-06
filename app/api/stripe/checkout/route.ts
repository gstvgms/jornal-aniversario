import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const produtos = {
  digital: {
    name: 'Jornal Histórico — Digital',
    description: 'Imagem PNG em alta resolução para baixar e compartilhar',
    amount: 990, // R$ 9,90
  },
  impressao: {
    name: 'Jornal Histórico — Impressão Profissional',
    description: 'PDF Tablóide 300 DPI otimizado para gráfica, em papel de jornal',
    amount: 2990, // R$ 29,90
  },
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { jornalId, tipo } = await req.json();
    const tipoValido = tipo === 'impressao' ? 'impressao' : 'digital';
    const produto = produtos[tipoValido];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: produto.name,
              description: produto.description,
            },
            unit_amount: produto.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { jornalId, userId: user.id, tipo: tipoValido },
      success_url: `${appUrl}/preview/${jornalId}?success=${tipoValido}`,
      cancel_url: `${appUrl}/preview/${jornalId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Erro ao criar checkout:', err);
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


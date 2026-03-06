import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { jornalId } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Jornal Histórico — PDF',
              description: 'Download do seu jornal histórico personalizado em alta resolução',
            },
            unit_amount: 990, // R$ 9,90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { jornalId, userId: user.id },
      success_url: `${appUrl}/preview/${jornalId}?success=true`,
      cancel_url: `${appUrl}/preview/${jornalId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Erro ao criar checkout:', err);
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

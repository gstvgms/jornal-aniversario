import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature invalid';
    console.error('Webhook error:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const jornalId = session.metadata?.jornalId;
    const userId = session.metadata?.userId;

    if (!jornalId || !userId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Update status to processing
    await supabaseAdmin
      .from('jornais')
      .update({ status: 'processando', stripe_session_id: session.id })
      .eq('id', jornalId);

    // Generate PDF
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const pdfRes = await fetch(`${appUrl}/api/gerar-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jornalId, userId }),
      });

      if (!pdfRes.ok) {
        throw new Error('Failed to generate PDF');
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      // Don't fail the webhook - mark as pago anyway so user can retry
      await supabaseAdmin
        .from('jornais')
        .update({ status: 'pago' })
        .eq('id', jornalId);
    }
  }

  return NextResponse.json({ received: true });
}

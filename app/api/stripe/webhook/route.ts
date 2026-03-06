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
    const tipo = session.metadata?.tipo === 'impressao' ? 'impressao' : 'digital';

    if (!jornalId || !userId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Update status to processing
    await supabaseAdmin
      .from('jornais')
      .update({ status: 'processando', stripe_session_id: session.id, tipo_pago: tipo })
      .eq('id', jornalId);

    if (tipo === 'impressao') {
      // Generate PDF Tablóide
      try {
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
        // Don't fail the webhook — mark as pago_impressao so user can retry
        await supabaseAdmin
          .from('jornais')
          .update({ status: 'pago_impressao' })
          .eq('id', jornalId);
      }
    } else {
      // Generate PNG image
      try {
        const imgRes = await fetch(`${appUrl}/api/gerar-imagem`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jornalId, userId }),
        });

        if (!imgRes.ok) {
          throw new Error('Failed to generate image');
        }
      } catch (err) {
        console.error('Image generation error:', err);
        // Don't fail the webhook — mark as pago_digital so user can retry
        await supabaseAdmin
          .from('jornais')
          .update({ status: 'pago_digital' })
          .eq('id', jornalId);
      }
    }
  }

  return NextResponse.json({ received: true });
}


import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateScreenshot } from '@/lib/pdf';
import { generateJornalHtml, wrapJornalHtml } from '@/lib/html';

export async function POST(req: NextRequest) {
  try {
    const { jornalId, userId } = await req.json();

    // Validate UUIDs to prevent path traversal
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(jornalId) || !uuidPattern.test(userId)) {
      return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: jornal, error } = await supabaseAdmin
      .from('jornais')
      .select('*')
      .eq('id', jornalId)
      .single();

    if (error || !jornal) {
      return NextResponse.json({ error: 'Jornal não encontrado' }, { status: 404 });
    }

    const bodyHtml = generateJornalHtml(jornal);
    const html = wrapJornalHtml(bodyHtml);
    const imageBuffer = await generateScreenshot(html);

    // Upload to Supabase Storage
    const fileName = `${userId}/${jornalId}.png`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('jornais-imagens')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage
      .from('jornais-imagens')
      .getPublicUrl(fileName);

    const imagemUrl = urlData.publicUrl;

    await supabaseAdmin
      .from('jornais')
      .update({ status: 'pago_digital', imagem_url: imagemUrl })
      .eq('id', jornalId);

    return NextResponse.json({ imagemUrl });
  } catch (err: unknown) {
    console.error('Erro ao gerar imagem:', err);
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

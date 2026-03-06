'use client';
import JornalLayout from './JornalLayout';
import type { Jornal } from '@/types';

interface JornalPreviewProps {
  jornal: Jornal;
  watermark?: boolean;
}

export default function JornalPreview({ jornal, watermark = true }: JornalPreviewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <JornalLayout jornal={jornal} watermark={watermark} />
      </div>
    </div>
  );
}

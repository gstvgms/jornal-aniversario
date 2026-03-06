-- Add imagem_url column for PNG digital product
ALTER TABLE jornais ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Add tipo_pago column to differentiate digital vs impressao
ALTER TABLE jornais ADD COLUMN IF NOT EXISTS tipo_pago TEXT;

-- Update status check to include new statuses
-- (status values: 'preview' | 'processando' | 'pago_digital' | 'pago_impressao')

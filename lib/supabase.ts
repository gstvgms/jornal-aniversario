import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Using any to avoid requiring generated Supabase types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _admin: SupabaseClient<AnyDatabase> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseAdmin(): SupabaseClient<AnyDatabase> {
  if (!_admin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _admin = createClient<AnyDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}

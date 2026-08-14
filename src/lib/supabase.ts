import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const sanitizeSupabaseUrl = (url: string): string => {
  let clean = url.trim();
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  if (clean.endsWith('/rest/v1')) {
    clean = clean.replace(/\/rest\/v1$/, '');
  }
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
};

export const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
export const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    supabaseUrl.startsWith('https://') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 0 &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth Helper Functions
export async function signUpUser(params: {
  email: string;
  password: string;
  fullName: string;
  organizationName: string;
}): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    // Local fallback mode simulation
    sessionStorage.setItem('apex_admin_auth', 'true');
    sessionStorage.setItem('apex_user_email', params.email);
    sessionStorage.setItem('apex_user_org', params.organizationName);
    return { user: null, session: null, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        organization_name: params.organizationName,
      },
    },
  });

  if (!error && data.user) {
    sessionStorage.setItem('apex_admin_auth', 'true');
    sessionStorage.setItem('apex_user_email', params.email);
    sessionStorage.setItem('apex_user_org', params.organizationName);
  }

  return { user: data.user, session: data.session, error };
}

export async function signInUser(params: {
  email: string;
  password: string;
}): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    // Local fallback mode simulation
    sessionStorage.setItem('apex_admin_auth', 'true');
    sessionStorage.setItem('apex_user_email', params.email);
    return { user: null, session: null, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (!error && data.user) {
    sessionStorage.setItem('apex_admin_auth', 'true');
    sessionStorage.setItem('apex_user_email', params.email);
  }

  return { user: data.user, session: data.session, error };
}

export async function signOutUser(): Promise<{ error: Error | null }> {
  sessionStorage.removeItem('apex_admin_auth');
  sessionStorage.removeItem('apex_user_email');
  sessionStorage.removeItem('apex_user_org');

  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return { error: null };
}

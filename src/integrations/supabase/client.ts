import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// These are expected to be set in environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Log a warning instead of throwing to prevent app crash on load
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Missing Supabase configuration. Please check your environment variables. Using placeholder values to prevent crash.');
}

// Create a flag to track if we have valid credentials
const hasValidCredentials = !!(
  SUPABASE_URL &&
  SUPABASE_PUBLISHABLE_KEY &&
  SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
  SUPABASE_PUBLISHABLE_KEY !== 'placeholder-key'
);

/**
 * Create a resilient Supabase client that won't crash on initialization.
 * If credentials are missing, we create a minimal client that returns empty data
 * for all queries instead of throwing during auth session restoration.
 */
function createResilientClient() {
  // Validate URL format to prevent Supabase client from crashing on bad URL
  let validatedUrl = SUPABASE_URL;
  let validatedKey = SUPABASE_PUBLISHABLE_KEY;

  if (!validatedUrl || !validatedKey) {
    validatedUrl = 'https://placeholder-url.supabase.co';
    validatedKey = 'placeholder-key';
  }

  try {
    return createClient<Database>(
      validatedUrl,
      validatedKey,
      {
        auth: {
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        },
      }
    );
  } catch (e) {
    console.error('Failed to create Supabase client:', e);
    // Return a minimal mock client that prevents crashes
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
            limit: () => Promise.resolve({ data: null, error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
            abortSignal: () => ({ data: null, error: null }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: null, error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          }),
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      rpc: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      functions: {
        invoke: async () => ({ data: null, error: new Error('Supabase not configured') }),
      },
    } as any;
  }
}

export const supabase = createResilientClient();
export { hasValidCredentials };

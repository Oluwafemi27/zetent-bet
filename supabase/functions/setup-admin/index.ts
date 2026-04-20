import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    
    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const email = 'oluwafemiod7@gmail.com';
    const password = 'Sijuade27#';
    const fullName = 'Oluwafemi';

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError && !authError.message.includes('already exists')) {
      throw authError;
    }

    const userId = authData?.user?.id;
    if (!userId) {
      throw new Error('Failed to create user');
    }

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName,
        email,
        balance: 0,
        bonus_balance: 0,
        kyc_verified: false,
        referral_code: Math.random().toString(36).substring(2, 11).toUpperCase(),
      })
      .select()
      .single();

    if (profileError && !profileError.message.includes('duplicate')) {
      console.error('Profile error:', profileError);
    }

    // Set user as admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin',
      });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('Role error:', roleError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin user setup complete',
        userId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

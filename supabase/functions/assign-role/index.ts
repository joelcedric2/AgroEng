import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, role } = await req.json();
    
    if (!userEmail || !role) {
      throw new Error('Email and role are required');
    }

    console.log('Assigning role:', role, 'to user:', userEmail);

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Failed to get users: ${userError.message}`);
    }

    const user = userData.users.find(u => u.email === userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (roleCheckError && roleCheckError.code !== 'PGRST116') {
      throw new Error(`Failed to check existing role: ${roleCheckError.message}`);
    }

    if (existingRole) {
      // Update existing role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(`Failed to update role: ${updateError.message}`);
      }
    } else {
      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role });

      if (insertError) {
        throw new Error(`Failed to assign role: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully assigned ${role} role to ${userEmail}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assign-role function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
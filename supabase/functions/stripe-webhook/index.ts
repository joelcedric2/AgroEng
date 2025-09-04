import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the webhook signature (to be implemented with actual Stripe secret)
    const signature = req.headers.get('stripe-signature') || ''
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    // TODO: Verify the webhook signature with Stripe
    // This requires the Stripe SDK which we'll add later
    
    const payload = await req.json()
    const event = payload
    
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful subscription
        const session = event.data.object
        const userId = session.client_reference_id
        const plan = session.metadata?.plan || 'premium' // Default to premium if not specified
        
        // Update the user's plan in the database
        const { error } = await supabaseClient
          .from('profiles')
          .update({ 
            plan: plan,
            is_guest: false // Convert to full user on first purchase
          })
          .eq('id', userId)
          
        if (error) throw error
        break
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription changes or cancellations
        const subscription = event.data.object
        const subscriptionPlan = subscription.metadata?.plan || 'free'
        
        // Update the user's plan in the database
        await supabaseClient
          .from('profiles')
          .update({ 
            plan: subscriptionPlan,
            is_guest: false
          })
          .eq('stripe_customer_id', subscription.customer)
        break
        
      // Add more event types as needed
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

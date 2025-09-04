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
    const { imageUrl, cropId, description } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing image:', imageUrl);

    // Analyze image with OpenAI Vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an agricultural expert analyzing crop images. Analyze the image and provide detailed information in JSON format with these fields:
            - plant_health: "healthy", "diseased", or "stressed"
            - visible_symptoms: array of symptoms if any
            - disease_indicators: specific disease signs
            - growth_stage: current growth stage
            - environmental_conditions: visible environmental factors
            - recommendations: suggestions for care or treatment
            - confidence_score: 0-100 confidence in analysis`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this crop image. Context: ${description || 'No additional context provided'}`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    console.log('Analysis completed:', analysis);

    // Parse JSON if possible, otherwise store as text
    let analysisData;
    try {
      analysisData = JSON.parse(analysis);
    } catch {
      analysisData = { raw_analysis: analysis };
    }

    // Generate text embeddings for search
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: analysis
      }),
    });

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Store analysis and embedding in database
    const { error: vectorError } = await supabase
      .from('crop_search_vectors')
      .insert({
        crop_id: cropId,
        content_type: 'image_analysis',
        content: analysis,
        embedding_data: embedding
      });

    if (vectorError) {
      console.error('Error storing search vector:', vectorError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisData,
        embedding_stored: !vectorError 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in crop-image-analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
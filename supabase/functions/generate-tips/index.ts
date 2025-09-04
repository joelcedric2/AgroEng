import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, count = 3, userInput } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    
    switch (type) {
      case 'daily-tips':
        prompt = `Generate ${count} practical daily farming tips for small-scale farmers in developing countries. Include tips about watering, pest control, soil management, and crop care. Format as JSON array with objects containing: id (number), title (string), category (string), content (detailed string), difficulty (Beginner/Intermediate/Advanced). Make content actionable and specific.`;
        break;
      case 'crop-guides':
        prompt = `Generate ${count} crop-specific guides for common crops like tomato, maize, cassava, beans, sweet potato. Format as JSON array with objects containing: name (string), icon (emoji), commonIssues (array of strings), tips (detailed string with specific care instructions).`;
        break;
      case 'seasonal-alerts':
        prompt = `Generate ${count} seasonal farming alerts relevant to tropical/subtropical climates. Format as JSON array with objects containing: title (string), message (detailed string), urgency (high/medium/low). Focus on weather-related farming advice.`;
        break;
      case 'how-to-guides':
        prompt = `Generate ${count} step-by-step farming guides for common tasks. Format as JSON array with objects containing: title (string), steps (array of strings), difficulty (Beginner/Intermediate/Advanced), estimatedTime (string), tools (array of strings).`;
        break;
      case 'voice-response':
        prompt = `User said: "${userInput}". Provide a helpful farming response as a friendly agricultural expert. Give practical advice based on what they described. Keep response under 100 words and conversational.`;
        break;
      default:
        throw new Error('Invalid content type requested');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural expert specializing in small-scale farming in developing countries. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`OpenAI API error ${response.status}:`, errorDetails);
      throw new Error(`OpenAI API error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    let content;
    
    if (type === 'voice-response') {
      // For voice responses, return the text directly
      content = data.choices[0].message.content;
      return new Response(JSON.stringify({ response: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // For other types, parse as JSON
      try {
        content = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', data.choices[0].message.content);
        throw new Error('Invalid JSON response from AI');
      }

      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-tips function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
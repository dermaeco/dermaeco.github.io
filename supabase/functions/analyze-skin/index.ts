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
    const { imageUrl, questionnaire, language = 'en' } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Language mapping for AI
    const languageMap: Record<string, string> = {
      'en': 'English',
      'de': 'German',
      'fr': 'French',
      'zh': 'Chinese'
    };
    const targetLanguage = languageMap[language] || 'English';

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing skin with image:', imageUrl);
    
    // Build the analysis prompt
    const systemPrompt = `You are an expert dermatologist AI assistant specialized in skin analysis. 
Analyze the provided skin image and questionnaire data to provide a comprehensive skin assessment.

IMPORTANT: Respond in ${targetLanguage}. All text fields (overall_summary, strengths, concerns, recommendations) must be in ${targetLanguage}.

Return a detailed analysis with scores from 1-10 for each metric (where the score represents the AMOUNT/SEVERITY of the issue):
- wrinkles_score: Amount of fine lines and wrinkles (1=minimal, 10=severe)
- spots_score: Amount of dark spots and hyperpigmentation (1=minimal, 10=severe)
- acne_score: Amount of active acne and breakouts (1=minimal, 10=severe)
- texture_score: Unevenness in skin texture (1=very smooth, 10=very rough)
- hydration_score: Level of dryness (1=well hydrated, 10=very dry)
- sebum_score: Oil production issues (1=balanced, 10=very oily or very dry)
- pores_score: Enlarged pores visibility (1=minimal, 10=very enlarged)
- redness_score: Inflammation and redness (1=calm, 10=very inflamed)
- dark_circles_score: Under-eye circles severity (1=minimal, 10=severe)
- skin_age_estimate: Estimated skin age in years
- skin_type: One of: normal, dry, oily, combination, sensitive
- overall_level: One of: "Excellent", "Good", "Fair", "Needs Attention"
- overall_summary: A brief 1-2 sentence summary of overall skin health (IN ${targetLanguage})

Also provide (ALL IN ${targetLanguage}):
- strengths: Array of 2-3 positive aspects of the skin
- concerns: Array of 2-3 areas that need attention
- recommendations: Array of 3-5 actionable skincare recommendations

Consider the questionnaire data if provided (skin concerns, lifestyle factors, etc.)`;

    const userPrompt = questionnaire 
      ? `Please analyze this skin image. User's questionnaire responses: ${JSON.stringify(questionnaire)}`
      : 'Please analyze this skin image and provide a comprehensive skin health assessment.';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'provide_skin_analysis',
            description: 'Provide comprehensive skin analysis results',
            parameters: {
              type: 'object',
              properties: {
                wrinkles_score: { type: 'number', minimum: 1, maximum: 10 },
                spots_score: { type: 'number', minimum: 1, maximum: 10 },
                acne_score: { type: 'number', minimum: 1, maximum: 10 },
                texture_score: { type: 'number', minimum: 1, maximum: 10 },
                hydration_score: { type: 'number', minimum: 1, maximum: 10 },
                sebum_score: { type: 'number', minimum: 1, maximum: 10 },
                pores_score: { type: 'number', minimum: 1, maximum: 10 },
                redness_score: { type: 'number', minimum: 1, maximum: 10 },
                dark_circles_score: { type: 'number', minimum: 1, maximum: 10 },
                skin_age_estimate: { type: 'number' },
                skin_type: { type: 'string', enum: ['normal', 'dry', 'oily', 'combination', 'sensitive'] },
                overall_level: { type: 'string', enum: ['Excellent', 'Good', 'Fair', 'Needs Attention'] },
                overall_summary: { type: 'string' },
                strengths: { type: 'array', items: { type: 'string' } },
                concerns: { type: 'array', items: { type: 'string' } },
                recommendations: { type: 'array', items: { type: 'string' } }
              },
              required: [
                'wrinkles_score', 'spots_score', 'acne_score', 'texture_score',
                'hydration_score', 'sebum_score', 'pores_score', 'redness_score',
                'dark_circles_score', 'skin_age_estimate', 'skin_type', 'overall_level', 'overall_summary',
                'strengths', 'concerns', 'recommendations'
              ]
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'provide_skin_analysis' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits required. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No analysis result from AI');
    }

    const analysisData = JSON.parse(toolCall.function.arguments);
    
    // Format the response to match AnalysisResults interface
    const result = {
      analysis: {
        wrinkles_score: analysisData.wrinkles_score,
        spots_score: analysisData.spots_score,
        acne_score: analysisData.acne_score,
        texture_score: analysisData.texture_score,
        hydration_score: analysisData.hydration_score,
        sebum_score: analysisData.sebum_score,
        pores_score: analysisData.pores_score,
        redness_score: analysisData.redness_score,
        dark_circles_score: analysisData.dark_circles_score,
        skin_age_estimate: analysisData.skin_age_estimate,
        skin_type: analysisData.skin_type,
        overall_level: analysisData.overall_level,
        overall_summary: analysisData.overall_summary
      },
      detailed_analysis: {
        strengths: analysisData.strengths,
        concerns: analysisData.concerns,
        recommendations: analysisData.recommendations
      },
      processing_time: '2-3 seconds'
    };

    console.log('Analysis complete:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

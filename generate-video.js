// Netlify Serverless Function - Video senaryosu oluşturur
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS request için
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Sadece POST isteklerini kabul et
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // İsteği parse et
    const { characterName, theme } = JSON.parse(event.body);

    // API key'i environment variable'dan al
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Google AI Studio'ya istek gönder
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const themeDescriptions = {
      adventure: 'macera dolu bir orman yolculuğu',
      space: 'heyecanlı bir uzay keşfi',
      ocean: 'renkli bir okyanus dalışı',
      forest: 'sakin bir orman gezintisi'
    };
    
    const prompt = `5-6 yaş grubu çocuklar için ${characterName} karakteri ile ${themeDescriptions[theme]} hakkında 4 sahneden oluşan kısa bir video senaryosu yaz. 

Her sahne şu formatta olmalı:
Sahne 1: [Emoji] - [Kısa açıklama (5-8 kelime)]
Sahne 2: [Emoji] - [Kısa açıklama (5-8 kelime)]
Sahne 3: [Emoji] - [Kısa açıklama (5-8 kelime)]
Sahne 4: [Emoji] - [Kısa açıklama (5-8 kelime)]

Her sahne mutlaka bir emoji ile başlamalı. Açıklamalar çok kısa ve basit olmalı. Türkçe olmalı.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const storyText = data.candidates[0].content.parts[0].text;

    // Metni parse et ve sahnelere ayır
    const scenes = [];
    const lines = storyText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      // Emoji ve metni ayıkla
      const match = line.match(/([^\w\s])\s*-?\s*(.+)/);
      if (match) {
        scenes.push({
          emoji: match[1],
          text: match[2].trim()
        });
      }
    });

    // En az 4 sahne olduğundan emin ol
    if (scenes.length < 4) {
      throw new Error('Yeterli sahne oluşturulamadı');
    }

    // Başarılı yanıt
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        scenes: scenes.slice(0, 4) // İlk 4 sahneyi al
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    // Hata durumunda fallback - frontend'de oluşturulacak
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        useFallback: true
      })
    };
  }
};

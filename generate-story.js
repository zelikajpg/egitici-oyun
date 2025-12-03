// Netlify Serverless Function - API key'i güvenli tutar
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
    const { characterName } = JSON.parse(event.body);

    // API key'i environment variable'dan al - GÜVENLİ!
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
    
    const prompt = `5-6 yaş grubu çocuklar için ${characterName} karakteri ile kısa, eğitici ve eğlenceli bir hikaye yaz. Hikaye 3-4 cümle olsun ve sonunda bir ders içersin. Hikaye Türkçe olmalı.`;

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
    const story = data.candidates[0].content.parts[0].text;

    // Başarılı yanıt
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        story: story
      })
    };

  } catch (error) {
    console.error('Error:', error);
    
    // Hata durumunda fallback hikaye
    const fallbackStories = [
      `Bir gün ${event.body ? JSON.parse(event.body).characterName : 'kahramanımız'} ormanda gezinirken küçük bir kuş yavrusu buldu. Kuş düşmüştü ve uçamıyordu. Kahramanımız kuşu dikkatle alıp yuvasına götürdü. Anne kuş çok mutlu oldu. İşte böyle, küçük yardımlar büyük mutluluklar yaratır!`,
      `Kahramanımız bir gün çok güzel renkli kalemler buldu. Arkadaşlarıyla paylaşmak istedi. Herkese bir kalem verdi ve birlikte güzel resimler yaptılar. Paylaşmak çok güzeldi!`,
      `Sabah erken kalkan kahramanımız çok heyecanlıydı. Pikniğe gideceklerdi! Ailesiyle birlikte hazırlık yaptılar. Sabah erken kalkmak güzel şeyler yaşamak için fırsat verir!`
    ];
    
    const randomStory = fallbackStories[Math.floor(Math.random() * fallbackStories.length)];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        story: randomStory,
        fallback: true
      })
    };
  }
};

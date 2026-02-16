import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const webcamUrl = 'http://193.248.203.116:1700/record/current.jpg';

  try {
    const response = await fetch(webcamUrl, {
      // Parfois nécessaire pour ne pas être bloqué par les vieilles caméras
      headers: {
        'User-Agent': 'Mozilla/5.0' 
      }
    });

    if (!response.ok) {
      return new Response('Erreur caméra', { status: 500 });
    }

    // On renvoie l'image brute au navigateur
    return new Response(response.body, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // Empêche la mise en cache
        'Expires': '0',
      },
    });
  } catch (error) {
    return new Response('Erreur serveur', { status: 500 });
  }
}
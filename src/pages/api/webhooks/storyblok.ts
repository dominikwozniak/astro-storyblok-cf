import type { APIContext } from 'astro';

// const STORYBLOK_WEBHOOK_SECRET = import.meta.env.STORYBLOK_WEBHOOK_SECRET;

export async function POST({ request, locals }: APIContext) {
  const providedSecret = request.headers.get('X-Storyblok-Signature');

  const env = locals.runtime.env
  const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN
  const CLOUDFLARE_ZONE_ID = env.CLOUDFLARE_ZONE_ID

  // if (providedSecret!== STORYBLOK_WEBHOOK_SECRET) {
  //   return new Response(`Unauthorized ${providedSecret}`, { status: 401 });
  // }

  try {
    const payload = await request.json();
    const storySlug = payload.full_slug;
    const isPublishedAction = payload.action === "published";

    if (!isPublishedAction) {
      return new Response('Not published action', { status: 400 });
    }

    if (!storySlug) {
      return new Response('Missing story slug in payload', { status: 400 });
    }

    const purgeResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: [`story:${storySlug}`]
        }),
      }
    );

    if (!purgeResponse.ok) {
      const errorText = await purgeResponse.text();
      console.error(`Cloudflare API error: ${purgeResponse.status} ${errorText}`);
      return new Response(`Error purging cache: ${errorText}`, { status: purgeResponse.status });
    }
    const purgeResult = await purgeResponse.json();
    if (purgeResult.success) {
      return new Response('Cache purged successfully', { status: 200 });
    } else {
      console.error('Cloudflare cache purge failed:', purgeResult.errors);
      return new Response(`Cache purge failed: ${JSON.stringify(purgeResult.errors)}`, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing revalidation request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  return new Response('Revalidation endpoint is active. Use POST to trigger revalidation. 111', { status: 200 });
}

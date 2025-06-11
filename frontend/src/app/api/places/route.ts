
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');
  const type = searchParams.get('type');

  if (!lat || !lng || !radius || !type) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const firstResponse = await fetch(
    `${baseUrl}?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`
  );
  const firstData = await firstResponse.json();

  let totalResult = firstData.results || [];
  let nextPageToken = firstData.next_page_token;

  if (nextPageToken) {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const secondResponse = await fetch(
      `${baseUrl}?location=${lat},${lng}&radius=${radius}&type=${type}&pagetoken=${nextPageToken}&key=${apiKey}`
    );
    const secondData = await secondResponse.json();

    totalResult = totalResult.concat(secondData.results || []);
  }

  return new Response(JSON.stringify({ results: totalResult }), { status: 200 });
}
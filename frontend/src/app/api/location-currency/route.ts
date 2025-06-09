import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  const apiKey = process.env.OPENCAGE_KEY;

  if (!lat || !lng || !apiKey) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lng}&key=${apiKey}`);

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch local currency' }, { status: 500 });
  }
}

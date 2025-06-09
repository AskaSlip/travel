import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const base = req.nextUrl.searchParams.get('base');
  const target = req.nextUrl.searchParams.get('target');
  const apiKey = process.env.EXCHANGE_RATE_KEY;

  if (!base || !target || !apiKey) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base}/${target}`);

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

const clientId = process.env.AMADEUS_API_KEY;
const clientSecret = process.env.AMADEUS_API_SECRET;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function GET() {
  const now = Date.now();

  if(cachedToken && tokenExpiry && now < tokenExpiry) {
    return NextResponse.json({ access_token: cachedToken });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Amadeus credentials" }, { status: 400 });
  }

  try {
    const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();

    cachedToken = data.access_token;
    tokenExpiry = now + data.expires_in * 1000 - 60000;

    return NextResponse.json({ access_token: cachedToken });
    // return NextResponse.json(data);
  } catch (error) {
    console.error("Amadeus token fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch Amadeus token" }, { status: 500 });
  }
}

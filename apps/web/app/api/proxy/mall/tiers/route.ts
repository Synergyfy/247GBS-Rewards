import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_MCOM_MALL_API_URL || 'http://localhost:3001/api/v1';
  const url = `${baseUrl}/tiers`;

  try {
    console.log(`[Proxy] Fetching Mall Tiers from: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`[Proxy] Error fetching from ${url}: ${response.status}`);
      return NextResponse.json({ error: `Failed to fetch tiers: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`[Proxy] Network Error fetching ${url}:`, error.message, error.cause);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

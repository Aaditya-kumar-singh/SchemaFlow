import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple health check for Render - just confirms server is responding
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    }, { status: 200 });
}

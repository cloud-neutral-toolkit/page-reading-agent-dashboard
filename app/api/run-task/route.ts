import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Read the Cloud Run Service URL from environment variables
        const serviceUrl = process.env.AGENT_SERVICE_URL;

        if (!serviceUrl) {
            throw new Error('AGENT_SERVICE_URL environment variable is not set');
        }

        console.log(`Proxying task to Agent Service: ${serviceUrl}`);

        // Determine endpoint based on request body
        const endpoint = body.endpoint || '';
        const targetUrl = `${serviceUrl}${endpoint}`;

        console.log(`Target URL: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Agent Service failed [${response.status}]: ${errText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Task execution failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


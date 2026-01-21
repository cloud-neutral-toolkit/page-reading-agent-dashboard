import { NextResponse } from 'next/server';
import { executeCloudRunJob } from '@/lib/gcp';

// 映射表：前端选项 -> 真实的 Job 名称和区域
const JOBS = {
    'JP': { region: 'asia-northeast1', name: 'agent-tokyo' },
    'US': { region: 'us-central1', name: 'agent-us' }
};

export async function POST(req: Request) {
    try {
        const { url, mode, device, region } = await req.json();
        const targetJob = JOBS[region as keyof typeof JOBS];

        if (!targetJob) throw new Error('Invalid Region');

        // Make sure we pass strings for all environment variables
        await executeCloudRunJob(targetJob.region, targetJob.name, {
            TARGET_URL: url,
            MODE: mode,
            DEVICE: device,
            REGION_HINT: region
        });

        return NextResponse.json({ success: true, message: 'Agent Dispatched 🚀' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

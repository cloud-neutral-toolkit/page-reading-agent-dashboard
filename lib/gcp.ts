import { GoogleAuth } from 'google-auth-library';

export async function executeCloudRunJob(
  region: string, 
  jobName: string, 
  envVars: Record<string, string>
) {
  // Vercel 环境变量中读取 Service Account Key
  const credentials = JSON.parse(process.env.GCP_SA_KEY || '{}');
  
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  
  const url = `https://run.googleapis.com/v1/projects/${projectId}/locations/${region}/jobs/${jobName}:run`;

  // 构造 Cloud Run 覆盖参数
  const overrides = {
    containerOverrides: [{
      env: Object.entries(envVars).map(([name, value]) => ({ name, value }))
    }]
  };

  return client.request({
    url,
    method: 'POST',
    data: { overrides }
  });
}

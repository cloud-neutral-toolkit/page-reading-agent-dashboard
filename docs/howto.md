# How to Configure and Deploy Page-Reading-Agent Dashboard

This document outlines the steps to connect your Vercel dashboard to your Google Cloud Run jobs securely.

## 1. Google Cloud Platform Setup

### Create a Service Account (SA)
1. Go to **IAM & Admin** > **Service Accounts** in the Google Cloud Console.
2. Click **Create Service Account**.
3. Name it `agent-invoker` (or similar).
4. Click **Create and Continue**.

### Grant Permissions
1. In the **Grant this service account access to project** section, search for and select the role:
   - **Cloud Run Invoker** (allows triggering jobs)
2. Click **Continue** and then **Done**.

### Generate a Key
1. Click on the newly created Service Account (`agent-invoker@...`).
2. Go to the **Keys** tab.
3. Click **Add Key** > **Create new key**.
4. Select **JSON** and click **Create**.
5. A JSON file will be downloaded to your computer. Keep this safe!

## 2. Vercel Configuration

### Add Environment Variable
1. Open the JSON key file you just downloaded in a text editor.
2. Copy the **entire content** of the file.
3. Go to your Vercel Project Settings.
4. Navigate to **Environment Variables**.
5. Add a new variable:
   - **Key**: `GCP_SA_KEY`
   - **Value**: Paste the JSON content here. (Ensure there are no extra spaces or line breaks that invalidate the JSON, though Vercel handles multi-line values well).
6. Save the variable.

## 3. Deployment Workflow

### Decoupled Architecture
This system is designed to be decoupled:

*   **Agent Logic**: stored in the `Page-Reading-Agent` repository.
    *   Update `behaviors.js` and push to GitHub.
    *   Google Cloud Build will automatically build the new container image.
*   **Dashboard UI**: stored in the `Page-Reading-Agent-dashboard` repository (this one).
    *   Update the UI or API logic and push to GitHub.
    *   Vercel will automatically redeploy the frontend.

### Usage
1. Open your Vercel deployment URL.
2. Select the **Region**, **Mode**, and **Device Persona**.
3. Enter the target **URL**.
4. Click **Dispatch Agent**.
5. Vercel will use the `GCP_SA_KEY` to authenticate with Google Cloud and trigger the appropriate Cloud Run Job (`agent-tokyo` or `agent-us`) with your specified parameters.

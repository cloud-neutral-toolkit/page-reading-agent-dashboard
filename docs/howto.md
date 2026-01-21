# How to Configure and Deploy Page-Reading-Agent Dashboard

This document outlines the steps to connect your Vercel dashboard to your Page Reading Agent Backend.

> **Update**: As of Jan 2026, the architecture has migrated from Cloud Run Jobs to a **Cloud Run Service**. This simplifies configuration and improves latency.

## 1. Prerequisites

Ensure you have deployed the **Page Reading Agent Backend** to Google Cloud Run (Service mode).
After deployment, you should have a Service URL looking like:
`https://page-reading-svc-plus-xxxxx.run.app`

## 2. Vercel Configuration

The dashboard requires only one environment variable to know where to send reading tasks.

### Add Environment Variable
1. Go to your Vercel Project Settings > **Environment Variables**.
2. Add a new variable:
   - **Key**: `AGENT_SERVICE_URL`
   - **Value**: Your Cloud Run Service URL (e.g., `https://page-reading-svc-plus-xyz.run.app`)

*Note: You no longer need `GCP_SA_KEY` or `GOOGLE_APPLICATION_CREDENTIALS`.*

## 3. Architecture Overview

*   **Frontend (Vercel)**:
    *   User inputs URL and config (Mode, Device, Region).
    *   Sends a POST request to its own API route `/api/run-task`.
    *   The API route proxies this request to the Cloud Run Backend.
*   **Backend (Cloud Run Service)**:
    *   Receives the HTTP request.
    *   Launches a headless browser (Playwright).
    *   Performs the reading task.
    *   Returns the JSON result directly to the frontend.

## 4. Local Development

To run the dashboard locally:

1. Create a `.env.local` file in the root directory:
   ```bash
   AGENT_SERVICE_URL=https://page-reading-svc-plus-xxxxx.run.app
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

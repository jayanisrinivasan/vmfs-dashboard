# VMFS Dashboard

AI Safety Verification Mechanisms Framework Dashboard

## Environment Variables

### For Local Development

Create a `.env` file in the root directory:

```
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### For Vercel Deployment

**IMPORTANT**: You must add the environment variable in Vercel's dashboard for the deployment to work.

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_GOOGLE_AI_API_KEY`
   - **Value**: Your Google AI API key
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application (go to Deployments → click the three dots on the latest deployment → Redeploy)

### Getting a Google AI API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key and add it to your environment variables

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Make sure your MongoDB Atlas database is accessible from anywhere (0.0.0.0/0) for production

## Environment Variables
Before deploying, you need to set up environment variables in your Vercel dashboard:

1. `MONGODB_URI` - Your MongoDB Atlas connection string
2. `NODE_ENV` - Set to "production"
3. `FRONTEND_URL` - Your frontend domain (optional, for CORS)

## Deployment Steps

### First-time deployment:
```bash
# Navigate to your backend directory
cd cameraAI_be

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: camera-ai-backend (or your preferred name)
# - In which directory is your code located? ./
```

### Subsequent deployments:
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

## Environment Variables Setup via CLI
```bash
# Set environment variables
vercel env add MONGODB_URI
vercel env add NODE_ENV
vercel env add FRONTEND_URL

# Or add them via Vercel dashboard at https://vercel.com/your-username/your-project/settings/environment-variables
```

## Testing Your Deployment
After deployment, test your API endpoints:
- Root: `https://your-project.vercel.app/`
- Health: `https://your-project.vercel.app/api/health`
- Blogs: `https://your-project.vercel.app/api/blogs`

## Notes
- The API will be available at the root path `/` and `/api/*` routes
- MongoDB Atlas must allow connections from 0.0.0.0/0 for Vercel deployment
- Update your frontend to use the new Vercel API URL
- CORS is configured to allow your frontend domain

## Troubleshooting
- Check Vercel function logs in the dashboard
- Ensure all environment variables are set correctly
- Verify MongoDB Atlas network access settings
- Check that all dependencies are in package.json (not just devDependencies)

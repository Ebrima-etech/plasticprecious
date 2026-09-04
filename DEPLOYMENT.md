# Frontend Deployment Guide (Vercel)

## Overview

This Next.js application is optimized for deployment on Vercel. Vercel provides:
- Automatic deployments on git push
- Edge caching for static assets
- Serverless functions for API routes
- Built-in analytics and monitoring
- Automatic SSL/HTTPS
- Global CDN

## Prerequisites

- GitHub account and repository
- Vercel account (free tier available)
- Backend API deployed (see backend DEPLOYMENT.md)
- Domain name (optional)

## Deployment Steps

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 2. Import Project to Vercel

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and import `plasticprecious` repository
4. Click "Import"

### 3. Configure Environment Variables

1. In Vercel dashboard, go to Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key_here
NODE_ENV=production
```

3. Click "Save"

### 4. Configure Build Settings

1. Go to Settings → Build & Development Settings
2. Verify:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
3. Click "Save"

### 5. Deploy

Option A: Automatic (Recommended)
- Push to main branch: `git push origin main`
- Vercel automatically deploys
- Monitor progress in Vercel dashboard

Option B: Manual
1. Click "Deploy" in Vercel dashboard
2. Select branch and deploy

## Post-Deployment Configuration

### 1. Connect Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. HTTPS is automatically provisioned via Let's Encrypt

### 2. Configure Production URL in Backend

Update backend CORS settings:

```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Set Up Analytics (Optional)

1. In Vercel dashboard, go to Analytics
2. Monitor:
   - Page performance
   - User engagement
   - Web Vitals
   - Error rates

## Environment-Specific Configuration

### Development Environment
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Staging Environment
```env
NEXT_PUBLIC_API_URL=https://staging-api.onrender.com/api
```

### Production Environment
```env
NEXT_PUBLIC_API_URL=https://api.onrender.com/api
```

## Optimization Best Practices

### 1. Image Optimization

Next.js automatically optimizes images with:
- Automatic format selection (WebP/AVIF)
- Responsive image sizing
- Lazy loading

Ensure all images use `next/image`:
```tsx
import Image from 'next/image';

<Image 
  src="/image.jpg" 
  alt="Description"
  width={800}
  height={600}
/>
```

### 2. Code Splitting

Next.js automatically splits code by route. For large components:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'));
```

### 3. Static Generation

Use `getStaticProps` for pages that can be pre-built:
```tsx
export async function getStaticProps() {
  const data = await fetch('...');
  return {
    props: { data },
    revalidate: 3600 // ISR: revalidate every hour
  };
}
```

### 4. Caching Headers

Configured in `vercel.json`:
- Static assets: 1 year (immutable)
- API routes: no-cache (always fresh)
- HTML: regular caching

## Monitoring & Debugging

### 1. Check Deployments

```bash
# List recent deployments
vercel ls

# View logs of latest deployment
vercel logs
```

### 2. View Analytics

In Vercel dashboard:
- Performance metrics (LCP, FID, CLS)
- Page routes and their performance
- Error tracking

### 3. Environment Variables

Ensure all required variables are set:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe publishable key

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

Solution:
```bash
npm run build  # Test locally first
```

### API Errors

If backend API is unreachable:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend is deployed and running
3. Check CORS settings on backend

### Performance Issues

1. Check Web Vitals in Analytics
2. Identify slow pages
3. Optimize with dynamic imports or image optimization

### 404 Errors

Vercel automatically redirects to 404 page. Ensure:
- All page files are in `/src/app/`
- Routes use Next.js file-based routing

## Rollback Procedure

If something breaks in production:

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click the deployment
4. Click "Promote to Production"

Alternatively, revert git commit and push:
```bash
git revert <commit-hash>
git push origin main
```

## Continuous Deployment

### Automatic Preview Deployments

- Every pull request gets its own preview URL
- Useful for testing before merging
- Found in PR checks

### Staging Environment

Option 1: Use separate Vercel project
```bash
git checkout -b staging
# Make changes
git push origin staging
# Configure staging branch in Vercel
```

Option 2: Use Vercel environments
1. Create environment with staging branch
2. Use staging environment variables
3. Deploy to staging before production

## Performance Optimization

### Core Web Vitals Target Scores

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

Monitor in Vercel Analytics and optimize:

1. **Improve LCP**:
   - Optimize images
   - Reduce CSS/JS
   - Use dynamic imports

2. **Improve FID**:
   - Reduce JavaScript
   - Use web workers for heavy tasks
   - Lazy load non-critical scripts

3. **Improve CLS**:
   - Set explicit dimensions for media
   - Avoid dynamic content
   - Use transform/opacity for animations

## Security Checklist

- [ ] Remove debug logging from production code
- [ ] All API keys use environment variables
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Security headers are set (configured in vercel.json)
- [ ] API rate limiting is enabled
- [ ] CORS only allows trusted domains
- [ ] No hardcoded secrets in code

## Git Workflow for Deployments

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git commit -m "Add feature"

# Create pull request
git push origin feature/my-feature
# Create PR on GitHub

# Vercel creates preview deployment
# Review and test

# Merge to main
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main

# Vercel automatically deploys to production
```

## Useful Commands

```bash
# Deploy locally (requires CLI)
npm i -g vercel
vercel

# View live logs
vercel logs --follow

# View environment variables
vercel env list

# Pull environment variables
vercel env pull .env.local

# List all deployments
vercel list
```

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support

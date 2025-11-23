# 🚀 Deployment Guide - CAIA Clinic

This guide explains how to deploy your application to production and configure Google Calendar integration.

## 📋 Pre-Deployment Checklist

### 1. **Update Google Cloud Console**

Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

**Add Production Redirect URIs:**
```
https://api.yourdomain.com/api/doctor/calendar/google/callback
https://yourdomain.com/api/doctor/calendar/google/callback
```

**Keep Development URIs:**
```
http://localhost:3000/api/doctor/calendar/google/callback
```

### 2. **Enable Google Calendar API**
- Go to APIs & Services → Library
- Search for "Google Calendar API"
- Click "Enable"

## 🔧 Backend Deployment

### Recommended Platforms:
- **Render** (easiest, free tier available)
- **Railway** (easy, free tier)
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk** (more complex)
- **Heroku** (paid)

### Environment Variables for Production:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Database
DATABASE_URL=your_production_postgresql_url

# Security
JWT_SIGNING_KEY=your_jwt_signing_key
ENCRYPTION_KEY=your_encryption_key

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# AssemblyAI
ASSEMBLYAI_API_KEY=your_key

# Google Calendar OAuth
GOOGLE_CALENDAR_OAUTH_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CALENDAR_OAUTH_CLIENT_SECRET=your_google_client_secret

# Microsoft Graph (future)
MS_GRAPH_CLIENT_ID=your_ms_graph_client_id
MS_GRAPH_CLIENT_SECRET=your_ms_graph_client_secret

# Object Storage
OBJECT_STORAGE_BUCKET=patient-files
OBJECT_STORAGE_ENDPOINT=https://your-project.supabase.co/storage/v1
OBJECT_STORAGE_ACCESS_KEY=your_key
OBJECT_STORAGE_SECRET_KEY=your_secret
```

### Deploy to Render (Example):

1. Push code to GitHub
2. Go to [Render Dashboard](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: caia-clinic-backend
   - **Environment**: Node
   - **Build Command**: `npm install && cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
   - **Add Environment Variables** (from above)
6. Click "Create Web Service"

## 🎨 Frontend Deployment

### Recommended Platforms:
- **Vercel** (best for React, free)
- **Netlify** (easy, free)
- **Render** (can host both backend/frontend)

### Environment Variables for Production:

Create a `.env.production` file:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Deploy to Vercel (Example):

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**:
     - `REACT_APP_API_URL` = `https://api.yourdomain.com/api`
6. Click "Deploy"

### Or Deploy to Netlify:

1. Push code to GitHub
2. Go to [Netlify Dashboard](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment variables**:
     - `REACT_APP_API_URL` = `https://api.yourdomain.com/api`
6. Click "Deploy site"

## 🗄️ Database Setup (Production)

### Using Neon (Current Provider):

Your current DATABASE_URL already points to Neon. For production:

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new database or use existing
3. Copy the connection string
4. Update `DATABASE_URL` in your backend environment variables

### Alternative: Supabase PostgreSQL

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use connection pooler for production)
5. Update `DATABASE_URL`

## 🔒 Security Checklist

- [ ] Never commit `.env` files to Git
- [ ] Use environment variables on hosting platforms
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS for all production URLs
- [ ] Keep API keys secret
- [ ] Enable rate limiting on API endpoints
- [ ] Set up proper logging and monitoring

## 📊 Post-Deployment Steps

### 1. **Run Database Migration**
After deploying backend:
```bash
npx prisma db push
# or
npx prisma migrate deploy
```

### 2. **Test Calendar Integration**
- Log in to doctor dashboard
- Go to Settings
- Click "Connect Google Calendar"
- Verify OAuth flow works with production URLs

### 3. **Configure CORS**
Update your backend CORS settings in `src/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
```

### 4. **Test All Features**
- [ ] Doctor login
- [ ] Patient portal
- [ ] Visit recording and processing
- [ ] AI assistant responses
- [ ] Calendar connection
- [ ] Appointment scheduling
- [ ] Real-time WebSocket updates

## 🌐 Custom Domain Setup

### Backend Domain:
1. Buy domain (e.g., from Namecheap, Google Domains)
2. Add CNAME record: `api.yourdomain.com` → your-backend.onrender.com
3. Enable SSL certificate (automatic on most platforms)

### Frontend Domain:
1. Add CNAME record: `www.yourdomain.com` → your-frontend.vercel.app
2. Add A record: `@` → your hosting provider's IP
3. Enable SSL certificate (automatic)

## 🔄 OAuth Redirect URIs Summary

After deployment, your Google Cloud Console should have:

**Development:**
```
http://localhost:3000/api/doctor/calendar/google/callback
```

**Production:**
```
https://api.yourdomain.com/api/doctor/calendar/google/callback
```

**Both work simultaneously** - Google will use the correct one based on the environment.

## 📝 Environment Variables Quick Reference

### Frontend (.env.production):
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Backend (Production):
```env
NODE_ENV=production
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
GOOGLE_CALENDAR_OAUTH_CLIENT_ID=...
GOOGLE_CALENDAR_OAUTH_CLIENT_SECRET=...
# ... all other variables from .env
```

## 🆘 Troubleshooting

### Calendar Connection Fails in Production:
1. Verify redirect URI is added in Google Cloud Console
2. Check `BACKEND_URL` environment variable is correct
3. Ensure SSL certificate is active (HTTPS required)
4. Check browser console for CORS errors

### Database Connection Issues:
1. Verify DATABASE_URL is correct
2. Check if database accepts connections from your hosting IP
3. Use connection pooling for production
4. Enable SSL mode for PostgreSQL

### CORS Errors:
1. Update CORS origin in backend code
2. Ensure `FRONTEND_URL` environment variable is set
3. Check if credentials: true is set

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## 🎉 Success!

Once deployed, your application URLs will be:
- **Doctor Dashboard**: https://yourdomain.com
- **Patient Portal**: https://yourdomain.com/patient
- **API**: https://api.yourdomain.com

The calendar integration will work seamlessly across both development and production environments!

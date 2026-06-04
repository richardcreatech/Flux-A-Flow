# Deployment Guide - CORS & Environment Configuration

## What Was Fixed

### Backend CORS Issues

1. **Updated `/backend/app.js`** with proper CORS configuration
   - Dynamic origin checking instead of hardcoded array
   - Added `OPTIONS` method support
   - Configured Socket.IO CORS properly
   - Environment variable support for allowed origins

2. **Created `/backend/.env.example`**
   - Template for all required environment variables
   - CORS origins now configurable via `ALLOWED_ORIGINS` env var
   - Added JWT_SECRET, Cloudinary, and email configuration templates

### Frontend API URL Issues

1. **Created `/frontend/src/config/api.js`**
   - Centralized API base URL configuration
   - Uses `VITE_API_URL` environment variable
   - Falls back to `http://localhost:5000` for local development

2. **Updated all frontend API calls** (19 replacements across 5 files):
   - `SignUp.jsx` - Sign up endpoint
   - `Login.jsx` - Sign in endpoint
   - `Profile.jsx` - Profile management endpoints
   - `Prod.jsx` - Products listing
   - `SingleMarket.jsx` - Marketplace operations
   - `Reviews.jsx` - Reviews endpoints
   - `Revenue.jsx` - Revenue and bank details
   - `Marketplace.jsx` - Marketplace management

3. **Created `/frontend/.env.example`**
   - Template for frontend environment variables

## Setup Instructions

### Local Development

#### Backend Setup

1. Copy environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your local configuration:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_dev_secret
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=development
   ```

3. Start backend:
   ```bash
   npm start
   ```

#### Frontend Setup

1. Copy environment file:

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. `.env.local` should contain:

   ```
   VITE_API_URL=http://localhost:5000
   ```

3. Start frontend:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Backend (Render/Heroku/Any Node Host)

1. Set environment variables in your hosting dashboard:
   ```
   PORT=5000
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_strong_production_secret
   ALLOWED_ORIGINS=https://flux-a-flow-frontend.netlify.app,https://your-backend-url.com
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=production
   ```

#### Frontend (Netlify/Vercel/Any Static Host)

1. Set environment variables in your hosting dashboard:

   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Build command:

   ```bash
   npm run build
   ```

3. Deploy the `dist/` folder

## CORS Flow Explained

### How It Works Now

```
Frontend Request:
  [Netlify Frontend]
       ↓ (with origin header)
  [Check CORS]
       ↓ (if origin in ALLOWED_ORIGINS list)
  [Backend API] ✅ Success

If origin not in list:
  [CORS Error] ❌ Request blocked
```

### Common CORS Issues & Solutions

| Issue                            | Cause                                       | Solution                                          |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| CORS error in production         | Frontend URL not in backend ALLOWED_ORIGINS | Add frontend URL to backend env vars              |
| Works locally, not on production | Hardcoded localhost URLs                    | Now using env variables ✅                        |
| Multiple frontend domains fail   | Only one origin was allowed                 | ALLOWED_ORIGINS now supports comma-separated list |
| Socket.IO connection fails       | Socket.IO CORS not configured               | Now properly configured ✅                        |

## Key Files Changed

### Backend

- ✅ `/backend/app.js` - Enhanced CORS configuration
- ✅ `/backend/.env.example` - Environment template

### Frontend

- ✅ `/frontend/src/config/api.js` - NEW: Centralized API config
- ✅ `/frontend/.env.example` - NEW: Environment template
- ✅ 5 page files with 19 URL replacements

## Testing the Fix

### Local Testing

```bash
# Terminal 1: Start backend
cd backend
npm start
# Should log: Listening on port 5000

# Terminal 2: Start frontend
cd frontend
npm run dev
# Should show: Local: http://localhost:5173

# Open http://localhost:5173 and test login/signup
```

### Production Testing

1. Deploy backend with correct ALLOWED_ORIGINS
2. Deploy frontend with correct VITE_API_URL
3. Test API calls from browser DevTools console
4. Check for CORS errors in Network tab
5. If issues persist, verify both URLs match exactly (with/without trailing slashes, http vs https)

## Troubleshooting

### Still Getting CORS Errors?

1. Check browser console for exact error message
2. Verify frontend URL matches exactly in backend ALLOWED_ORIGINS
3. Ensure https/http protocol matches
4. Clear browser cache and cookies
5. Check backend is running and accessible

### API Calls Still Using Old URLs?

1. Ensure `API_BASE_URL` import is in your component
2. Clear `node_modules` and reinstall: `npm install`
3. If using old built files, clear them: `npm run build`
4. Restart dev server: Kill and restart `npm run dev`

## Next Steps

- Test all endpoints locally
- Deploy backend to production hosting
- Deploy frontend to production hosting
- Monitor for any CORS errors
- If issues arise, check environment variables in hosting dashboard

# Kids Activities Platform - Deployment Guide

## 🚀 Complete Deployment Instructions for Vercel

### Overview
This is a production-ready Next.js application with advanced filtering, Foursquare API integration, and Supabase authentication. The platform helps parents find quality kids activities across 26 major US cities.

## 📋 Prerequisites
- Supabase account (free tier supports 50,000+ users)
- Vercel account (free tier included)
- Your Foursquare Places API key: `fsq3XsKV4HbYMhNyFB05tbPv+Yo7zywhCk2Fj40LALqEYnM=`

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Project settings:
   - **Name**: `kids-activities-prod`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: US East (for better performance)

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste and click **"Run"**
5. Verify tables are created (should see: users, cities, activities, etc.)

### 1.3 Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚀 Step 2: Deploy to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with email (GitHub not required)

### 2.2 Deploy Project
1. Click **"New Project"**
2. Choose **"Browse"** to upload files
3. Upload your entire `kids-activities-platform` folder
4. Vercel will automatically detect it's a Next.js project
5. Click **"Deploy"**

### 2.3 Configure Environment Variables
After deployment, go to your project settings:

1. Click **"Settings"** → **"Environment Variables"**
2. Add these 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FOURSQUARE_API_KEY = fsq3XsKV4HbYMhNyFB05tbPv+Yo7zywhCk2Fj40LALqEYnM=
```

3. Click **"Save"**
4. Go to **"Deployments"** → **"Redeploy"** to apply the variables

## 📊 Step 3: Import Real Data

### 3.1 Create Admin User
1. Sign up on your deployed site
2. In Supabase dashboard, go to **Authentication** → **Users**
3. Find your user and click to edit
4. In **Raw User Meta Data**, add:
```json
{
  "role": "admin"
}
```
5. Save changes

### 3.2 Start Data Import
1. Go to your site: `https://your-app.vercel.app/admin/import`
2. Select cities and categories to import
3. Click **"Start Import"** to begin scraping Foursquare data
4. Monitor progress in real-time

**Expected Results:**
- **NYC**: ~400 quality activities
- **LA**: ~400 activities  
- **Chicago**: ~400 activities
- **Dallas**: ~200 activities
- **Austin**: ~180 activities
- **Washington DC**: ~200 activities
- **Total**: ~3,000-4,000 high-quality listings

## 🎯 Step 4: Platform Features

### 4.1 Advanced Filtering
- **11 Categories**: Daycare, Preschools, After-School (Academic/STEM/Arts/Sports), Summer Camps (Traditional/Sports/Arts/STEM/Specialty)
- **Age Groups**: Infants (0-12 months) through High School (14-18 years)
- **Themes**: Montessori, Waldorf, Bilingual, Religious, STEM, Sports-specific
- **Quality Filters**: 4+ stars, 10+ reviews minimum
- **Languages**: English, Spanish, French, Chinese, etc.
- **Religious Affiliation**: Catholic, Jewish, Islamic, Protestant, etc.

### 4.2 User Features
- **Authentication**: Sign up/sign in with Supabase
- **Favorites**: Save activities for later
- **Search**: Advanced text search with filters
- **Mobile Responsive**: Works perfectly on all devices

### 4.3 Business Features
- **Claim Listings**: Business owners can claim their listings
- **Add New Listings**: Request form for new businesses
- **Admin Panel**: Complete management dashboard
- **Analytics**: User engagement and activity metrics

## 🔧 Step 5: Customization

### 5.1 Branding
- Update logo in `src/components/Header.tsx`
- Modify colors in `tailwind.config.js`
- Change site name in `src/app/layout.tsx`

### 5.2 Cities
- Add more cities in `supabase-schema.sql`
- Update coordinates in `src/lib/foursquare-enhanced.ts`
- Adjust target numbers based on market size

### 5.3 Categories
- Modify categories in `src/lib/foursquare-enhanced.ts`
- Update UI labels in `src/components/AdvancedFilters.tsx`
- Adjust Foursquare search queries for better results

## 📈 Step 6: Scaling & Monitoring

### 6.1 Performance
- **Vercel**: Automatically scales to handle traffic
- **Supabase**: Free tier supports 50,000 monthly active users
- **Caching**: 24-hour cache on Foursquare API calls

### 6.2 Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database performance and usage
- **Error Tracking**: Built-in error boundaries

### 6.3 Upgrades
- **Vercel Pro**: $20/month for custom domains and advanced features
- **Supabase Pro**: $25/month for higher limits and backups
- **Foursquare**: Monitor API usage and upgrade if needed

## 🛡️ Security Features

### 6.1 Authentication
- **Row Level Security (RLS)**: Database-level security
- **JWT Tokens**: Secure session management
- **Role-based Access**: Admin vs regular users

### 6.2 Data Protection
- **Input Validation**: All forms validated
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: Built-in API protection

## 📞 Support & Maintenance

### 6.1 Regular Tasks
- **Data Updates**: Re-run imports monthly for fresh data
- **User Management**: Monitor signups and engagement
- **Content Moderation**: Review new business submissions

### 6.2 Troubleshooting
- **Build Errors**: Check environment variables
- **Database Issues**: Verify Supabase connection
- **API Limits**: Monitor Foursquare usage

## 🎉 Launch Checklist

- [ ] Supabase database created and schema deployed
- [ ] Environment variables configured in Vercel
- [ ] Admin user created with proper role
- [ ] Initial data import completed (at least 1,000 activities)
- [ ] Legal pages reviewed (Terms of Service, Privacy Policy)
- [ ] Contact information updated
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking enabled
- [ ] Backup strategy in place

## 📊 Expected Performance

### Traffic Capacity
- **Concurrent Users**: 1,000+ (Vercel free tier)
- **Database**: 50,000 monthly active users (Supabase free tier)
- **API Calls**: 1,000/day (Foursquare free tier)

### Data Quality
- **Minimum Rating**: 4.0 stars
- **Minimum Reviews**: 10 reviews
- **Geographic Accuracy**: Within city boundaries
- **Content Relevance**: Kids-focused businesses only

Your Kids Activities Platform is now ready for production! 🚀


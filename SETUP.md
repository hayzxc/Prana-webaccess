# Prana Argentum - Certificate Portal Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Git

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd certification-portal
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 3. Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
\`\`\`

### 4. Supabase Configuration

#### Get Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the following:
   - Project URL
   - Anon (public) key
   - Service role (secret) key

#### Update .env.local
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

#### Setup Database Tables
1. Go to Supabase Dashboard → SQL Editor
2. Run the setup script from `scripts/setup-database.sql`
3. Or copy and paste the SQL commands manually

### 5. Generate JWT Secret
\`\`\`bash
# Generate a secure JWT secret
openssl rand -base64 32

# Add to .env.local
JWT_SECRET=your_generated_secret_here
\`\`\`

### 6. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Default Admin Account

After setting up the database, you can create an admin account:

**Email:** admin@pranaargentum.com  
**Password:** admin123  
**Role:** admin

## 📋 Features

### For Admins
- ✅ Certificate Management (Upload, View, Delete)
- ✅ Phytosanitary Certificate Management
- ✅ Fumigation Tracking System
- ✅ User Management
- ✅ Record Sheet Management
- ✅ Dashboard Analytics

### For Users
- ✅ View Personal Certificates
- ✅ Download Certificates
- ✅ Track Fumigation Progress
- ✅ Access Phytosanitary Certificates
- ✅ View Record Sheets
- ✅ Container Tracking

## 🚀 Production Deployment

### Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your Git repository

2. **Environment Variables**
   Add these in Vercel Project Settings → Environment Variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXTAUTH_SECRET
   JWT_SECRET
   \`\`\`

3. **Deploy**
   - Vercel will automatically deploy on git push
   - Or manually trigger deployment from dashboard

### Custom Domain (Optional)
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## 🛠️ Development

### Project Structure
\`\`\`
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities and configurations
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
\`\`\`

### Database Management
\`\`\`bash
# Pull database schema
supabase db pull

# Push schema changes
supabase db push

# Generate types
supabase gen types typescript --local > types/database.types.ts
\`\`\`

## 🔧 Configuration

### Supabase Setup
1. **Authentication**: Email/password authentication enabled
2. **Row Level Security**: Enabled for all tables
3. **Storage**: Public bucket for certificates and files
4. **API**: Auto-generated REST API

### File Upload
- **Max Size**: 10MB per file
- **Allowed Types**: PDF, JPG, JPEG, PNG
- **Storage**: Supabase Storage with CDN

### Security
- **JWT Authentication**: Custom JWT implementation
- **Role-based Access**: Admin and User roles
- **CORS**: Configured for production domains
- **Environment Variables**: Secure credential management

## 🐛 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
\`\`\`
Error: supabaseUrl is required
\`\`\`
**Solution**: Check environment variables are set correctly

#### 2. Build Fails on Vercel
\`\`\`
Error: Failed to collect page data
\`\`\`
**Solution**: Ensure all environment variables are set in Vercel

#### 3. Authentication Not Working
\`\`\`
Error: JWT secret not configured
\`\`\`
**Solution**: Generate and set JWT_SECRET in environment

#### 4. File Upload Fails
\`\`\`
Error: Storage bucket not found
\`\`\`
**Solution**: Create public storage bucket in Supabase

### Getting Help
1. Check the console for error messages
2. Verify environment variables
3. Check Supabase dashboard for API status
4. Review network requests in browser dev tools

## 📞 Support

For technical support or questions:
- Email: support@pranaargentum.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release with basic certificate management
- **v1.1.0**: Added fumigation tracking system
- **v1.2.0**: Phytosanitary certificate management
- **v1.3.0**: Record sheet integration
- **v1.4.0**: Enhanced user dashboard and API improvements

### Updating
\`\`\`bash
git pull origin main
npm install --legacy-peer-deps
npm run build
\`\`\`

## 📄 License

This project is proprietary software owned by Prana Argentum.
All rights reserved.

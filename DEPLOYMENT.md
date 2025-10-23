# Deployment Guide

This guide covers deploying the PT Prana Argentum Certification Portal to various platforms.

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   \`\`\`
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   DATABASE_URL=your-database-url
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   \`\`\`

3. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be available at the provided URL

### Custom Domain Setup

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Database Setup

### Supabase (Recommended)

1. Create a new project at [Supabase](https://supabase.com)
2. Run the SQL scripts from `/scripts/setup-database.sql`
3. Configure Row Level Security (RLS) policies
4. Add environment variables to Vercel

### PostgreSQL

1. Set up PostgreSQL database
2. Run migration scripts
3. Configure connection string
4. Set DATABASE_URL environment variable

## File Storage

### Vercel Blob Storage

1. Enable Vercel Blob in your project
2. Configure upload endpoints
3. Update file upload components

### Supabase Storage

1. Create storage buckets in Supabase
2. Configure bucket policies
3. Update file upload logic

## Environment Variables

### Required Variables
\`\`\`env
# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# File Upload
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx
\`\`\`

### Optional Variables
\`\`\`env
# Email (if using email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
\`\`\`

## Build Configuration

### Next.js Configuration
The project includes optimized build settings in `next.config.js`:

- Image optimization
- Webpack configuration
- API route handling
- Static file serving

### Performance Optimizations

1. **Image Optimization**
   - Next.js Image component
   - WebP format support
   - Lazy loading

2. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

3. **Caching**
   - Static generation
   - API response caching
   - CDN integration

## Monitoring and Analytics

### Error Tracking
- Sentry integration
- Error boundaries
- API error logging

### Performance Monitoring
- Web Vitals tracking
- Lighthouse CI
- Performance budgets

### User Analytics
- Google Analytics
- User behavior tracking
- Conversion tracking

## Security Considerations

### Authentication
- Secure session management
- CSRF protection
- Rate limiting

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection

### File Upload Security
- File type validation
- Size limits
- Virus scanning

## Backup and Recovery

### Database Backups
- Automated daily backups
- Point-in-time recovery
- Backup verification

### File Backups
- Cloud storage replication
- Version control
- Disaster recovery plan

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Review dependency versions

2. **Database Connection**
   - Verify connection string
   - Check firewall settings
   - Test database connectivity

3. **File Upload Issues**
   - Check file size limits
   - Verify storage permissions
   - Review upload configuration

### Support

For deployment support, contact the development team or refer to the platform documentation:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

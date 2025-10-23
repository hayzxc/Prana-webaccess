# PT Prana Argentum - Certification & Service Management Portal

A comprehensive web application for managing fumigation certificates, phytosanitary certifications, and various inspection services for PT Prana Argentum.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Secure Login System**: JWT-based authentication with httpOnly cookies
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Session Management**: Automatic token refresh and secure logout

### 📋 Certificate Management
- **Multi-Service Certificates**: Support for 7+ service types
  - Fumigation
  - ISPM (Phytosanitary)
  - Cargo Survey
  - Marine Survey
  - Pre-shipment Inspection
  - Insurance Survey
  - Quality Control
- **Certificate Upload**: Secure file upload with validation
- **Certificate Generation**: Generate certificates from customizable Word templates
- **Certificate Preview**: View and download certificates in various formats
- **Auto-Suggest**: Smart autocomplete for email, names, container numbers, and locations
- **Phytosanitary Certificates**: Special handling for ISPM compliance documents

### 📦 Fumigation Tracking System
- **Container Tracking**: Real-time tracking of fumigation containers
- **Progress Monitoring**: Multi-stage progress tracking (Pending → Gassing → Aeration → Ready → Completed)
- **Automated Calculations**: Auto-calculate aeration and container ready times (27-hour fumigation cycle)
- **Customer Notifications**: Email notifications for status updates
- **Public Tracking Portal**: Customer-facing tracking interface with container number and notice ID

### 📊 Record Sheet Management
- **Gas Reading Records**: Detailed fumigation gas concentration tracking
- **Multi-Point Monitoring**: Record readings from multiple locations
- **Temperature & Humidity**: Environmental condition tracking
- **Inspector Assignment**: Link record sheets to specific inspectors
- **Historical Data**: Complete audit trail of all readings
- **Export Functionality**: Download record sheets in various formats

### 💬 Consultation Request System
- **Customer Portal**: Public-facing consultation request form
- **Service Selection**: Choose from multiple service types
- **Status Tracking**: Monitor request status (Pending → In Progress → Completed → Cancelled)
- **Admin Management**: Review and respond to customer inquiries
- **Email Integration**: Automatic notifications for new requests

### 👥 User Management
- **User CRUD**: Create, read, update, and delete users
- **Role Assignment**: Assign ADMIN or USER roles
- **Password Security**: Bcrypt password hashing
- **User Activity**: Track user-issued certificates

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching support
- **Component Library**: shadcn/ui components
- **Smart Forms**: Auto-suggest and validation
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Skeleton loaders and progress indicators

### 📈 Analytics & Reporting
- **Dashboard Metrics**: Certificate counts, tracking status overview
- **Service Distribution**: Visual breakdown of service types
- **User Statistics**: Track certificates by user and recipient
- **Date Filtering**: Filter records by date ranges

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **API**: Next.js API Routes
- **Authentication**: JWT with custom middleware
- **Database ORM**: Prisma
- **Database**: PostgreSQL (with Prisma Accelerate)
- **Validation**: Zod schema validation

### File Management
- **Upload Handling**: Custom file upload API
- **Storage**: Local filesystem (development), configurable for cloud storage
- **Document Generation**: docxtemplater for Word document generation

### Development Tools
- **Type Safety**: Full TypeScript implementation
- **Linting**: ESLint with Next.js config
- **Code Formatting**: Prettier
- **Version Control**: Git

## 📦 Getting Started

### Prerequisites

```bash
Node.js 18+ or 20+
npm or yarn or pnpm
PostgreSQL database
```

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd prana-v3
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication
JWT_SECRET="your-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret"

# Optional: File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760

# Optional: Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"
```

4. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Login Credentials

### Admin Account
- **Email**: `admin@prana.com`
- **Password**: `admin123`
- **Access**: Full system access, user management, all certificates

### User Account
- **Email**: `user@prana.com`
- **Password**: `user123`
- **Access**: View personal certificates, create record sheets

## 📁 Project Structure

```
prana-v3/
├── app/                          # Next.js app directory
│   ├── about/                   # About page
│   ├── admin/                   # Admin dashboard
│   │   ├── fumigation-tracking.tsx
│   │   ├── generate-certificate/
│   │   └── page.tsx
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── certificates/       # Certificate CRUD + suggestions
│   │   ├── consultation-requests/
│   │   ├── fumigation-trackings/
│   │   ├── record-sheets/
│   │   ├── tracking/           # Public tracking API
│   │   ├── upload/             # File upload handler
│   │   └── users/              # User management
│   ├── dashboard/              # User dashboard
│   ├── login/                  # Login page
│   ├── services/               # Services page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                  # React components
│   ├── admin/                  # Admin-specific components
│   ├── ui/                     # shadcn/ui components
│   │   ├── autocomplete-input.tsx  # Smart autocomplete
│   │   └── ...                 # Other UI components
│   ├── certificate-preview.tsx
│   ├── consultation-modal.tsx
│   ├── container-tracking.tsx
│   ├── file-upload.tsx
│   ├── fumigation-progress.tsx
│   ├── navbar.tsx
│   ├── record-sheet-management.tsx
│   ├── user-management.tsx
│   └── ...
├── lib/                        # Utility libraries
│   ├── api-client.ts          # API client with caching
│   ├── auth-middleware.ts     # JWT authentication
│   ├── auth-utils.ts          # Auth helper functions
│   ├── cache.ts               # In-memory caching
│   ├── error-handler.ts       # Error handling utilities
│   ├── prisma.ts              # Prisma client instance
│   └── utils.ts               # Common utilities
├── prisma/                     # Database schema & migrations
│   ├── migrations/            # Database migration history
│   ├── schema.prisma          # Prisma schema definition
│   └── seed.ts                # Database seeding script
├── public/                     # Static assets
│   ├── certificate_template.docx
│   ├── images/                # Company logos
│   └── uploads/               # Uploaded files
├── types/                      # TypeScript type definitions
│   ├── index.ts
│   └── next-auth.d.ts
├── hooks/                      # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-mobile.tsx
│   └── use-virtual-list.ts
└── middleware.ts               # Next.js middleware
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Certificates
- `GET /api/certificates` - List all certificates (filtered by role)
- `POST /api/certificates` - Create new certificate
- `DELETE /api/certificates/:id` - Delete certificate
- `GET /api/certificates/suggestions` - Get autocomplete suggestions

### Fumigation Tracking
- `GET /api/fumigation-trackings` - List all trackings
- `POST /api/fumigation-trackings` - Create tracking
- `PATCH /api/fumigation-trackings/:id` - Update tracking status
- `DELETE /api/fumigation-trackings/:id` - Delete tracking
- `GET /api/tracking` - Public tracking lookup (by container & notice ID)

### Record Sheets
- `GET /api/record-sheets` - List record sheets
- `POST /api/record-sheets` - Create record sheet
- `DELETE /api/record-sheets/:id` - Delete record sheet
- `POST /api/record-sheets/:id/readings` - Add gas reading

### Consultation Requests
- `GET /api/consultation-requests` - List all requests (admin)
- `POST /api/consultation-requests` - Submit new request (public)
- `PUT /api/consultation-requests/:id` - Update request status
- `DELETE /api/consultation-requests/:id` - Delete request

### Users
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create user (admin only)
- `PATCH /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### File Upload
- `POST /api/upload` - Upload files (max 10MB)

### Certificate Generation
- `POST /api/generate-certificate` - Generate certificate from template

## 🎯 Key Features Explained

### 🤖 Auto-Suggest System
The system implements intelligent autocomplete across all forms:
- **Email addresses**: Suggests previously used recipient emails
- **Names**: Auto-fills recipient and company names
- **Container numbers**: Suggests existing container numbers
- **Notice IDs**: Auto-completes notice identifiers
- **Locations**: Suggests frequently used ports and locations
- **Debounced**: 300ms delay to reduce API calls
- **Case-insensitive**: Finds matches regardless of case

### 📊 Fumigation Progress Tracking
Multi-stage workflow:
1. **PENDING**: Initial status when tracking is created
2. **GASSING**: Container is being fumigated
3. **AERATION**: Fumigant is being removed (auto-calculated)
4. **READY**: Container is ready for release (27 hours post-gassing)
5. **COMPLETED**: Process completed

### 🔒 Security Features
- JWT tokens with httpOnly cookies
- Password hashing with bcrypt
- Role-based access control
- CSRF protection
- Input validation and sanitization
- Secure file upload with type and size validation
- SQL injection prevention via Prisma ORM

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for tablets and phones

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Vercel Deployment

1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Database Migration

```bash
# Production migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## 📊 Database Schema

### Main Tables
- **User**: User accounts with roles
- **Certificate**: All types of certificates
- **FumigationTracking**: Fumigation progress tracking
- **RecordSheet**: Fumigation record sheets
- **GasReading**: Individual gas concentration readings
- **ConsultationRequest**: Customer consultation requests
- **GeneratedCertificate**: Auto-generated certificates

### Enums
- **Role**: ADMIN, USER
- **CertificateStatus**: VALID, EXPIRED, REVOKED
- **ProgressStatus**: PENDING, GASSING, AERATION, READY, COMPLETED
- **ConsultationServiceType**: FUMIGATION, ISPM, CARGO_SURVEY, MARINE_SURVEY, etc.
- **ConsultationStatus**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED

## 🧪 Development

### Run Tests
```bash
npm run test
```

### Database Commands
```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Cloudflare Pages

1. **Prepare for deployment:**
```bash
# Install dependencies
npm install

# Update ESLint (if needed)
npm install eslint@^8.57.0 eslint-config-next@14.2.16 --save-dev
```

2. **Connect to Cloudflare Pages:**
   - Login to Cloudflare Dashboard
   - Go to Pages → Create a project
   - Connect your Git repository

3. **Configure Build Settings:**
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Node version**: `20`

4. **Set Environment Variables** in Cloudflare Dashboard:
```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
NODE_ENV=production
```

5. **Deploy:**
   - Push to your main branch
   - Cloudflare will automatically build and deploy

### Vercel Deployment

1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Database Migration (Production)

```bash
# Production migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-secure-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760

# Optional: Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for **PT Prana Argentum**.  
All rights reserved. © 2024 PT Prana Argentum

## 🆘 Support

For issues and questions:
- **Email**: support@prana.com
- **Documentation**: [Internal Wiki]
- **Issue Tracker**: GitHub Issues

## 📌 Version History

### v3.0.0 (Current)
- ✅ Auto-suggest system for all forms
- ✅ ISPM (Phytosanitary) service type
- ✅ Enhanced error handling and validation
- ✅ Improved certificate management
- ✅ Fumigation tracking system
- ✅ Record sheet management
- ✅ Consultation request system
- ✅ Certificate generation from templates

### v2.0.0
- Certificate management system
- User authentication
- Basic admin dashboard

### v1.0.0
- Initial release
- Basic certificate viewing

---

**Built with ❤️ for PT Prana Argentum**
#   P r a n a - w e b a c c e s s 
 
 
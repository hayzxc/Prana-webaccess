Based on the analysis of the repository `https://github.com/hayzxc/Prana-webaccess`, it appears to be a **Next.js** project using **TypeScript**, **Prisma** (with PostgreSQL), and **Tailwind CSS**. It is designed as a certification and service management portal for "PT Prana Argentum".

Here is a comprehensive `README.md` file tailored for the repository. It organizes the existing information into a professional and easy-to-read format.

```markdown
# PT Prana Argentum - Certification & Service Management Portal

A comprehensive web application for managing fumigation certificates, phytosanitary certifications, and various inspection services for PT Prana Argentum.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-Proprietary-blue.svg)

## 🚀 Features

### Core Functionality
- **🔐 Secure Authentication**: JWT-based authentication with `httpOnly` cookies and session management.
- **busts Role-Based Access Control (RBAC)**: Distinct permissions for **Admin** (system-wide access) and **User** (personal records).
- **📄 Document Generation**: Automated Word document generation using `docxtemplater`.
- **🗃️ Storage**: Supports local filesystem storage (dev) and configurable cloud storage.
- **🔍 Auto-Suggestion**: Smart autocomplete for email addresses and other form fields.

### Modules
- **Certificate Management**: Create, view, and manage fumigation and phytosanitary certificates.
- **Fumigation Tracking**: Track the progress and status of fumigation services.
- **Record Sheets**: Digital gas reading and record sheet management.
- **Consultation Requests**: Public-facing request system with admin management.

### Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Directory)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling**: Tailwind CSS & shadcn/ui
- **Validation**: Zod
- **Deployment**: Railway (suggested by repo URL)

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: v18+ or v20+
- **Package Manager**: npm, yarn, or pnpm
- **Database**: PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/hayzxc/Prana-webaccess.git](https://github.com/hayzxc/Prana-webaccess.git)
   cd Prana-webaccess

```

2. **Install dependencies**
```bash
npm install

```


3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/prana_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"

# Optional: File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760

# Optional: Email Service (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

```


4. **Setup Database**
```bash
# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate deploy

# Seed Initial Data (Admin/User accounts)
npx prisma db seed

```


5. **Run Development Server**
```bash
npm run dev

```


Access the app at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

---

## 🔑 Default Credentials (Seeded)

| Role | Email | Password | Access Level |
| --- | --- | --- | --- |
| **Admin** | `admin@prana.com` | `admin123` | Full system access, user management, all certificates. |
| **User** | `user@prana.com` | `user123` | View personal certificates, create record sheets. |

---

## 📁 Project Structure

```bash
prana-webaccess/
├── app/                  # Next.js App Router pages & API routes
│   ├── admin/            # Admin dashboard views
│   ├── api/              # Backend API endpoints (Auth, Certs, etc.)
│   ├── dashboard/        # User dashboard views
│   └── ...
├── components/           # React components
│   ├── ui/               # Reusable UI components (shadcn)
│   └── ...
├── lib/                  # Utilities, Prisma client, Auth helpers
├── prisma/               # Database schema & migrations
├── public/               # Static assets & uploads
│   └── certificate_template.docx
└── types/                # TypeScript definitions

```

---

## 🔌 API Endpoints

The application provides a RESTful API for integration and frontend usage.

| Category | Endpoint | Method | Description |
| --- | --- | --- | --- |
| **Auth** | `/api/auth/login` | POST | User login |
|  | `/api/auth/register` | POST | User registration |
| **Certs** | `/api/certificates` | GET/POST | Manage certificates |
| **Tracking** | `/api/fumigation-trackings` | GET/POST | Manage fumigation tracking |
| **Public** | `/api/tracking` | GET | Public lookup by container/notice ID |
| **Users** | `/api/users` | GET/POST | Admin user management |

---

## 🛠 Development Commands

* `npm run dev`: Start the development server.
* `npm run build`: Build the application for production.
* `npm start`: Start the production server.
* `npm run lint`: Run ESLint to check for code quality issues.

## 📄 License

This project is proprietary software for **PT Prana Argentum**.
All rights reserved. © 2024 PT Prana Argentum.

```

```

/**
 * ===================================
 * ENUMS
 * Berdasarkan enum di schema.prisma
 * ===================================
 */

export type Role = "ADMIN" | "USER";

export type CertificateStatus = "VALID" | "EXPIRED" | "REVOKED";

export type ProgressStatus =
  | "PENDING"
  | "GASSING"
  | "AERATION"
  | "READY"
  | "COMPLETED";

export type ConsultationServiceType =
  | "FUMIGATION"
  | "CARGO_SURVEY"
  | "MARINE_SURVEY"
  | "PRESHIPMENT"
  | "INSURANCE"
  | "QUALITY_CONTROL"
  | "GENERAL_CONSULTATION";

export type ConsultationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

/**
 * ===================================
 * MODEL TYPES
 * Tipe dasar yang merepresentasikan
 * tabel di database Anda.
 * ===================================
 */

// Tipe dasar untuk model User
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Password sebaiknya tidak pernah dikirim ke client
  role: Role;
  createdAt: Date;
};

// Tipe User yang aman untuk dikirim ke client (tanpa password)
export type SafeUser = Omit<User, "password">;

// Tipe dasar untuk model Certificate
export type Certificate = {
  id: string;
  name: string;
  recipientEmail: string;
  recipientName: string;
  issueDate: Date;
  status: CertificateStatus;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  serviceType: string | null;
  location: string | null;
  description: string | null;
  containerNumber: string | null;
  noticeId: string | null;
  woNumber: string | null;
  gassingTime: Date | null;
  aerationStartTime: Date | null;
  containerReadyTime: Date | null;
  progressStatus: ProgressStatus | null;
  phytosanitaryUrl: string | null;
  phytosanitaryFileName: string | null;
  issuedById: string | null;
  issuedBy: SafeUser | null;
};

// Tipe dasar untuk model FumigationTracking
export type FumigationTracking = {
  id: string;
  containerNumber: string;
  noticeId: string;
  woNumber: string | null;
  companyName: string;
  companyEmail: string;
  location: string;
  gassingTime: Date | null;
  aerationStartTime: Date | null;
  containerReadyTime: Date | null;
  progressStatus: ProgressStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  certificateId: string | null;
  userId: string | null;
};

// Tipe dasar untuk model RecordSheet
export type RecordSheet = {
  id: string;
  containerNumber: string;
  commodity: string;
  treatmentDate: Date;
  gasType: string;
  concentration: string;
  exposureTime: string;
  temperature: string;
  humidity: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  certificateId: string;
  inspectorId: string;
};

// Tipe dasar untuk model GasReading
export type GasReading = {
  id: string;
  timestamp: Date;
  concentration: number;
  temperature: number;
  humidity: number | null;
  location: string;
  inspector: string;
  recordSheetId: string;
};

// Tipe dasar untuk model ConsultationRequest
export type ConsultationRequest = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  companyName: string | null;
  serviceType: ConsultationServiceType;
  message: string;
  status: ConsultationStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * ===================================
 * TYPES DENGAN RELASI
 * Tipe ini berguna untuk response API
 * yang menyertakan data relasional.
 * ===================================
 */

// Tipe RecordSheet yang menyertakan data relasi GasReading[]
export type RecordSheetWithReadings = RecordSheet & {
  readings: GasReading[];
  inspector: SafeUser;
};

// Tipe Certificate yang menyertakan semua data relasinya
export type FullCertificate = Certificate & {
  issuedBy: SafeUser | null;
  recordSheet: RecordSheetWithReadings | null;
  fumigationTracking: FumigationTracking | null;
};

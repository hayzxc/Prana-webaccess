-- CreateEnum
CREATE TYPE "public"."ConsultationServiceType" AS ENUM ('FUMIGATION', 'CARGO_SURVEY', 'MARINE_SURVEY', 'PRESHIPMENT', 'INSURANCE', 'QUALITY_CONTROL', 'GENERAL_CONSULTATION');

-- CreateEnum
CREATE TYPE "public"."ConsultationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."certificates" DROP CONSTRAINT "certificates_issued_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fumigation_trackings" DROP CONSTRAINT "fumigation_trackings_certificate_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fumigation_trackings" DROP CONSTRAINT "fumigation_trackings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."gas_readings" DROP CONSTRAINT "gas_readings_record_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."record_sheets" DROP CONSTRAINT "record_sheets_certificate_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."record_sheets" DROP CONSTRAINT "record_sheets_inspector_id_fkey";

-- CreateTable
CREATE TABLE "public"."GeneratedCertificate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,

    CONSTRAINT "GeneratedCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultation_requests" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "companyName" TEXT,
    "serviceType" "public"."ConsultationServiceType" NOT NULL DEFAULT 'FUMIGATION',
    "message" TEXT NOT NULL,
    "status" "public"."ConsultationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fumigation_trackings" ADD CONSTRAINT "fumigation_trackings_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fumigation_trackings" ADD CONSTRAINT "fumigation_trackings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."record_sheets" ADD CONSTRAINT "record_sheets_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."record_sheets" ADD CONSTRAINT "record_sheets_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gas_readings" ADD CONSTRAINT "gas_readings_record_sheet_id_fkey" FOREIGN KEY ("record_sheet_id") REFERENCES "public"."record_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

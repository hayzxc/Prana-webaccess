-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."CertificateStatus" AS ENUM ('VALID', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "public"."ProgressStatus" AS ENUM ('PENDING', 'GASSING', 'AERATION', 'READY', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."certificates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."CertificateStatus" NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "serviceType" TEXT,
    "location" TEXT,
    "description" TEXT,
    "containerNumber" TEXT,
    "noticeId" TEXT,
    "woNumber" TEXT,
    "gassingTime" TIMESTAMP(3),
    "aerationStartTime" TIMESTAMP(3),
    "containerReadyTime" TIMESTAMP(3),
    "progressStatus" "public"."ProgressStatus",
    "phytosanitaryUrl" TEXT,
    "phytosanitaryFileName" TEXT,
    "issued_by_id" TEXT,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fumigation_trackings" (
    "id" TEXT NOT NULL,
    "containerNumber" TEXT NOT NULL,
    "noticeId" TEXT NOT NULL,
    "woNumber" TEXT,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gassingTime" TIMESTAMP(3),
    "aerationStartTime" TIMESTAMP(3),
    "containerReadyTime" TIMESTAMP(3),
    "progressStatus" "public"."ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificate_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "fumigation_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."record_sheets" (
    "id" TEXT NOT NULL,
    "commodity" TEXT NOT NULL,
    "treatmentDate" TIMESTAMP(3) NOT NULL,
    "gasType" TEXT NOT NULL,
    "concentration" TEXT NOT NULL,
    "exposureTime" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "humidity" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificate_id" TEXT NOT NULL,
    "inspector_id" TEXT NOT NULL,

    CONSTRAINT "record_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gas_readings" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "concentration" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION,
    "location" TEXT NOT NULL,
    "inspector" TEXT NOT NULL,
    "record_sheet_id" TEXT NOT NULL,

    CONSTRAINT "gas_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_containerNumber_key" ON "public"."certificates"("containerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_noticeId_key" ON "public"."certificates"("noticeId");

-- CreateIndex
CREATE UNIQUE INDEX "fumigation_trackings_certificate_id_key" ON "public"."fumigation_trackings"("certificate_id");

-- CreateIndex
CREATE UNIQUE INDEX "record_sheets_certificate_id_key" ON "public"."record_sheets"("certificate_id");

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fumigation_trackings" ADD CONSTRAINT "fumigation_trackings_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fumigation_trackings" ADD CONSTRAINT "fumigation_trackings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."record_sheets" ADD CONSTRAINT "record_sheets_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."record_sheets" ADD CONSTRAINT "record_sheets_inspector_id_fkey" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gas_readings" ADD CONSTRAINT "gas_readings_record_sheet_id_fkey" FOREIGN KEY ("record_sheet_id") REFERENCES "public"."record_sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

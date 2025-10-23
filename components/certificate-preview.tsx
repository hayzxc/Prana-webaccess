"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Calendar,
  Building,
  Package,
  Thermometer,
  Clock,
  User,
  Info,
  FileText,
} from "lucide-react";
import { Certificate, CertificateStatus, SafeUser } from "@/types";
import toast from "react-hot-toast";

type CertificateWithIssuer = Certificate & {
  issuedBy: Pick<SafeUser, "name"> | null;
};

interface CertificatePreviewProps {
  certificate: Certificate;
  onView?: () => void;
  onDownload?: () => void;
}

export function CertificatePreview({ certificate }: CertificatePreviewProps) {
  const getStatusProps = (
    status: CertificateStatus
  ): { className: string; text: string } => {
    switch (status) {
      case "VALID":
        return { className: "bg-green-100 text-green-800", text: "Valid" };
      case "EXPIRED":
        return { className: "bg-red-100 text-red-800", text: "Kadaluwarsa" };
      case "REVOKED":
        return { className: "bg-yellow-100 text-yellow-800", text: "Dicabut" };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          text: "Tidak Diketahui",
        };
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusProps = getStatusProps(certificate.status);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Building className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate" title={certificate.recipientName}>
          Penerima: {certificate.recipientName}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>Diterbitkan: {formatDate(certificate.issueDate)}</span>
      </div>
      {certificate.issuedBy && (
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Oleh: {certificate.issuedBy.name}</span>
        </div>
      )}
      {certificate.containerNumber && (
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Kontainer: {certificate.containerNumber}</span>
        </div>
      )}
      {certificate.noticeId && (
        <div className="flex items-center text-sm text-gray-600">
          <Info className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Notice ID: {certificate.noticeId}</span>
        </div>
      )}
    </div>
  );
}

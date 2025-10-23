export interface Certificate {
  id: string
  userId: string
  certificateNumber: string
  certificateType: string
  companyName: string
  issueDate: string
  expiryDate?: string
  status: "active" | "expired" | "pending" | "draft"
  fileUrl?: string
  containerNumber?: string
  commodity?: string
  treatmentType?: string
  gasType?: string
  concentration?: string
  exposureTime?: string
  temperature?: string
  createdAt: string
  updatedAt: string
}

export const certificates: Certificate[] = [
  {
    id: "1",
    userId: "2",
    certificateNumber: "PRANA-2024-001",
    certificateType: "Fumigation Certificate",
    companyName: "PT Exportir Indonesia",
    issueDate: "2024-01-15",
    expiryDate: "2024-07-15",
    status: "active",
    containerNumber: "TEMU1234567",
    commodity: "Coffee Beans",
    treatmentType: "Methyl Bromide",
    gasType: "CH3Br",
    concentration: "32 g/m³",
    exposureTime: "24 hours",
    temperature: "25°C",
    fileUrl: "/certificates/PRANA-2024-001.pdf",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    certificateNumber: "PRANA-2024-002",
    certificateType: "ISPM-15 Certificate",
    companyName: "PT Kayu Ekspor",
    issueDate: "2024-02-01",
    expiryDate: "2024-08-01",
    status: "active",
    containerNumber: "TCLU9876543",
    commodity: "Wooden Pallets",
    treatmentType: "Heat Treatment",
    gasType: "N/A",
    concentration: "N/A",
    exposureTime: "30 minutes",
    temperature: "56°C",
    fileUrl: "/certificates/PRANA-2024-002.pdf",
    createdAt: "2024-02-01T09:30:00Z",
    updatedAt: "2024-02-01T09:30:00Z",
  },
  {
    id: "3",
    userId: "2",
    certificateNumber: "PRANA-2024-003",
    certificateType: "AFAS Certificate",
    companyName: "PT Agro Export",
    issueDate: "2024-02-15",
    expiryDate: "2024-08-15",
    status: "active",
    containerNumber: "MSKU5555555",
    commodity: "Rice",
    treatmentType: "Phosphine",
    gasType: "PH3",
    concentration: "2 g/m³",
    exposureTime: "72 hours",
    temperature: "28°C",
    fileUrl: "/certificates/PRANA-2024-003.pdf",
    createdAt: "2024-02-15T14:20:00Z",
    updatedAt: "2024-02-15T14:20:00Z",
  },
  {
    id: "4",
    userId: "2",
    certificateNumber: "PRANA-2024-004",
    certificateType: "Ship Fumigation Certificate",
    companyName: "PT Shipping Lines",
    issueDate: "2024-03-01",
    expiryDate: "2024-09-01",
    status: "pending",
    containerNumber: "VESSEL-001",
    commodity: "Cargo Hold",
    treatmentType: "Aluminum Phosphide",
    gasType: "PH3",
    concentration: "1.5 g/m³",
    exposureTime: "48 hours",
    temperature: "30°C",
    createdAt: "2024-03-01T10:15:00Z",
    updatedAt: "2024-03-01T10:15:00Z",
  },
  {
    id: "5",
    userId: "2",
    certificateNumber: "PRANA-2024-005",
    certificateType: "Warehouse Fumigation Certificate",
    companyName: "PT Gudang Sentral",
    issueDate: "2024-03-10",
    expiryDate: "2024-09-10",
    status: "active",
    containerNumber: "WH-BLOCK-A",
    commodity: "Mixed Commodities",
    treatmentType: "Methyl Bromide",
    gasType: "CH3Br",
    concentration: "48 g/m³",
    exposureTime: "36 hours",
    temperature: "27°C",
    fileUrl: "/certificates/PRANA-2024-005.pdf",
    createdAt: "2024-03-10T16:45:00Z",
    updatedAt: "2024-03-10T16:45:00Z",
  },
]

export function getCertificatesByUserId(userId: string): Certificate[] {
  return certificates.filter((cert) => cert.userId === userId)
}

export function getCertificateById(id: string): Certificate | undefined {
  return certificates.find((cert) => cert.id === id)
}

export function getCertificateByNumber(certificateNumber: string): Certificate | undefined {
  return certificates.find((cert) => cert.certificateNumber === certificateNumber)
}

export function addCertificate(certificate: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Certificate {
  const newCertificate: Certificate = {
    ...certificate,
    id: (certificates.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  certificates.push(newCertificate)
  return newCertificate
}

export function updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
  const index = certificates.findIndex((cert) => cert.id === id)
  if (index === -1) return null

  certificates[index] = {
    ...certificates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return certificates[index]
}

export function deleteCertificate(id: string): boolean {
  const index = certificates.findIndex((cert) => cert.id === id)
  if (index === -1) return false

  certificates.splice(index, 1)
  return true
}

export interface RecordSheet {
  id: string
  certificateId: string
  containerNumber: string
  commodity: string
  treatmentDate: string
  gasType: string
  concentration: string
  exposureTime: string
  temperature: string
  humidity?: string
  inspectorName: string
  notes?: string
  readings: GasReading[]
  createdAt: string
  updatedAt: string
}

export interface GasReading {
  id: string
  timestamp: string
  concentration: number
  temperature: number
  humidity?: number
  location: string
  inspector: string
}

export const RECORD_SHEET_CATEGORIES = {
  CONTAINER: "container",
  WAREHOUSE: "warehouse",
  SHIP: "ship",
  COMMODITY: "commodity",
} as const

export const recordSheets: RecordSheet[] = [
  {
    id: "1",
    certificateId: "1",
    containerNumber: "TEMU1234567",
    commodity: "Coffee Beans",
    treatmentDate: "2024-01-15",
    gasType: "Methyl Bromide (CH3Br)",
    concentration: "32 g/m³",
    exposureTime: "24 hours",
    temperature: "25°C",
    humidity: "65%",
    inspectorName: "John Doe",
    notes: "Treatment completed successfully. No issues observed.",
    readings: [
      {
        id: "r1",
        timestamp: "2024-01-15T10:30:00Z",
        concentration: 32.0,
        temperature: 25.2,
        humidity: 65,
        location: "Point A",
        inspector: "John Doe",
      },
      {
        id: "r2",
        timestamp: "2024-01-15T14:30:00Z",
        concentration: 31.8,
        temperature: 25.5,
        humidity: 64,
        location: "Point A",
        inspector: "John Doe",
      },
      {
        id: "r3",
        timestamp: "2024-01-15T18:30:00Z",
        concentration: 31.5,
        temperature: 25.8,
        humidity: 63,
        location: "Point A",
        inspector: "John Doe",
      },
    ],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T18:30:00Z",
  },
  {
    id: "2",
    certificateId: "3",
    containerNumber: "MSKU5555555",
    commodity: "Rice",
    treatmentDate: "2024-02-15",
    gasType: "Phosphine (PH3)",
    concentration: "2 g/m³",
    exposureTime: "72 hours",
    temperature: "28°C",
    humidity: "70%",
    inspectorName: "Jane Smith",
    notes: "Extended exposure time due to high moisture content.",
    readings: [
      {
        id: "r4",
        timestamp: "2024-02-15T09:00:00Z",
        concentration: 2.0,
        temperature: 28.1,
        humidity: 70,
        location: "Point A",
        inspector: "Jane Smith",
      },
      {
        id: "r5",
        timestamp: "2024-02-16T09:00:00Z",
        concentration: 1.9,
        temperature: 28.3,
        humidity: 69,
        location: "Point A",
        inspector: "Jane Smith",
      },
      {
        id: "r6",
        timestamp: "2024-02-17T09:00:00Z",
        concentration: 1.8,
        temperature: 28.5,
        humidity: 68,
        location: "Point A",
        inspector: "Jane Smith",
      },
    ],
    createdAt: "2024-02-15T08:00:00Z",
    updatedAt: "2024-02-17T09:00:00Z",
  },
]

export function getRecordSheetsByCertificateId(certificateId: string): RecordSheet[] {
  return recordSheets.filter((sheet) => sheet.certificateId === certificateId)
}

export function getRecordSheetsByUser(userId: string): RecordSheet[] {
  // In a real implementation, this would filter by user ID
  // For now, return all record sheets as mock data
  return recordSheets
}

export function getAllRecordSheets(): RecordSheet[] {
  return recordSheets
}

export function getRecordSheetById(id: string): RecordSheet | undefined {
  return recordSheets.find((sheet) => sheet.id === id)
}

export function addRecordSheet(sheet: Omit<RecordSheet, "id" | "createdAt" | "updatedAt">): RecordSheet {
  const newSheet: RecordSheet = {
    ...sheet,
    id: (recordSheets.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  recordSheets.push(newSheet)
  return newSheet
}

export function addGasReading(sheetId: string, reading: Omit<GasReading, "id">): boolean {
  const sheet = recordSheets.find((s) => s.id === sheetId)
  if (!sheet) return false

  const newReading: GasReading = {
    ...reading,
    id: `r${Date.now()}`,
  }

  sheet.readings.push(newReading)
  sheet.updatedAt = new Date().toISOString()

  return true
}

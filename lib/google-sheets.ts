// Mock Google Sheets integration
// In production, this would connect to actual Google Sheets API

export interface SheetData {
  id: string
  name: string
  data: any[][]
  headers: string[]
  lastModified: string
}

const mockSheetData: SheetData[] = [
  {
    id: "sheet1",
    name: "Fumigation Records 2024",
    headers: ["Date", "Container", "Commodity", "Treatment", "Inspector", "Status"],
    data: [
      ["2024-01-15", "TEMU1234567", "Coffee Beans", "Methyl Bromide", "John Doe", "Completed"],
      ["2024-01-16", "TCLU9876543", "Wooden Pallets", "Heat Treatment", "Jane Smith", "In Progress"],
      ["2024-01-17", "MSKU5555555", "Rice", "Phosphine", "Bob Johnson", "Pending"],
    ],
    lastModified: "2024-01-17T10:30:00Z",
  },
  {
    id: "sheet2",
    name: "Certificate Tracking",
    headers: ["Certificate No", "Client", "Issue Date", "Expiry Date", "Status"],
    data: [
      ["PRANA-2024-001", "PT Exportir Indonesia", "2024-01-15", "2024-07-15", "Active"],
      ["PRANA-2024-002", "PT Kayu Ekspor", "2024-02-01", "2024-08-01", "Active"],
      ["PRANA-2024-003", "PT Agro Export", "2024-02-15", "2024-08-15", "Active"],
    ],
    lastModified: "2024-02-15T14:20:00Z",
  },
]

export async function getSheets(): Promise<SheetData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockSheetData
}

export async function getSheet(id: string): Promise<SheetData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockSheetData.find((sheet) => sheet.id === id) || null
}

export async function updateSheet(id: string, data: any[][]): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const sheetIndex = mockSheetData.findIndex((sheet) => sheet.id === id)
  if (sheetIndex !== -1) {
    mockSheetData[sheetIndex].data = data
    mockSheetData[sheetIndex].lastModified = new Date().toISOString()
    return true
  }
  return false
}

export async function createSheet(name: string, headers: string[]): Promise<SheetData> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newSheet: SheetData = {
    id: `sheet${Date.now()}`,
    name,
    headers,
    data: [],
    lastModified: new Date().toISOString(),
  }
  mockSheetData.push(newSheet)
  return newSheet
}

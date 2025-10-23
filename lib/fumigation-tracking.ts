export interface FumigationTracking {
  id: string
  containerNumber: string
  noticeId: string
  woNumber?: string
  companyName: string
  companyEmail: string
  location: string
  gassingTime?: string
  aerationStartTime?: string
  containerReadyTime?: string
  progressStatus: "pending" | "gassing" | "aeration" | "ready" | "completed"
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock fumigation tracking database
let fumigationTrackings: FumigationTracking[] = [
  {
    id: "TRACK-2023-001",
    containerNumber: "TEMU1234567",
    noticeId: "NOT-2023-001",
    woNumber: "WO-2023-001",
    companyName: "PT. Logistik Nusantara",
    companyEmail: "user@example.com",
    location: "Tanjung Perak Port",
    gassingTime: "2023-12-15T08:00:00",
    aerationStartTime: "2023-12-15T08:00:00",
    containerReadyTime: "2023-12-16T11:00:00",
    progressStatus: "completed",
    notes: "Fumigasi berhasil dilakukan dengan AFAS treatment",
    createdAt: "2023-12-15T07:00:00",
    updatedAt: "2023-12-16T11:00:00",
  },
  {
    id: "TRACK-2023-002",
    containerNumber: "MSKU9876543",
    noticeId: "NOT-2023-002",
    woNumber: "WO-2023-002",
    companyName: "PT. Logistik Nusantara",
    companyEmail: "user@example.com",
    location: "Tanjung Perak Port",
    gassingTime: "2023-12-16T14:00:00",
    aerationStartTime: "2023-12-16T14:00:00",
    containerReadyTime: "2023-12-17T17:00:00",
    progressStatus: "aeration",
    notes: "Proses aerasi sedang berlangsung",
    createdAt: "2023-12-16T13:00:00",
    updatedAt: "2023-12-16T14:00:00",
  },
]

export function getAllFumigationTrackings(): FumigationTracking[] {
  return fumigationTrackings
}

export function getFumigationTrackingsByEmail(email: string): FumigationTracking[] {
  return fumigationTrackings.filter((tracking) => tracking.companyEmail === email)
}

export function getFumigationTrackingByContainerAndNotice(
  containerNumber: string,
  noticeId: string,
): FumigationTracking | null {
  return (
    fumigationTrackings.find(
      (tracking) => tracking.containerNumber === containerNumber && tracking.noticeId === noticeId,
    ) || null
  )
}

export function addFumigationTracking(
  tracking: Omit<FumigationTracking, "id" | "createdAt" | "updatedAt">,
): FumigationTracking {
  const newTracking: FumigationTracking = {
    ...tracking,
    id: `TRACK-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Auto-calculate times if gassing time is provided
  if (tracking.gassingTime) {
    const gassingDate = new Date(tracking.gassingTime)
    newTracking.aerationStartTime = tracking.gassingTime

    // Add 27 hours for container ready time
    const readyDate = new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000)
    newTracking.containerReadyTime = readyDate.toISOString()

    // Set initial progress status if not provided
    if (!tracking.progressStatus || tracking.progressStatus === "pending") {
      newTracking.progressStatus = "gassing"
    }
  }

  fumigationTrackings.push(newTracking)

  // Save to localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("fumigationTrackings", JSON.stringify(fumigationTrackings))
  }

  return newTracking
}

export function updateFumigationTrackingProgress(
  id: string,
  progressStatus: FumigationTracking["progressStatus"],
  notes?: string,
): boolean {
  const index = fumigationTrackings.findIndex((tracking) => tracking.id === id)
  if (index > -1) {
    fumigationTrackings[index].progressStatus = progressStatus
    fumigationTrackings[index].updatedAt = new Date().toISOString()

    if (notes) {
      fumigationTrackings[index].notes = notes
    }

    // Update timestamps based on progress
    const now = new Date().toISOString()
    if (progressStatus === "aeration") {
      fumigationTrackings[index].aerationStartTime = now
    } else if (progressStatus === "ready") {
      // Container ready time should be calculated from gassing time + 27 hours
      if (fumigationTrackings[index].gassingTime) {
        const gassingDate = new Date(fumigationTrackings[index].gassingTime!)
        const readyDate = new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000)
        fumigationTrackings[index].containerReadyTime = readyDate.toISOString()
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("fumigationTrackings", JSON.stringify(fumigationTrackings))
    }
    return true
  }
  return false
}

export function deleteFumigationTracking(id: string): boolean {
  const index = fumigationTrackings.findIndex((tracking) => tracking.id === id)
  if (index > -1) {
    fumigationTrackings.splice(index, 1)
    if (typeof window !== "undefined") {
      localStorage.setItem("fumigationTrackings", JSON.stringify(fumigationTrackings))
    }
    return true
  }
  return false
}

// Load fumigation trackings from localStorage on initialization
if (typeof window !== "undefined") {
  const storedTrackings = localStorage.getItem("fumigationTrackings")
  if (storedTrackings) {
    fumigationTrackings = JSON.parse(storedTrackings)
  }
}

// Progress status mapping
export const PROGRESS_STATUS = {
  pending: "Menunggu",
  gassing: "Proses Gassing",
  aeration: "Proses Aerasi",
  ready: "Siap Keluar",
  completed: "Selesai",
}

// Calculate progress percentage
export function getProgressPercentage(status: FumigationTracking["progressStatus"]): number {
  switch (status) {
    case "pending":
      return 0
    case "gassing":
      return 25
    case "aeration":
      return 50
    case "ready":
      return 75
    case "completed":
      return 100
    default:
      return 0
  }
}

// Get time remaining for container ready
export function getTimeRemaining(gassingTime: string): string {
  const gassingDate = new Date(gassingTime)
  const readyDate = new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000)
  const now = new Date()
  const diff = readyDate.getTime() - now.getTime()

  if (diff <= 0) {
    return "Kontainer siap keluar"
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours} jam ${minutes} menit lagi`
}

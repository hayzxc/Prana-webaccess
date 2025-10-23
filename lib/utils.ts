import { ProgressStatus } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PROGRESS_STATUS_TEXT: { [key in ProgressStatus]: string } = {
  PENDING: "Menunggu",
  GASSING: "Proses Gassing",
  AERATION: "Proses Aerasi",
  READY: "Siap Keluar",
  COMPLETED: "Selesai",
};

/**
 * Menghitung persentase progres berdasarkan status.
 */
export const getProgressPercentage = (status: ProgressStatus): number => {
  const percentages: { [key in ProgressStatus]: number } = {
    PENDING: 10,
    GASSING: 25,
    AERATION: 50,
    READY: 75,
    COMPLETED: 100,
  };
  return percentages[status] || 0;
};

/**
 * Menghitung waktu target (27 jam setelah waktu gassing).
 * @param gassingTime Waktu mulai gassing dalam bentuk Date atau string.
 * @returns Waktu target sebagai objek Date.
 */
export const getTargetReadyTime = (gassingTime: Date | string): Date => {
  const gassingDate = new Date(gassingTime);
  return new Date(gassingDate.getTime() + 27 * 60 * 60 * 1000);
};

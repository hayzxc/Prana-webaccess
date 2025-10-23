"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { FumigationTracking, ProgressStatus } from "@/types";
import {
  PROGRESS_STATUS_TEXT,
  getProgressPercentage,
  getTargetReadyTime,
} from "@/lib/utils";

interface FumigationTrackingProgressProps {
  tracking: FumigationTracking;
}

export function FumigationTrackingProgress({
  tracking,
}: FumigationTrackingProgressProps) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const progressPercentage = getProgressPercentage(tracking.progressStatus);

  useEffect(() => {
    if (
      (tracking.progressStatus === "GASSING" ||
        tracking.progressStatus === "AERATION") &&
      tracking.gassingTime
    ) {
      if (!tracking.gassingTime) return;

      const targetTime = new Date(tracking.gassingTime);
      // target time ditambah 27 jam
      targetTime.setTime(targetTime.getTime() + 27 * 60 * 60 * 1000);      

      const intervalId = setInterval(() => {
        const now = new Date();
        const difference = targetTime.getTime() - now.getTime();        

        if (difference > 0) {
          const totalHours = Math.floor(difference / (1000 * 60 * 60));
          const days = Math.floor(totalHours / 24);
          const hours = totalHours % 24;
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          
          if (days > 0) {
            setTimeRemaining(
              `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`
            );
          } else {
            setTimeRemaining(
              `${hours} jam ${minutes} menit ${seconds} detik`
            );
          }
        } else {
          setTimeRemaining("Kontainer siap keluar");
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setTimeRemaining(null);
    }
  }, [tracking.progressStatus, tracking.gassingTime]);

  const getStatusColor = (status: ProgressStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "GASSING":
        return "bg-blue-100 text-blue-800";
      case "AERATION":
        return "bg-yellow-100 text-yellow-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ProgressStatus) => {
    switch (status) {
      case "COMPLETED":
      case "READY":
        return <CheckCircle className="w-4 h-4" />;
      case "GASSING":
      case "AERATION":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={getStatusColor(tracking.progressStatus)}>
          {getStatusIcon(tracking.progressStatus)}
          <span className="ml-1">
            {PROGRESS_STATUS_TEXT[tracking.progressStatus]}
          </span>
        </Badge>
        <span className="text-sm text-prana-gray">
          {progressPercentage}% selesai
        </span>
      </div>
      <Progress value={progressPercentage} className="w-full" />

      {/* Countdown real-time */}
      {timeRemaining && tracking.progressStatus === "AERATION" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">
                  Estimasi Kontainer Siap
                </p>
                <p className="text-sm text-yellow-600">{timeRemaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="font-semibold text-prana-navy">Timeline Proses</h4>
        <div className="space-y-2">
          {/* Gassing */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                ["GASSING", "AERATION", "READY", "COMPLETED"].includes(
                  tracking.progressStatus
                )
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-prana-navy">
                Proses Gassing
              </p>
              {tracking.gassingTime && (
                <p className="text-xs text-prana-gray">
                  {formatDate(tracking.gassingTime)}
                </p>
              )}
            </div>
          </div>
          {/* Aeration */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                ["AERATION", "READY", "COMPLETED"].includes(
                  tracking.progressStatus
                )
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-prana-navy">
                Proses Aerasi
              </p>
              {tracking.aerationStartTime && (
                <p className="text-xs text-prana-gray">
                  {formatDate(tracking.aerationStartTime)}
                </p>
              )}
            </div>
          </div>
          {/* Ready */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                ["READY", "COMPLETED"].includes(tracking.progressStatus)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-prana-navy">
                Kontainer Siap Keluar
              </p>
              {tracking.containerReadyTime && (
                <p className="text-xs text-prana-gray">
                  {formatDate(tracking.containerReadyTime)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {tracking.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-prana-gray mt-0.5" />
            <div>
              <p className="text-sm font-medium text-prana-navy">Catatan</p>
              <p className="text-sm text-prana-gray">{tracking.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Completed Status */}
      {tracking.progressStatus === "COMPLETED" && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">
                  Proses Fumigasi Selesai
                </p>
                <p className="text-sm text-green-600">
                  Kontainer telah siap untuk diambil
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

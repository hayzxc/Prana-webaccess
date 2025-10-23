"use client";

import React from "react";
import { FumigationTrackingProgress } from "@/components/fumigation-tracking-progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container, Trash2 } from "lucide-react";

import {
  FumigationTracking as FumigationTrackingType,
  ProgressStatus,
} from "@/types";

type Props = {
  trackings: FumigationTrackingType[];
  onUpdate: (id: string, newStatus: ProgressStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const FumigationTracking: React.FC<Props> = ({
  trackings,
  onUpdate,
  onDelete,
}) => {
  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-prana-navy">
          Manajemen Tracking Fumigasi
        </CardTitle>
        <CardDescription>
          Monitor dan update progress tracking fumigasi kontainer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trackings.length === 0 ? (
          <div className="text-center py-8">
            <Container className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-prana-gray">Belum ada data tracking fumigasi</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trackings.map((tracking) => (
              <div
                key={tracking.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-prana-navy">
                      {tracking.containerNumber}
                    </h4>
                    <p className="text-sm text-prana-gray">
                      WO: {tracking.woNumber} | Notice: {tracking.noticeId}
                    </p>
                    <p className="text-sm text-prana-gray">
                      {tracking.companyName}
                    </p>
                    <p className="text-xs text-prana-blue">
                      {tracking.companyEmail}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={tracking.progressStatus}
                      onValueChange={(value) =>
                        onUpdate(tracking.id, value as ProgressStatus)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Menunggu</SelectItem>
                        <SelectItem value="GASSING">Proses Gassing</SelectItem>
                        <SelectItem value="AERATION">Proses Aerasi</SelectItem>
                        <SelectItem value="READY">Siap Keluar</SelectItem>
                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(tracking.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <FumigationTrackingProgress tracking={tracking} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

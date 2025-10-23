"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createConsultationRequest } from "@/lib/api-client";
import { ConsultationServiceType } from "@/types";
import toast from "react-hot-toast";
import { Loader2, Send, X } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    companyName: "",
    serviceType: "FUMIGATION" as ConsultationServiceType,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.message) {
      toast.error("Nama, email, dan pesan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      await createConsultationRequest(formData);
      toast.success("Request konsultasi berhasil dikirim! Tim kami akan segera menghubungi Anda.");
      
      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        companyName: "",
        serviceType: "FUMIGATION",
        message: "",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting consultation request:", error);
      toast.error("Gagal mengirim request konsultasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const serviceTypeOptions = [
    { value: "FUMIGATION", label: "Fumigasi" },
    { value: "CARGO_SURVEY", label: "Cargo Survey" },
    { value: "MARINE_SURVEY", label: "Marine Survey" },
    { value: "PRESHIPMENT", label: "Pre-shipment Inspection" },
    { value: "INSURANCE", label: "Insurance Survey" },
    { value: "QUALITY_CONTROL", label: "Quality Control" },
    { value: "ISPM", label: "ISPM (Phytosanitary)" },
    { value: "GENERAL_CONSULTATION", label: "Konsultasi Umum" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-prana-navy">
                Konsultasi Gratis
              </DialogTitle>
              <DialogDescription className="mt-2">
                Isi form di bawah ini untuk mendapatkan konsultasi gratis dari tim ahli kami.
                Kami akan menghubungi Anda dalam waktu 24 jam.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-prana-navy font-medium">
                Nama Lengkap *
              </Label>
              <Input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="John Doe"
                required
                className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-prana-navy font-medium">
                Email *
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="john@example.com"
                required
                className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="text-prana-navy font-medium">
                Nomor Telepon
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder="+62 812-3456-7890"
                className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-prana-navy font-medium">
                Nama Perusahaan
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="PT. Contoh Perusahaan"
                className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-prana-navy font-medium">
              Jenis Layanan yang Dibutuhkan
            </Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value: ConsultationServiceType) => 
                handleInputChange("serviceType", value)
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue">
                <SelectValue placeholder="Pilih jenis layanan" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-prana-navy font-medium">
              Pesan / Pertanyaan Anda *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Ceritakan kebutuhan fumigasi atau layanan lainnya yang Anda butuhkan. Tim kami akan memberikan solusi terbaik untuk bisnis Anda."
              rows={4}
              required
              className="border-gray-300 focus:border-prana-blue focus:ring-prana-blue resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-prana-navy hover:bg-blue-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Request
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            <p>
              * Wajib diisi. Data Anda akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan konsultasi.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

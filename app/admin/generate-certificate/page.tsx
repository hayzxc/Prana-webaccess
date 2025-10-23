"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function GenerateCertificatePage() {
  // State untuk menampung semua data dari formulir
  const [formData, setFormData] = useState({
    date_issued: "",
    certificate_number: "",
    client_name: "",
    client_address: "",
    commodity_description: "",
    // Tambahkan field lain sesuai kebutuhan template Word Anda
    container_number: "",
    seal_number: "",
    port_of_loading: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memperbarui state setiap kali ada perubahan di input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi yang dijalankan saat tombol "Generate" diklik
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mengirim data formulir ke API backend
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Gagal membuat sertifikat: ${response.statusText}`);
      }

      // Menerima file dari API dan memicu unduhan di browser
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${formData.certificate_number || Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Certificate generated successfully!");
      
      // Reset form setelah sukses
      setFormData({
        date_issued: "",
        certificate_number: "",
        client_name: "",
        client_address: "",
        commodity_description: "",
        container_number: "",
        seal_number: "",
        port_of_loading: "",
      });
      
    } catch (error: any) {
      console.error(error);
      toast.error(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-prana-navy">Generate Certificate from Template</CardTitle>
        <CardDescription>
          Isi form di bawah ini untuk generate sertifikat dari template Word
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Date Issued */}
          <div className="space-y-2">
            <Label htmlFor="date_issued">Date Issued</Label>
            <Input 
              id="date_issued" 
              name="date_issued" 
              type="date" 
              value={formData.date_issued}
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Certificate Number */}
          <div className="space-y-2">
            <Label htmlFor="certificate_number">Certificate Number</Label>
            <Input 
              id="certificate_number" 
              name="certificate_number" 
              value={formData.certificate_number}
              onChange={handleChange} 
              required 
              placeholder="CERT-2024-001"
            />
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name</Label>
            <Input 
              id="client_name" 
              name="client_name" 
              value={formData.client_name}
              onChange={handleChange} 
              required 
              placeholder="PT. Contoh Perusahaan"
            />
          </div>

          {/* Client Address */}
          <div className="space-y-2">
            <Label htmlFor="client_address">Client Address</Label>
            <Textarea 
              id="client_address" 
              name="client_address" 
              value={formData.client_address}
              onChange={handleChange} 
              required 
              placeholder="Alamat lengkap klien"
              rows={3}
            />
          </div>

          {/* Commodity Description */}
          <div className="space-y-2">
            <Label htmlFor="commodity_description">Commodity Description</Label>
            <Textarea 
              id="commodity_description" 
              name="commodity_description" 
              value={formData.commodity_description}
              onChange={handleChange} 
              required 
              placeholder="Deskripsi komoditas"
              rows={3}
            />
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="container_number">Container Number</Label>
              <Input 
                id="container_number" 
                name="container_number" 
                value={formData.container_number}
                onChange={handleChange} 
                placeholder="TEMU1234567"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seal_number">Seal Number</Label>
              <Input 
                id="seal_number" 
                name="seal_number" 
                value={formData.seal_number}
                onChange={handleChange} 
                placeholder="SEAL123456"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port_of_loading">Port of Loading</Label>
              <Input 
                id="port_of_loading" 
                name="port_of_loading" 
                value={formData.port_of_loading}
                onChange={handleChange} 
                placeholder="Tanjung Perak"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-prana-navy hover:bg-prana-blue"
          >
            {isLoading ? "Generating..." : "Generate and Download"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
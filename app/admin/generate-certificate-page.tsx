"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function GenerateCertificatePage() {
  // State untuk menampung semua data dari formulir sesuai template Word
  const [formData, setFormData] = useState({
    // Header
    dateIssued: "",
    certificateNumber: "",
    treatmentNumber: "",
    
    // Shipment/Client
    consignmentLink: "",
    sealNumber: "",
    clientName: "",
    clientAddress: "",
    commodityDescription: "",
    commodityOrigin: "",
    commodityQuantity: "",
    portLoading: "",
    destinationCountry: "",
    
    // Target of Fumigation
    targetCommodity: false,
    targetPackaging: false,
    targetContainer: false,
    targetOther: false,
    targetOtherDetails: "",
    
    // Enclosure Type
    enclosureType: "sheeted", // sheeted, chamber, unsheeted, other
    enclosureOtherDetails: "",
    
    // Treatment Details
    dose: "",
    period: "",
    temperature: "",
    appliedDose: "",
    period2: "",
    temperature2: "",
    
    // Fumigation Information
    placeOfFumigation: "",
    addressOfFumigation: "",
    startTime: "",
    endTime: "",
    finalTlv: "",
    
    // Signatory
    fullName: "",
    accreditationNumber: "",
    signDate: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memperbarui state setiap kali ada perubahan di input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    const type = (target as HTMLInputElement).type;
    const checked = (target as HTMLInputElement).checked;
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Fungsi untuk handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
      a.download = `certificate_${formData.certificateNumber || Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Certificate generated successfully!");
      
      // Reset form setelah sukses
      setFormData({
        dateIssued: "",
        certificateNumber: "",
        treatmentNumber: "",
        consignmentLink: "",
        sealNumber: "",
        clientName: "",
        clientAddress: "",
        commodityDescription: "",
        commodityOrigin: "",
        commodityQuantity: "",
        portLoading: "",
        destinationCountry: "",
        targetCommodity: false,
        targetPackaging: false,
        targetContainer: false,
        targetOther: false,
        targetOtherDetails: "",
        enclosureType: "sheeted",
        enclosureOtherDetails: "",
        dose: "",
        period: "",
        temperature: "",
        appliedDose: "",
        period2: "",
        temperature2: "",
        placeOfFumigation: "",
        addressOfFumigation: "",
        startTime: "",
        endTime: "",
        finalTlv: "",
        fullName: "",
        accreditationNumber: "",
        signDate: "",
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
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Header Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Header Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateIssued">Date Issued (dd/mm/yyyy)</Label>
                <Input 
                  id="dateIssued" 
                  name="dateIssued" 
                  type="date" 
                  value={formData.dateIssued}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input 
                  id="certificateNumber" 
                  name="certificateNumber" 
                  value={formData.certificateNumber}
                  onChange={handleChange} 
                  required 
                  placeholder="CERT-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatmentNumber">Treatment Number</Label>
                <Input 
                  id="treatmentNumber" 
                  name="treatmentNumber" 
                  value={formData.treatmentNumber}
                  onChange={handleChange} 
                  placeholder="TRT-2024-001"
                />
              </div>
            </div>
          </div>

          {/* Shipment/Client Section */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Shipment / Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consignmentLink">Consignment Link</Label>
                <Input 
                  id="consignmentLink" 
                  name="consignmentLink" 
                  value={formData.consignmentLink}
                  onChange={handleChange} 
                  placeholder="CONS-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sealNumber">Seal Number</Label>
                <Input 
                  id="sealNumber" 
                  name="sealNumber" 
                  value={formData.sealNumber}
                  onChange={handleChange} 
                  placeholder="SEAL123456"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName" 
                name="clientName" 
                value={formData.clientName}
                onChange={handleChange} 
                required 
                placeholder="PT. Contoh Perusahaan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea 
                id="clientAddress" 
                name="clientAddress" 
                value={formData.clientAddress}
                onChange={handleChange} 
                required 
                placeholder="Alamat lengkap klien"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodityDescription">Commodity Description</Label>
                <Textarea 
                  id="commodityDescription" 
                  name="commodityDescription" 
                  value={formData.commodityDescription}
                  onChange={handleChange} 
                  required 
                  placeholder="Deskripsi komoditas"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commodityOrigin">Commodity Country of Origin</Label>
                <Input 
                  id="commodityOrigin" 
                  name="commodityOrigin" 
                  value={formData.commodityOrigin}
                  onChange={handleChange} 
                  placeholder="Indonesia"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodityQuantity">Commodity Quantity</Label>
                <Input 
                  id="commodityQuantity" 
                  name="commodityQuantity" 
                  value={formData.commodityQuantity}
                  onChange={handleChange} 
                  placeholder="1000 kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portLoading">Port of Loading</Label>
                <Input 
                  id="portLoading" 
                  name="portLoading" 
                  value={formData.portLoading}
                  onChange={handleChange} 
                  placeholder="Tanjung Perak"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCountry">Destination Country</Label>
                <Input 
                  id="destinationCountry" 
                  name="destinationCountry" 
                  value={formData.destinationCountry}
                  onChange={handleChange} 
                  placeholder="Australia"
                />
              </div>
            </div>
          </div>

          {/* Target of Fumigation Section */}
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Target of Fumigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="targetCommodity"
                  checked={formData.targetCommodity}
                  onCheckedChange={(checked) => handleCheckboxChange("targetCommodity", !!checked)}
                />
                <Label htmlFor="targetCommodity">Commodity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="targetPackaging"
                  checked={formData.targetPackaging}
                  onCheckedChange={(checked) => handleCheckboxChange("targetPackaging", !!checked)}
                />
                <Label htmlFor="targetPackaging">Packaging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="targetContainer"
                  checked={formData.targetContainer}
                  onCheckedChange={(checked) => handleCheckboxChange("targetContainer", !!checked)}
                />
                <Label htmlFor="targetContainer">Container</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="targetOther"
                  checked={formData.targetOther}
                  onCheckedChange={(checked) => handleCheckboxChange("targetOther", !!checked)}
                />
                <Label htmlFor="targetOther">Other</Label>
              </div>
            </div>
            {formData.targetOther && (
              <div className="space-y-2">
                <Label htmlFor="targetOtherDetails">Other Details</Label>
                <Input 
                  id="targetOtherDetails" 
                  name="targetOtherDetails" 
                  value={formData.targetOtherDetails}
                  onChange={handleChange} 
                  placeholder="Specify other target"
                />
              </div>
            )}
          </div>

          {/* Enclosure Type Section */}
          <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Enclosure Type</h3>
            <div className="space-y-2">
              <Label htmlFor="enclosureType">Enclosure Type</Label>
              <Select value={formData.enclosureType} onValueChange={(value) => handleSelectChange("enclosureType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enclosure type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sheeted">Sheeted</SelectItem>
                  <SelectItem value="chamber">Chamber</SelectItem>
                  <SelectItem value="unsheeted">Unsheeted</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.enclosureType === "other" && (
              <div className="space-y-2">
                <Label htmlFor="enclosureOtherDetails">Other Details</Label>
                <Input 
                  id="enclosureOtherDetails" 
                  name="enclosureOtherDetails" 
                  value={formData.enclosureOtherDetails}
                  onChange={handleChange} 
                  placeholder="Specify other enclosure type"
                />
              </div>
            )}
          </div>

          {/* Treatment Details Section */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Treatment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose">Dose</Label>
                <Input 
                  id="dose" 
                  name="dose" 
                  value={formData.dose}
                  onChange={handleChange} 
                  placeholder="e.g., 50g/m³"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input 
                  id="period" 
                  name="period" 
                  value={formData.period}
                  onChange={handleChange} 
                  placeholder="e.g., 24 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input 
                  id="temperature" 
                  name="temperature" 
                  value={formData.temperature}
                  onChange={handleChange} 
                  placeholder="e.g., 25°C"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appliedDose">Applied Dose</Label>
                <Input 
                  id="appliedDose" 
                  name="appliedDose" 
                  value={formData.appliedDose}
                  onChange={handleChange} 
                  placeholder="Actual applied dose"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period2">Period 2</Label>
                <Input 
                  id="period2" 
                  name="period2" 
                  value={formData.period2}
                  onChange={handleChange} 
                  placeholder="Additional period"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature2">Temperature 2</Label>
                <Input 
                  id="temperature2" 
                  name="temperature2" 
                  value={formData.temperature2}
                  onChange={handleChange} 
                  placeholder="Additional temperature"
                />
              </div>
            </div>
          </div>

          {/* Fumigation Information Section */}
          <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Fumigation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placeOfFumigation">Place of Fumigation</Label>
                <Input 
                  id="placeOfFumigation" 
                  name="placeOfFumigation" 
                  value={formData.placeOfFumigation}
                  onChange={handleChange} 
                  placeholder="Fumigation location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressOfFumigation">Address</Label>
                <Input 
                  id="addressOfFumigation" 
                  name="addressOfFumigation" 
                  value={formData.addressOfFumigation}
                  onChange={handleChange} 
                  placeholder="Full address"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Fumigation Commenced</Label>
                <Input 
                  id="startTime" 
                  name="startTime" 
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fumigation Completed</Label>
                <Input 
                  id="endTime" 
                  name="endTime" 
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalTlv">Final TLV</Label>
                <Input 
                  id="finalTlv" 
                  name="finalTlv" 
                  value={formData.finalTlv}
                  onChange={handleChange} 
                  placeholder="Final TLV reading"
                />
              </div>
            </div>
          </div>

          {/* Signatory Section */}
          <div className="space-y-4 p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold text-prana-navy">Signatory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName}
                  onChange={handleChange} 
                  required 
                  placeholder="Inspector full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accreditationNumber">Accreditation Number</Label>
                <Input 
                  id="accreditationNumber" 
                  name="accreditationNumber" 
                  value={formData.accreditationNumber}
                  onChange={handleChange} 
                  placeholder="Accreditation number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signDate">Sign Date</Label>
                <Input 
                  id="signDate" 
                  name="signDate" 
                  type="date"
                  value={formData.signDate}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-prana-navy hover:bg-prana-blue text-lg py-6"
          >
            {isLoading ? "Generating Certificate..." : "Generate and Download Certificate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
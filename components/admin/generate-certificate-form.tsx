"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

export function GenerateCertificateForm() {
  // Mendefinisikan kondisi awal form untuk memudahkan reset
  const initialFormState = {
    "date issued(dd/mm/yyyy)": "",
    "Nomer Sertifikat": "",
    "Treatment Number": "",
    "Consigment Link": "",
    "seal number": "",
    "client_ name": "",
    "client address": "",
    "commodity description": "",
    "commodity country of origin": "",
    "commodity quantity": "",
    "port of loading": "",
    "destination country": "",
    dose: "",
    period: "",
    temperature: "",
    "applied dose": "",
    period2: "",
    temprature2: "",
    "place of fumigation": "",
    Alamat: "",
    "date and time fumigation commenced": "",
    "date and time fumigation completed": "",
    "final tlv": "",
    "full name": "",
    date: "",
    "accreditation number": "",
    // State baru untuk checkbox & radio
    target_commodity: false,
    target_packaging: false,
    target_container: false,
    target_other: false,
    target_other_input: "",
    enclosure_type: "",
    enclosure_other_input: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof typeof initialFormState, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Logika untuk mengubah state boolean menjadi karakter centang
      const payload = {
        ...formData,
        target_commodity_check: formData.target_commodity ? "☑" : "☐",
        target_packaging_check: formData.target_packaging ? "☑" : "☐",
        target_container_check: formData.target_container ? "☑" : "☐",
        target_other_details: formData.target_other ? `☑ Other: ${formData.target_other_input}` : "☐ Other (provide details)",
        
        enclosure_sheeted_check: formData.enclosure_type === 'sheeted' ? "☑" : "☐",
        enclosure_chamber_check: formData.enclosure_type === 'chamber' ? "☑" : "☐",
        enclosure_unsheeted_check: formData.enclosure_type === 'unsheeted' ? "☑" : "☐",
        enclosure_other_details: formData.enclosure_type === 'other' ? `☑ Other: ${formData.enclosure_other_input}` : "☐ Other (provide details)",
      };

      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { throw new Error(`Gagal membuat sertifikat: ${response.statusText}`); }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${formData["Nomer Sertifikat"] || Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Sertifikat berhasil dibuat dan diunduh!");
      setFormData(initialFormState); // Reset formulir

    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat membuat dokumen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bagian Header Sertifikat */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date issued(dd/mm/yyyy)">Tanggal Diterbitkan</Label>
          <Input id="date issued(dd/mm/yyyy)" name="date issued(dd/mm/yyyy)" type="date" value={formData["date issued(dd/mm/yyyy)"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="Nomer Sertifikat">Nomor Sertifikat</Label>
          <Input id="Nomer Sertifikat" name="Nomer Sertifikat" value={formData["Nomer Sertifikat"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="Treatment Number">Treatment Provider ID</Label>
          <Input id="Treatment Number" name="Treatment Number" value={formData["Treatment Number"]} onChange={handleChange} required />
        </div>
      </div>
      <hr />

      {/* Bagian Detail Pengiriman */}
      <h3 className="text-lg font-semibold pt-4">Detail Pengiriman</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Consigment Link">Link Pengiriman (No. Kontainer)</Label>
          <Input id="Consigment Link" name="Consigment Link" value={formData["Consigment Link"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="seal number">Nomor Segel (Seal)</Label>
          <Input id="seal number" name="seal number" value={formData["seal number"]} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="client_ name">Nama Klien</Label>
          <Input id="client_ name" name="client_ name" value={formData["client_ name"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="client address">Alamat Klien</Label>
          <Textarea id="client address" name="client address" value={formData["client address"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="commodity description">Deskripsi Komoditas</Label>
          <Input id="commodity description" name="commodity description" value={formData["commodity description"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="commodity country of origin">Negara Asal Komoditas</Label>
          <Input id="commodity country of origin" name="commodity country of origin" value={formData["commodity country of origin"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="commodity quantity">Jumlah Komoditas</Label>
          <Input id="commodity quantity" name="commodity quantity" value={formData["commodity quantity"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="port of loading">Pelabuhan Muat</Label>
          <Input id="port of loading" name="port of loading" value={formData["port of loading"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="destination country">Negara Tujuan</Label>
          <Input id="destination country" name="destination country" value={formData["destination country"]} onChange={handleChange} required />
        </div>
      </div>
      <hr />

      {/* Bagian Pilihan Centang */}
      <div className="grid md:grid-cols-2 gap-8 pt-4">
        <div>
          <Label className="text-base font-semibold">Target of Fumigation (Pilih semua yang sesuai)</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="target_commodity" checked={formData.target_commodity} onCheckedChange={(checked) => handleCheckboxChange('target_commodity', checked as boolean)} />
              <Label htmlFor="target_commodity" className="font-normal">Commodity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="target_packaging" checked={formData.target_packaging} onCheckedChange={(checked) => handleCheckboxChange('target_packaging', checked as boolean)} />
              <Label htmlFor="target_packaging" className="font-normal">Packaging</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="target_container" checked={formData.target_container} onCheckedChange={(checked) => handleCheckboxChange('target_container', checked as boolean)} />
              <Label htmlFor="target_container" className="font-normal">Container</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="target_other" checked={formData.target_other} onCheckedChange={(checked) => handleCheckboxChange('target_other', checked as boolean)} />
              <Label htmlFor="target_other" className="font-normal">Other</Label>
              {formData.target_other && (
                <Input name="target_other_input" value={formData.target_other_input} onChange={handleChange} placeholder="Sebutkan..." className="h-8 ml-2" />
              )}
            </div>
          </div>
        </div>
        
        <div>
          <Label className="text-base font-semibold">Enclosure Type (Pilih satu)</Label>
          <RadioGroup value={formData.enclosure_type} onValueChange={(value) => setFormData(prev => ({...prev, enclosure_type: value}))} className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sheeted" id="sheeted" />
              <Label htmlFor="sheeted" className="font-normal">Sheeted enclosure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="chamber" id="chamber" />
              <Label htmlFor="chamber" className="font-normal">Fumigation chamber</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsheeted" id="unsheeted" />
              <Label htmlFor="unsheeted" className="font-normal">Un-sheeted container</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="font-normal">Other</Label>
              {formData.enclosure_type === 'other' && (
                <Input name="enclosure_other_input" value={formData.enclosure_other_input} onChange={handleChange} placeholder="Sebutkan..." className="h-8 ml-2" />
              )}
            </div>
          </RadioGroup>
        </div>
      </div>
      <hr />

      {/* Bagian Detail Treatment */}
      <h3 className="text-lg font-semibold pt-4">Jadwal & Detail Treatment</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dose">Dose Rate (g/m³)</Label>
          <Input id="dose" name="dose" value={formData.dose} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="period">Exposure Period (jam)</Label>
          <Input id="period" name="period" value={formData.period} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="temperature">Suhu (°C)</Label>
          <Input id="temperature" name="temperature" value={formData.temperature} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="applied dose">Applied Dose (g/m³)</Label>
          <Input id="applied dose" name="applied dose" value={formData["applied dose"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="period2">Exposure Period 2 (jam)</Label>
          <Input id="period2" name="period2" value={formData.period2} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="temprature2">Suhu 2 (°C)</Label>
          <Input id="temprature2" name="temprature2" value={formData.temprature2} onChange={handleChange} required />
        </div>
      </div>
      <hr />

      {/* Bagian Detail Fumigasi */}
      <h3 className="text-lg font-semibold pt-4">Detail Fumigasi</h3>
      <div>
        <Label htmlFor="place of fumigation">Tempat Fumigasi</Label>
        <Input id="place of fumigation" name="place of fumigation" value={formData["place of fumigation"]} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="Alamat">Alamat Lengkap</Label>
        <Textarea id="Alamat" name="Alamat" value={formData.Alamat} onChange={handleChange} required />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date and time fumigation commenced">Waktu Mulai Fumigasi</Label>
          <Input id="date and time fumigation commenced" name="date and time fumigation commenced" type="datetime-local" value={formData["date and time fumigation commenced"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="date and time fumigation completed">Waktu Selesai Fumigasi</Label>
          <Input id="date and time fumigation completed" name="date and time fumigation completed" type="datetime-local" value={formData["date and time fumigation completed"]} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="final tlv">Final TLV Reading (ppm)</Label>
        <Input id="final tlv" name="final tlv" value={formData["final tlv"]} onChange={handleChange} required />
      </div>
      <hr />

      {/* Bagian Deklarasi */}
      <h3 className="text-lg font-semibold pt-4">Deklarasi</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="full name">Nama Lengkap Fumigator</Label>
          <Input id="full name" name="full name" value={formData["full name"]} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="date">Tanggal Deklarasi</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="accreditation number">Nomor Akreditasi</Label>
          <Input id="accreditation number" name="accreditation number" value={formData["accreditation number"]} onChange={handleChange} required />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
        {isLoading ? "Generating..." : "Generate and Download"}
      </Button>
    </form>
  );
}
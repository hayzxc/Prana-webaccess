import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Path ke template Word
    const templatePath = path.join(process.cwd(), "public", "certificate_template.docx");
    
    // Baca template Word
    const templateBuffer = fs.readFileSync(templatePath);
    const zip = new PizZip(templateBuffer);
    
    // Buat docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Mapping data dari form ke placeholder template
    const templateData = {
      // Header
      "date issued(dd/mm/yyyy)": data["date issued(dd/mm/yyyy)"] || data.dateIssued || "",
      "Nomer Sertifikat": data["Nomer Sertifikat"] || data.certificateNumber || "",
      "Treatment Number": data["Treatment Number"] || data.treatmentNumber || "",
      
      // Shipment/Client
      "Consigment Link": data["Consigment Link"] || data.consignmentLink || "",
      "seal number": data["seal number"] || data.sealNumber || "",
      "client_ name": data["client_ name"] || data.clientName || "",
      "client address": data["client address"] || data.clientAddress || "",
      "commodity description": data["commodity description"] || data.commodityDescription || "",
      "commodity country of origin": data["commodity country of origin"] || data.commodityOrigin || "",
      "commodity quantity": data["commodity quantity"] || data.commodityQuantity || "",
      "port of loading": data["port of loading"] || data.portLoading || "",
      "destination country": data["destination country"] || data.destinationCountry || "",
      
      // Target of Fumigation - menggunakan checkbox symbols
      "target_commodity_check": data.target_commodity_check || (data.targetCommodity ? "☑" : "☐"),
      "target_packaging_check": data.target_packaging_check || (data.targetPackaging ? "☑" : "☐"),
      "target_container_check": data.target_container_check || (data.targetContainer ? "☑" : "☐"),
      "target_other_details": data.target_other_details || (data.targetOther ? `☑ Other: ${data.targetOtherDetails || ""}` : "☐ Other (provide details)"),
      
      // Enclosure Type
      "enclosure_sheeted_check": data.enclosure_sheeted_check || (data.enclosureType === 'sheeted' ? "☑" : "☐"),
      "enclosure_chamber_check": data.enclosure_chamber_check || (data.enclosureType === 'chamber' ? "☑" : "☐"),
      "enclosure_unsheeted_check": data.enclosure_unsheeted_check || (data.enclosureType === 'unsheeted' ? "☑" : "☐"),
      "enclosure_other_details": data.enclosure_other_details || (data.enclosureType === 'other' ? `☑ Other: ${data.enclosureOtherDetails || ""}` : "☐ Other (provide details)"),
      
      // Treatment Details
      "dose": data.dose || "",
      "period": data.period || "",
      "temperature": data.temperature || "",
      "applied dose": data["applied dose"] || data.appliedDose || "",
      "period2": data.period2 || "",
      "temprature2": data.temprature2 || data.temperature2 || "",
      
      // Fumigation Information
      "place of fumigation": data["place of fumigation"] || data.placeOfFumigation || "",
      "Alamat": data.Alamat || data.addressOfFumigation || "",
      "date and time fumigation commenced": data["date and time fumigation commenced"] || data.startTime || "",
      "date and time fumigation completed": data["date and time fumigation completed"] || data.endTime || "",
      "final tlv": data["final tlv"] || data.finalTlv || "",
      
      // Signatory
      "full name": data["full name"] || data.fullName || "",
      "date": data.date || data.signDate || "",
      "accreditation number": data["accreditation number"] || data.accreditationNumber || "",
    };

    // Render template dengan data
    doc.render(templateData);

    // Generate buffer
    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 4,
      },
    });

    return new Response(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="certificate.docx"',
      },
    });
  } catch (error: any) {
    console.error("❌ Error generate certificate:", error);
    return NextResponse.json(
      { message: "Failed to generate certificate", error: error.message },
      { status: 500 }
    );
  }
}

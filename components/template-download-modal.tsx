"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileDown, FileText } from "lucide-react";

interface TemplateDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TemplateDownloadModal({ isOpen, onClose }: TemplateDownloadModalProps) {


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-prana-navy" />
                        Download Template Form
                    </DialogTitle>
                    <DialogDescription>
                        Unduh template formulir pengajuan kami dalam format Microsoft Word untuk memudahkan proses pengajuan Anda.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <FileDown className="h-10 w-10 text-prana-blue" />
                        </div>
                        <p className="font-medium text-prana-navy">Template Form Pengajuan</p>
                        <p className="text-sm text-gray-500 mt-1">.DOCX (Microsoft Word)</p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Batal
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                const res = await fetch('/template-form.docx');
                                if (!res.ok) throw new Error('Network response was not ok');
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'template-form.docx';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                            } catch (err) {
                                // fallback: open in new tab
                                const link = document.createElement('a');
                                link.href = '/template-form.docx';
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }}
                        className="w-full sm:w-auto bg-prana-navy hover:bg-blue-800"
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

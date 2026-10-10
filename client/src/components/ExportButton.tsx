import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TimetableDay } from "@shared/schema";

interface ExportButtonProps {
  timetable: TimetableDay[];
  disabled?: boolean;
}

export default function ExportButton({ timetable, disabled = false }: ExportButtonProps) {
  const exportToPDF = () => {
    console.log("Exporting timetable to PDF...");
    
    if (timetable.length === 0) {
      console.warn("No timetable data to export");
      return;
    }

    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(16);
    pdf.text("Weekly ICT Timetable", 14, 20);
    
    let yPosition = 35;
    
    timetable.forEach((dayData) => {
      // Add day header
      pdf.setFontSize(14);
      pdf.text(dayData.day, 14, yPosition);
      yPosition += 10;
      
      // Create table data
      const tableData = dayData.entries.map(entry => [entry.time, entry.grade]);
      
      // Add table
      autoTable(pdf, {
        head: [["Time", "Grade/Class"]],
        body: tableData,
        startY: yPosition,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 133, 244] }, // Blue header
      });
      
      // Update position for next table
      const finalY = (pdf as any).lastAutoTable.finalY || yPosition + 20;
      yPosition = finalY + 15;
      
      // Add new page if needed
      if (yPosition > 250 && dayData !== timetable[timetable.length - 1]) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`ICT_Timetable_${timestamp}.pdf`);
    
    console.log("PDF exported successfully");
  };

  return (
    <Button
      onClick={exportToPDF}
      disabled={disabled || timetable.length === 0}
      className="w-full sm:w-auto"
      data-testid="button-export-pdf"
    >
      <Download className="h-4 w-4 mr-2" />
      Export to PDF
    </Button>
  );
}
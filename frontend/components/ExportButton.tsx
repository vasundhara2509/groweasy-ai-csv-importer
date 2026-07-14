"use client";

import * as XLSX from "xlsx";

interface ExportButtonProps {
  leads: any[];
}

export default function ExportButton({ leads }: ExportButtonProps) {

  const exportExcel = () => {

    if (!leads || leads.length === 0) {
      alert("No data available to export.");
      return;
    }

    const exportData = leads.map((lead) => ({
      Name: lead.Name,
      Company: lead.Company,
      "Lead Score": lead["Lead Score"] ?? lead.Score ?? 0,
      Category: lead.Category,
      Reason: lead.Reason,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 22 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 60 },
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "AI Lead Report"
    );

    // Current Date & Time
    const now = new Date();

    const filename =
      `AI_Lead_Report_${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, "0")}-` +
      `${String(now.getDate()).padStart(2, "0")}_` +
      `${String(now.getHours()).padStart(2, "0")}-` +
      `${String(now.getMinutes()).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={exportExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
      >
        📥 Export Excel Report
      </button>
    </div>
  );
}
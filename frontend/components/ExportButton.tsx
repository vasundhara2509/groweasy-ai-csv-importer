"use client";

import { saveAs } from "file-saver";

interface ExportButtonProps {
  leads: any[];
}

export default function ExportButton({
  leads,
}: ExportButtonProps) {

  const exportCSV = () => {

    if (leads.length === 0) {
      alert("No data available.");
      return;
    }

    const headers = [
      "Name",
      "Company",
      "Lead Score",
      "Category",
      "Reason",
    ];

    const rows = leads.map((lead) => [
      lead.Name,
      lead.Company,
      lead["Lead Score"] ?? lead.Score,
      lead.Category,
      lead.Reason,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "AI_Lead_Report.csv");
  };

  return (
    <div className="flex justify-end mb-6">

      <button
        onClick={exportCSV}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
      >
        ⬇ Export AI Report
      </button>

    </div>
  );
}
"use client";

import { useState } from "react";
import Header from "../components/Header";
import UploadBox from "../components/UploadBox";
import PreviewTable from "../components/PreviewTable";

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">

        <Header
          title="GrowEasy AI CSV Importer"
          subtitle="Upload any CSV file and let AI intelligently extract CRM lead information."
        />

        <UploadBox onDataParsed={setCsvData} />

        <PreviewTable data={csvData} />

      </div>
    </main>
  );
}
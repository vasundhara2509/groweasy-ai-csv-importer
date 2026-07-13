"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import AIResultTable from "./AIResultTable";

interface UploadBoxProps {
  onDataParsed: (data: any[]) => void;
}

export default function UploadBox({ onDataParsed }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as any[];

        setCsvData(parsedData);
        onDataParsed(parsedData);
      },
    });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/import",
        {
          data: csvData,
        }
      );

      setLoading(false);

      if (response.data.success) {
        setAiResult(response.data.aiResponse);
      } else {
        alert(response.data.error);
      }
    } catch (error: any) {
      setLoading(false);

      console.error(error);

      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("Cannot connect to backend.");
      }
    }
  };

  return (
    <>
      <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">

        <h2 className="text-3xl font-bold text-gray-800">
          📂 Upload CSV File
        </h2>

        <p className="mt-3 text-gray-500">
          Browse your CSV and let AI analyze your leads.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={handleBrowseClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Browse CSV
        </button>

        {selectedFile && (
          <>
            <p className="mt-6 text-green-600 text-lg font-semibold">
              ✅ {selectedFile.name}
            </p>

            <button
              onClick={handleImport}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Confirm Import
            </button>
          </>
        )}
      </div>

      {loading && (
        <div className="mt-10 text-center">
          <h2 className="text-blue-600 text-2xl font-bold animate-pulse">
            🤖 AI is analyzing your CSV...
          </h2>
        </div>
      )}
            {aiResult && (
        <AIResultTable aiResult={aiResult} />
      )}
    </>
  );
}
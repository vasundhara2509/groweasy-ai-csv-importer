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

        console.log("CSV Parsed Successfully:");
        console.log(parsedData);

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

      console.log("Sending CSV to Backend...");
      console.log(csvData);

      const response = await axios.post(
        "http://localhost:5000/import",
        {
          data: csvData,
        },
        {
          timeout: 60000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Backend Response:");
      console.log(response.data);

      setLoading(false);

      if (response.data.success) {
        setAiResult(response.data.aiResponse);
      } else {
        alert(response.data.error || "Unknown backend error.");
      }

    } catch (error: any) {
      setLoading(false);

      console.error("========== AXIOS ERROR ==========");
      console.error(error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        alert(
          "Backend Error:\n\n" +
          JSON.stringify(error.response.data, null, 2)
        );

      } else if (error.request) {
        console.log("No response received from backend.");

        alert(
          "No response received from backend.\n\n" +
          "Make sure server.js is running."
        );

      } else {
        console.log(error.message);
        alert(error.message);
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
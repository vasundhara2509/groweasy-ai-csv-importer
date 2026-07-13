"use client";

import { useState } from "react";
import DashboardCards from "./DashboardCards";
import SearchFilter from "./SearchFilter";
import LeadPieChart from "./LeadPieChart";
import ExportButton from "./ExportButton";

interface AIResultTableProps {
  aiResult: string;
}

export default function AIResultTable({
  aiResult,
}: AIResultTableProps) {
  if (!aiResult) return null;

  let leads: any[] = [];

  try {
    const cleaned = aiResult
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    leads = JSON.parse(cleaned);
  } catch (error) {
    return (
      <div className="mt-10 p-6 rounded-xl bg-red-50 border border-red-300">
        <h2 className="text-2xl font-bold text-red-700">
          Invalid AI Response
        </h2>

        <pre className="mt-4 whitespace-pre-wrap text-black">
          {aiResult}
        </pre>
      </div>
    );
  }

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredLeads = leads.filter((lead) => {
    const name = (lead.Name || "").toLowerCase();
    const company = (lead.Company || "").toLowerCase();

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      company.includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (lead.Category || "").toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mt-10">

      {/* Dashboard Cards */}
      <DashboardCards leads={filteredLeads} />

      {/* Search & Filter */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Export Button */}
      <ExportButton leads={filteredLeads} />

      {/* AI Result Table */}
      <div className="bg-white border border-gray-300 rounded-2xl shadow-xl p-8">

        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          🤖 AI Lead Analysis
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse">

            <thead>

              <tr className="bg-blue-600">

                <th className="px-5 py-4 text-left text-white">
                  Name
                </th>

                <th className="px-5 py-4 text-left text-white">
                  Company
                </th>

                <th className="px-5 py-4 text-center text-white">
                  Score
                </th>

                <th className="px-5 py-4 text-center text-white">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-white">
                  Reason
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.map((lead, index) => {

                const score =
                  lead["Lead Score"] ??
                  lead.Score ??
                  0;

                const category =
                  lead.Category ??
                  "Unknown";

                let badge = "bg-gray-500";

                if (category.toLowerCase() === "hot")
                  badge = "bg-red-500";

                if (category.toLowerCase() === "warm")
                  badge = "bg-yellow-500";

                if (category.toLowerCase() === "cold")
                  badge = "bg-blue-500";

                return (

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >

                    <td className="px-5 py-4 text-gray-900">
                      {lead.Name}
                    </td>

                    <td className="px-5 py-4 text-gray-900">
                      {lead.Company}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-24 bg-gray-200 rounded-full h-3">

                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{
                              width: `${score}%`,
                            }}
                          />

                        </div>

                        <span className="font-bold text-green-700">
                          {score}
                        </span>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`${badge} text-white px-4 py-2 rounded-full`}
                      >
                        {category}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-gray-800 leading-7">
                      {lead.Reason}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pie Chart */}
      <LeadPieChart leads={filteredLeads} />

    </div>
  );
}
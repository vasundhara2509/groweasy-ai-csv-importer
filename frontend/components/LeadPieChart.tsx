"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LeadPieChartProps {
  leads: any[];
}

export default function LeadPieChart({
  leads,
}: LeadPieChartProps) {
  if (!leads || leads.length === 0) return null;

  const hot = leads.filter(
    (lead) => (lead.Category || "").toLowerCase() === "hot"
  ).length;

  const warm = leads.filter(
    (lead) => (lead.Category || "").toLowerCase() === "warm"
  ).length;

  const cold = leads.filter(
    (lead) => (lead.Category || "").toLowerCase() === "cold"
  ).length;

  const data = [
    { name: "Hot", value: hot },
    { name: "Warm", value: warm },
    { name: "Cold", value: cold },
  ];

  const COLORS = [
    "#ef4444",
    "#eab308",
    "#3b82f6",
  ];

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl border border-gray-300 p-8">

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        📊 Lead Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}
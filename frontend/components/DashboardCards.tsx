"use client";

interface DashboardCardsProps {
  leads: any[];
}

export default function DashboardCards({
  leads,
}: DashboardCardsProps) {
  if (!leads || leads.length === 0) return null;

  const total = leads.length;

  const hot = leads.filter(
    (lead) =>
      (lead.Category || "").toLowerCase() === "hot"
  ).length;

  const warm = leads.filter(
    (lead) =>
      (lead.Category || "").toLowerCase() === "warm"
  ).length;

  const cold = leads.filter(
    (lead) =>
      (lead.Category || "").toLowerCase() === "cold"
  ).length;

  const avg =
    Math.round(
      leads.reduce(
        (sum, lead) =>
          sum +
          Number(
            lead["Lead Score"] ??
              lead.Score ??
              0
          ),
        0
      ) / total
    );

  const cards = [
    {
      title: "Total Leads",
      value: total,
      color: "bg-blue-500",
      icon: "📄",
    },
    {
      title: "Hot Leads",
      value: hot,
      color: "bg-red-500",
      icon: "🔥",
    },
    {
      title: "Warm Leads",
      value: warm,
      color: "bg-yellow-500",
      icon: "🟡",
    },
    {
      title: "Cold Leads",
      value: cold,
      color: "bg-cyan-500",
      icon: "🔵",
    },
    {
      title: "Average Score",
      value: avg,
      color: "bg-green-600",
      icon: "📊",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-xl shadow-lg text-white p-6`}
        >
          <div className="text-3xl mb-3">
            {card.icon}
          </div>

          <h3 className="text-lg font-semibold">
            {card.title}
          </h3>

          <p className="text-4xl font-bold mt-3">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
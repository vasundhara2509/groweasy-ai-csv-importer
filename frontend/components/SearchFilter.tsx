"use client";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
}

export default function SearchFilter({
  search,
  setSearch,
  filter,
  setFilter,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">

        <input
          type="text"
          placeholder="🔍 Search by Name or Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">

          <button
            onClick={() => setFilter("All")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              filter === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("Hot")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              filter === "Hot"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            🔥 Hot
          </button>

          <button
            onClick={() => setFilter("Warm")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              filter === "Warm"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            🟡 Warm
          </button>

          <button
            onClick={() => setFilter("Cold")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              filter === "Cold"
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            🔵 Cold
          </button>

        </div>

      </div>

    </div>
  );
}
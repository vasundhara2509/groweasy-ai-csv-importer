interface PreviewTableProps {
  data: any[];
}

export default function PreviewTable({ data }: PreviewTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        CSV Preview
      </h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {Object.values(row).map((value: any, i) => (
                <td
                  key={i}
                  className="border border-gray-300 px-4 py-3 text-gray-700"
                >
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
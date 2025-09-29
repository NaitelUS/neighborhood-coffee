import { useEffect, useState } from "react";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const res = await fetch("/.netlify/functions/feedback");
        const data = await res.json();
        setFeedbacks(data);

        if (data.length > 0) {
          const avg =
            data.reduce((sum: number, f: any) => sum + (f.Rating || 0), 0) /
            data.length;
          setAverage(avg);
        } else {
          setAverage(0);
        }
      } catch (err) {
        console.error("Error loading feedback:", err);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, []);

  const exportCSV = () => {
    if (!feedbacks.length) return alert("No feedback to export.");

    const headers = ["Order", "Rating", "Comment", "Created"];
    const rows = feedbacks.map((f) => [
      f.Order && typeof f.Order === "object" ? f.Order[0] : f.Order || "",
      f.Rating || "",
      f.Comment || "",
      f.Created || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `feedback_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading feedback...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customer Feedback</h1>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
        >
          ⬇ Export CSV
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback yet.</p>
      ) : (
        <>
          {/* ⭐ Promedio general */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold">Average Rating:</h2>
            <span className="text-yellow-500 text-2xl">
              {"★".repeat(Math.round(average))}{" "}
            </span>
            <span className="text-gray-600">({average.toFixed(2)})</span>
          </div>

          {/* Tabla de reseñas */}
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Order</th>
                  <th className="border px-3 py-2 text-left">Rating</th>
                  <th className="border px-3 py-2 text-left">Comment</th>
                  <th className="border px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td className="border px-3 py-2">
                      {fb.Order && typeof fb.Order === "object"
                        ? fb.Order[0]
                        : fb.Order}
                    </td>
                    <td className="border px-3 py-2">
                      <span className="text-yellow-500">
                        {"★".repeat(fb.Rating || 0)}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      {fb.Comment || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="border px-3 py-2">
                      {fb.Created
                        ? new Date(fb.Created).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

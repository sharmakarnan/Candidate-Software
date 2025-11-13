import { useEffect, useState } from "react";

type TestResult = {
  test_id: number;
  name: string;
  score: number;
  result: string;
};

export default function Results() {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tests/results")
      .then((res) => res.json())
      .then(setResults);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
          👨‍💼 HR Test Results
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="py-3 px-4 border-b">Test ID</th>
                <th className="py-3 px-4 border-b">Candidate</th>
                <th className="py-3 px-4 border-b">Score</th>
                <th className="py-3 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.test_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{r.test_id}</td>
                  <td className="py-3 px-4">{r.name}</td>
                  <td className="py-3 px-4">{r.score}</td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      r.result === "PASSED" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {r.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

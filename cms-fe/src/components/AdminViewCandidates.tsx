import React, { useEffect, useState } from "react";
import api from "../services/api";

interface CandidateDetails {
  id: number;
  candidate_name: string;
  candidate_email: string;
  position: string;
  username: string;
  status: string;
  full_name?: string;
  phone?: string;
  gender?: string;
  education?: string;
  experience?: string;
  skills?: string;
  resume_link?: string;
}

const AdminViewCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("/admin/registered");
        setCandidates(res.data);
      } catch (err) {
        console.error("❌ Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        ⏳ Loading Registered Candidates...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-10 px-6 fade-in">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
          👩‍💼 Registered Candidates
        </h2>

        {candidates.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No registered candidates found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Candidate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Education</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skills</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Resume</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {candidates.map((c, index) => (
                  <tr
                    key={c.id}
                    className="hover:bg-green-50 transition duration-200"
                  >
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {c.full_name || c.candidate_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.candidate_email}</td>
                    <td className="px-4 py-3 text-gray-600">{c.position}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.education || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                      {c.skills || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          c.status === "REGISTER_COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.resume_link ? (
                        <a
                          href={c.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminViewCandidates;

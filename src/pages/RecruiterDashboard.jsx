import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/jobs/my",
          { headers: { Authorization: token } }
        );
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchMyJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/applications/job/${jobId}`,
        { headers: { Authorization: token } }
      );

      setApplicants((prev) => ({
        ...prev,
        [jobId]: res.data
      }));
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const approveApplicant = async (appId, jobId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/applications/approve/${appId}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchApplicants(jobId);
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  const rejectApplicant = async (appId, jobId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/applications/reject/${appId}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchApplicants(jobId);
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };

  // ============================
  // Dashboard Statistics
  // ============================

  const allApplicants = Object.values(applicants).flat();

  const totalJobs = jobs.length;
  const totalApplicants = allApplicants.length;
  const approvedCount = allApplicants.filter(a => a.status === "approved").length;
  const pendingCount = allApplicants.filter(a => a.status === "pending").length;
  const rejectedCount = allApplicants.filter(a => a.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          Recruiter Dashboard
        </h2>

        <button
          onClick={() => navigate("/post-job")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl shadow-lg transition"
        >
          + Post New Job
        </button>
      </div>

      {/* ========================= */}
      {/* Statistics Section */}
      {/* ========================= */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">

        <StatCard title="Total Jobs" value={totalJobs} color="blue" />
        <StatCard title="Applicants" value={totalApplicants} color="purple" />
        <StatCard title="Approved" value={approvedCount} color="green" />
        <StatCard title="Pending" value={pendingCount} color="yellow" />
        <StatCard title="Rejected" value={rejectedCount} color="red" />

      </div>

      {/* ========================= */}
      {/* Jobs Section */}
      {/* ========================= */}

      {jobs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center shadow-lg">
          <p className="text-gray-400 text-lg">
            You haven't posted any jobs yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {job.title}
              </h3>

              <button
                onClick={() => fetchApplicants(job._id)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl mb-4 transition"
              >
                View Applicants
              </button>

              {applicants[job._id] && (
                <div className="space-y-4">
                  {applicants[job._id].length === 0 ? (
                    <p className="text-gray-500">No applicants yet.</p>
                  ) : (
                    applicants[job._id].map((app) => (
                      <div
                        key={app._id}
                        className="bg-gray-800 border border-gray-700 p-4 rounded-xl"
                      >
                        <p className="font-medium text-white">
                          {app.applicant.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {app.applicant.email}
                        </p>

                        <div className="mt-3">
                          <span
                            className={`px-3 py-1 text-sm rounded-full font-medium ${
                              app.status === "approved"
                                ? "bg-green-900 text-green-400"
                                : app.status === "rejected"
                                ? "bg-red-900 text-red-400"
                                : "bg-yellow-900 text-yellow-400"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        {app.status === "pending" && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() =>
                                approveApplicant(app._id, job._id)
                              }
                              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-lg transition"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                rejectApplicant(app._id, job._id)
                              }
                              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================
// Reusable Stat Card
// =========================

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400"
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-lg text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h3>
    </div>
  );
};

export default RecruiterDashboard;
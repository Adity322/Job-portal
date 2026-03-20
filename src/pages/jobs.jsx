import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resumeFile, setResumeFile] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all jobs
        const jobRes = await axios.get("http://localhost:8000/api/jobs");
        setJobs(jobRes.data);

        // Fetch applied jobs if logged in
        const token = localStorage.getItem("token");

        if (token) {
          const appRes = await axios.get(
            "http://localhost:8000/api/applications/my",
            {
              headers: { Authorization: token }
            }
          );

          const appliedJobIds = appRes.data.map(app => app.job);
          setAppliedJobs(appliedJobIds);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    // 🚨 If not logged in → redirect to login
    if (!token) {
      navigate("/login", { state: { from: "/jobs" } });
      return;
    }

    if (!resumeFile) {
      alert("Please upload resume first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      await axios.post(
        `http://localhost:8000/api/applications/apply/${jobId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Applied successfully ✅");
      setAppliedJobs([...appliedJobs, jobId]);

    } catch (error) {
      alert(error.response?.data?.message || "Apply failed");
    }
  };
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLocation = selectedLocation
      ? job.location === selectedLocation
      : true;

    return matchesSearch && matchesLocation;
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-16 text-white">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold mb-8 text-center">
          Available Jobs
        </h2>

        {/* 🔍 Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">

          <input
            type="text"
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-5 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
          />

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-5 py-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-60"
          >
            <option value="">All Locations</option>
            {[...new Set(jobs.map((job) => job.location))].map(
              (location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              )
            )}
          </select>
        </div>

        {/* 📦 Job Grid */}
        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-400">No jobs found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredJobs.map((job, index) => (
              <div
                key={job._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl transform transition duration-500 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-semibold mb-2">
                  {job.title}
                </h3>

                <div className="flex gap-3 mb-4 text-sm">
                  <span className="bg-blue-600 px-3 py-1 rounded-full">
                    {job.company}
                  </span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full">
                    {job.location}
                  </span>
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    View Details
                  </button>

                  {appliedJobs.includes(job._id) ? (
                    <button
                      disabled
                      className="bg-green-600 px-4 py-2 rounded-lg"
                    >
                      Applied ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => setApplyJob(job)}
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 📄 View Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-lg relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-4">
                {selectedJob.title}
              </h3>

              <p className="mb-2">
                <strong>Company:</strong> {selectedJob.company}
              </p>

              <p className="mb-2">
                <strong>Location:</strong> {selectedJob.location}
              </p>

              <p className="text-gray-300 mt-4">
                {selectedJob.description}
              </p>
            </div>
          </div>
        )}
        {/* 📄 Apply Modal */}
        {applyJob && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md relative">

              <button
                onClick={() => {
                  setApplyJob(null);
                  setResumeFile(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-6 text-center">
                Apply for {applyJob.title}
              </h3>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full mb-4 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />

              {resumeFile && (
                <p className="text-sm text-green-400 mb-4">
                  Selected: {resumeFile.name}
                </p>
              )}

              <button
                onClick={() => {
                  handleApply(applyJob._id);
                  setApplyJob(null);
                }}
                className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Confirm Apply
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Jobs
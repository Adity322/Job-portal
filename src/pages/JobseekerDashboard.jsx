import { useEffect, useState } from "react";
import axios from "axios";

const JobseekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [about, setAbout] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/applications/my",
          {
            headers: { Authorization: token }
          }
        );

        setApplications(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApplications();
  }, [token]);

  // Withdraw application (uses jobId because backend expects jobId)
  const handleWithdraw = async (jobId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/applications/withdraw/${jobId}`,
        {
          headers: { Authorization: token }
        }
      );

      // Remove withdrawn job from UI
      setApplications(prev =>
        prev.filter(app => app.job._id !== jobId)
      );

    } catch (error) {
      console.log(error.response?.data);
      alert("Withdraw failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-12 text-center">
          My Profile Dashboard
        </h2>

        {/* Profile Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          <div className="space-y-8">

            {/* Skills */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Skills</h3>

              {isEditing ? (
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-gray-800 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-300">
                  {skills || "No skills added yet."}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Education</h3>

              {isEditing ? (
                <textarea
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-gray-800 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-300">
                  {education || "No education details added yet."}
                </p>
              )}
            </div>

          </div>

          {/* About Section */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">About Me</h3>

            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full bg-gray-800 p-4 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              />
            ) : (
              <p className="text-gray-300">
                {about || "Tell recruiters about yourself."}
              </p>
            )}

            <div className="mt-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6">
            My Applications
          </h3>

          {applications.length === 0 ? (
            <p className="text-gray-400">
              You haven’t applied to any jobs yet.
            </p>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl flex justify-between items-center flex-wrap gap-4"
                >
                  <div>
                    <h4 className="text-lg font-semibold">
                      {app.job?.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {app.job?.company} • {app.job?.location}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        app.status?.toLowerCase() === "approved"
                          ? "bg-green-600"
                          : app.status?.toLowerCase() === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => handleWithdraw(app.job._id)}
                      className="bg-red-600 px-4 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Withdraw
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobseekerDashboard;
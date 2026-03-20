import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/api/jobs/post",
        formData,
        {
          headers: { Authorization: token }
        }
      );

      alert("Job posted successfully ✅");

      setFormData({
        title: "",
        description: "",
        company: "",
        location: ""
      });

      navigate("/recruiter-dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Error posting job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      
      <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl w-full max-w-2xl p-8">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Job Title */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              placeholder="e.g. Google"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Mumbai, India"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Enter detailed job description..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            
            <button
              type="button"
              onClick={() => navigate("/recruiter-dashboard")}
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
            >
              Post Job
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJob;
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center overflow-hidden px-6">

      {/* 🔵 Floating Shapes */}
      <div className="absolute w-72 h-72 bg-blue-600 opacity-20 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>
      <div className="absolute w-60 h-60 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2"></div>

      {/* 🔥 Main Content */}
      <div className="relative text-center max-w-3xl z-10">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Search Your <span className="text-blue-500">Dream Job</span> Today
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg mb-10">
          Discover thousands of job opportunities from top companies.
          Build your career with confidence.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by job title, company, or skills..."
            className="w-full md:w-96 px-5 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Search
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mb-16">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:scale-105 transition duration-300 shadow-xl"
          >
            Find Jobs
          </button>

          <button
            onClick={() => navigate("/post-job")}
            className="border-2 border-blue-500 text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Post a Job
          </button>
        </div>
      </div>

      {/* 📊 Stats Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center text-white pb-16">
        <div>
          <h2 className="text-4xl font-bold text-blue-500">10K+</h2>
          <p className="text-gray-300 mt-2">Active Job Listings</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-blue-500">5K+</h2>
          <p className="text-gray-300 mt-2">Companies Hiring</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-blue-500">25K+</h2>
          <p className="text-gray-300 mt-2">Successful Candidates</p>
        </div>
      </div>

    </div>
  );
}

export default Home;
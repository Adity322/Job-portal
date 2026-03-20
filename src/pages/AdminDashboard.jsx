import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    recruiters: 0,
    jobs: 0,
  });

  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingJobs();
  }, []);

  const token = localStorage.getItem("token");

  // ==========================
  // Fetch Stats
  // ==========================
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/jobs/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // ==========================
  // Fetch Pending Jobs
  // ==========================
  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/jobs/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Token being sent:",token);

      setPendingJobs(res.data);
    } catch (error) {
      console.error("Error fetching pending jobs:", error);
    }
  };

  // ==========================
  // Approve Job
  // ==========================
  const approveJob = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/jobs/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job approved successfully ✅");

      fetchPendingJobs();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Delete Job
  // ==========================
  const deleteJob = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/jobs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job deleted ❌");

      fetchPendingJobs();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Manage Users</li>
          <li>Manage Jobs</li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <h1>Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>

          <div className="card">
            <h3>Total Recruiters</h3>
            <p>{stats.recruiters}</p>
          </div>

          <div className="card">
            <h3>Total Jobs</h3>
            <p>{stats.jobs}</p>
          </div>
        </div>

        {/* Pending Jobs Section */}
        <h2 style={{ marginTop: "40px" }}>
          Pending Job Approvals
        </h2>

        {pendingJobs.length === 0 ? (
          <p>No pending jobs</p>
        ) : (
          <div className="job-list">
            {pendingJobs.map((job) => (
              <div key={job._id} className="job-card">
                <h4>{job.title}</h4>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>

                <div className="job-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => approveJob(job._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteJob(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
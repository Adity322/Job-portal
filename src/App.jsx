import { BrowserRouter, Routes, Route } from "react-router-dom";
import Jobs from "./pages/jobs";
import Login from "./pages/login";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Register from "./pages/Register_temp";
import PostJob from "./pages/PostJob";
import AdminDashboard from "./pages/AdminDashboard";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
function App() {
  return (
    <BrowserRouter>
      {/* Navbar should be outside Routes */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<JobseekerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;

  try {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      role = decoded.role;
    }
  } catch (error) {
    console.log("Invalid token");
    localStorage.removeItem("token");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      background: "#1e293b",
      color: "white"
    }}>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          JobPortal
        </Link>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        {!token && (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        )}

        {role === "jobseeker" && (
          <>
            <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/" style={{ color: "white" }}>Jobs</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {role === "recruiter" && (
          <>
            <Link to="/recruiter" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/post-job" style={{ color: "white" }}>Post Job</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin" style={{ color: "white" }}>Admin</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
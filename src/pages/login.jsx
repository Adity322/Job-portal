import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [lightOn, setLightOn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      const decoded = JSON.parse(atob(res.data.token.split(".")[1]));

      if (decoded.role === "recruiter") {
        navigate("/recruiter");
      } else if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`login-page ${lightOn ? "light" : "dark"}`}>

      <div className="lamp-container">
        <div className="lamp"></div>
        <div
          className="cord"
          onClick={() => setLightOn(!lightOn)}
        ></div>
      </div>

      {lightOn && <div className="glow"></div>}

      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register", { state: { from } })}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
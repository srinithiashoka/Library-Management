import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const API_URL = import.meta.env.VITE_API_URL;
    const email = formData.email.trim().toLowerCase();

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`);
      const users = await res.json();

      const user = users.find((u: any) => u.email.toLowerCase() === email);

      if (user) {
        alert("Login successful!");
        navigate("/add-book");
      } else {
        setError("User not found. Redirecting to signup...");
        setTimeout(() => navigate("/signup"), 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don’t have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

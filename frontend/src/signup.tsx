import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const API_URL = import.meta.env.VITE_API_URL;
    const { name, email } = formData;

    try {
      // ✅ Check if user already exists
      const res = await fetch(`${API_URL}/users`);
      const users = await res.json();
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        setError("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // ✅ Register user
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful. Redirecting to login...");
        navigate("/login");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;

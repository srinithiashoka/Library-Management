import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ import CSS

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

    try {
      const res = await fetch("http://localhost:3000/users");
      const users = await res.json();
      const existingUser = users.find((u: any) => u.email === formData.email);

      if (existingUser) {
        setError("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Signup successful. Redirecting to login...");
        navigate("/login");
      } else {
        setError("Signup failed");
      }
    } catch (err) {
      setError("Something went wrong");
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

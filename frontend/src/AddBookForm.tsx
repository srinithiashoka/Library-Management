import { useState, useEffect } from "react";
import "./AddBookForm.css";
type User = {
  id: string;
  name: string;
  email: string;
};

const AddBookForm = () => {
  const [formData, setFormData] = useState({ title: "", author: "", price: "", userId: "" });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setUsersLoading(false);
      })
      .catch(() => setUsersLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.author || !formData.price || !formData.userId) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    const payload = { ...formData, price: parseInt(formData.price, 10) };

    try {
      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      setFormData({ title: "", author: "", price: "", userId: "" });
    } catch (err) {
      alert("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="book-form">
        <h2 className="form-title">Add a Book</h2>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="form-input" />
        <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="form-input" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="form-input" />
        <select name="userId" value={formData.userId} onChange={handleChange} disabled={usersLoading} className="form-input">
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.id})
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading || usersLoading} className="submit-button">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;

import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">📚 Book Manager</h1>
      <div className="nav-links">
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/add-book">Add Book</Link>
      </div>
    </nav>
  );
};

export default Navbar;

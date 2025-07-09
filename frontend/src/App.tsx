import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddBookForm from "./AddBookForm";
import SignupForm from "./signup";
import LoginForm from "./Login";
import Navbar from "./Navbar"; // ✅ import

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Add Navbar here */}
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/add-book" element={<AddBookForm />} />
      </Routes>
    </Router>
  );
}

export default App;

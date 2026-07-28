import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Courses from "./pages/Courses.jsx";
import Attendance from "./pages/Attendance.jsx";
import Results from "./pages/Results.jsx";
import Fees from "./pages/Fees.jsx";
import Library from "./pages/Library.jsx";
import Notices from "./pages/Notices.jsx";
import Settings from "./pages/Settings.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/results" element={<Results />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/library" element={<Library />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
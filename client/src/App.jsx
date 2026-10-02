import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/JobDetails/JobDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MyApplications from "./pages/MyApplications/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard/RecruiterDashboard";
import RecruiterCreateJob from "./pages/RecruiterCreateJob/RecruiterCreateJob";
import RecruiterApplicants from "./pages/RecruiterApplicants/RecruiterApplicants";
import JobseekerDashboard from "./pages/JobseekerDashboard/JobseekerDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<JobseekerDashboard />} />
        
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/my-applications" element={<MyApplications />} />

        </Route>

        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />} >
        
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

        <Route path="/recruiter/jobs/create" element={<RecruiterCreateJob />} />

        <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterApplicants />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;

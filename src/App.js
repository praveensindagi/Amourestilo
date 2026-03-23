import './App.css';
import BookAppointment from './Components/BookAppointment.jsx';
import Careers from './Components/Careers.jsx';
import Footer from './Components/Footer.jsx';
import ResponsiveLayout from './Components/ResponsiveLayout.jsx';
import SkinAssessment from './Components/SkinAssessment.jsx';
import LookGallery from './Components/LookGallery.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>

      <ResponsiveLayout />

      <Routes>
        <Route path="/" element={<LookGallery />} />

        <Route path="/careers" element={<Careers />} />
        <Route path="/SkinAssessment" element={<SkinAssessment />} />

        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>

      <Footer />

    </Router>
  );
}

export default App;
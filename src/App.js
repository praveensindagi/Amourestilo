import './App.css';
import ResponsiveLayout from './Components/ResponsiveLayout.jsx';
import AmourEstiloAbout from './Components/AmourEstiloAbout.jsx';
import AmourAppointmentBooking from './Components/Amourappointmentbooking';
import Amourestilohomepage from './Components/Amourestilohomepage';
import Amourestilocareers from './Components/Amourestilocareers';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HouseOfAmourEstilo from './Components/HouseOfAmourEstilo';

function App() {
  return (
    <Router>

      <ResponsiveLayout />

      <Routes>
        <Route path="/" element={<Amourestilohomepage />} />
        <Route path="/AmourEstiloAbout" element={<AmourEstiloAbout />} />
        <Route path="/HouseOfAmourEstilo" element={< HouseOfAmourEstilo/>} />
        <Route path="/AmourAppointmentBooking" element={<AmourAppointmentBooking />} />
        <Route path="/Amourestilocareers" element={<Amourestilocareers />} />


      </Routes>
    </Router>
  );
}

export default App;

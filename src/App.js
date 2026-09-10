import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ResponsiveLayout from "./Components/ResponsiveLayout.jsx";
import AmourEstiloAbout from "./Components/AmourEstiloAbout.jsx";
import AmourAppointmentBooking from "./Components/Amourappointmentbooking.jsx";
import Amourestilohomepage from "./Components/Amourestilohomepage.jsx";
import Amourestilocareers from "./Components/Amourestilocareers.jsx";
import HouseOfAmourEstilo from "./Components/HouseOfAmourEstilo.jsx";
import SkinColorTheory from "./Components/SkinColorTheory.jsx";
import Amourestiloexperience from "./Components/Amourestiloexperience.jsx";
import AmourEstiloPrive from "./Components/AmourEstiloPrive.jsx";


function App() {
  return (
    <BrowserRouter>
      <ResponsiveLayout/>

      <Routes>
        <Route path="/" element={<Amourestilohomepage />} />

        <Route
          path="/AmourEstiloAbout"
          element={<AmourEstiloAbout />}
        />

        <Route
          path="/HouseOfAmourEstilo"
          element={<HouseOfAmourEstilo />}
        />

        <Route
          path="/AmourAppointmentBooking"
          element={<AmourAppointmentBooking />}
        />

        <Route
          path="/Amourestilocareers"
          element={<Amourestilocareers />}
        />

        <Route
          path="/SkinColorTheory"
          element={<SkinColorTheory />}
        />

        <Route
          path="/AmourEstiloPrive"
          element={<AmourEstiloPrive />}
        />

        <Route
          path="/Amourestiloexperience"
          element={<Amourestiloexperience />}
        />

     
        

        {/* 404 */}
        <Route
          path="*"
          element={<h1>404 - Page Not Found</h1>}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
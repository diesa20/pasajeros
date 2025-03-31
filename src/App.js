import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registro from "./Registro"; // El formulario de registro
import Login from "./Login"; // El formulario de login
import Pasajeros from "./Pasajeros"; // Página de la lista de pasajeros

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Página de Login */}
        <Route path="/registro" element={<Registro />} /> {/* Página de Registro */}
        <Route path="/pasajeros" element={<Pasajeros />} /> {/* Página de Pasajeros */}
      </Routes>
    </Router>
  );
}

export default App;

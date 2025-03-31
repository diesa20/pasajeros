import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerramos sesión
      alert("Has cerrado sesión con éxito.");
      navigate("/"); // Redirigimos a la página de login
    } catch (err) {
      console.error("Error al cerrar sesión: ", err.message);
    }
  };

  return (
    <div>
      <h2>Bienvenido a la página principal</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Home;

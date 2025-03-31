import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { db, auth } from "./firebase"; 
import { useNavigate } from "react-router-dom"; 
import { signOut } from "firebase/auth";
import Papa from "papaparse";  
import './styles.css';  // Estilos agregados

function Pasajeros() {
  const [pasajeros, setPasajeros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [hotel, setHotel] = useState("");
  const [tipoHabitacion, setTipoHabitacion] = useState("");  
  const [pasajeroSeleccionado, setPasajeroSeleccionado] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState(""); 
  const [busquedaHotel, setBusquedaHotel] = useState(""); 
  const [habitacionesContador, setHabitacionesContador] = useState({});
  const [anotacion, setAnotacion] = useState("");  // Estado para la anotación
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/"); 
    }
  }, [navigate]);

  useEffect(() => {
    const dbRef = ref(db, "pasajeros/");
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pasajerosList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        pasajerosList.sort((a, b) => a.hotel.localeCompare(b.hotel));
        setPasajeros(pasajerosList);
        updateHabitacionesContador(pasajerosList);
      } else {
        setPasajeros([]);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Has cerrado sesión con éxito.");
      navigate("/"); 
    } catch (err) {
      console.error("Error al cerrar sesión: ", err.message);
    }
  };

  const handleSavePasajero = async (e) => {
    e.preventDefault();
    if (nombre && hotel && tipoHabitacion) {
      if (pasajeroSeleccionado) {
        const pasajeroRef = ref(db, `pasajeros/${pasajeroSeleccionado.id}`);
        try {
          await set(pasajeroRef, { id: pasajeroSeleccionado.id, nombre, hotel, tipoHabitacion, anotacion });
          setPasajeroSeleccionado(null);
          setMostrarOpciones(false);
          setAnotacion("");  // Limpiar la anotación después de guardar
          setNombre(""); // Limpiar el nombre
          setHotel(""); // Limpiar el hotel
          setTipoHabitacion(""); // Limpiar el tipo de habitación
        } catch (error) {
          console.error("Error al actualizar pasajero: ", error);
          alert("Hubo un error al actualizar el pasajero.");
        }
      } else {
        const dbRef = ref(db, "pasajeros/");
        const newPasajeroRef = push(dbRef);
        try {
          await set(newPasajeroRef, { id: newPasajeroRef.key, nombre, hotel, tipoHabitacion, anotacion });
        } catch (error) {
          console.error("Error al agregar pasajero: ", error);
          alert("Hubo un error al agregar el pasajero.");
        }
      }
      setNombre("");
      setHotel("");
      setTipoHabitacion("");
      setAnotacion("");  // Limpiar la anotación
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const handleSelectPasajero = (pasajero) => {
    setPasajeroSeleccionado(pasajero);
    setNombre(pasajero.nombre);
    setHotel(pasajero.hotel);
    setTipoHabitacion(pasajero.tipoHabitacion || "");
    setAnotacion(pasajero.anotacion || "");  // Cargar la anotación si existe
    setMostrarOpciones(true);
  };

  const handleDeletePasajero = async () => {
    if (pasajeroSeleccionado) {
      const pasajeroRef = ref(db, `pasajeros/${pasajeroSeleccionado.id}`);
      try {
        await remove(pasajeroRef);
        alert("Pasajero eliminado con éxito.");
        setPasajeroSeleccionado(null);
        setMostrarOpciones(false);
        setNombre("");  // Limpiar el nombre
        setHotel("");  // Limpiar el hotel
        setTipoHabitacion("");  // Limpiar el tipo de habitación
        setAnotacion("");  // Limpiar la anotación
      } catch (error) {
        console.error("Error al eliminar pasajero: ", error);
        alert("Hubo un error al eliminar el pasajero.");
      }
    }
  };

  const handleCancelAction = () => {
    setPasajeroSeleccionado(null);
    setMostrarOpciones(false);
    setNombre("");  // Limpiar el nombre
    setHotel("");  // Limpiar el hotel
    setTipoHabitacion("");  // Limpiar el tipo de habitación
    setAnotacion("");  // Limpiar la anotación
  };

  const updateHabitacionesContador = (pasajerosList) => {
    const contador = {};
    pasajerosList.forEach((pasajero) => {
      const hotel = pasajero.hotel.toLowerCase(); // Convertir a minúsculas
      const tipoHabitacion = pasajero.tipoHabitacion;

      if (!contador[hotel]) {
        contador[hotel] = { simple: 0, doble: 0, triple: 0, cuadruple: 0 };
      }
      if (contador[hotel][tipoHabitacion] !== undefined) {
        contador[hotel][tipoHabitacion]++;
      }
    });
    setHabitacionesContador(contador);
  };

  const handleExport = () => {
    const dataToExport = pasajeros.map((pasajero) => ({
      Nombre: pasajero.nombre,
      Hotel: pasajero.hotel,
      TipoHabitacion: pasajero.tipoHabitacion,
    }));

    const csv = Papa.unparse(dataToExport);
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.target = "_blank";
    link.download = "pasajeros.csv";
    link.click();
  };

  const pasajerosFiltrados = pasajeros.filter((pasajero) =>
    pasajero.nombre.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    pasajero.hotel.toLowerCase().includes(busquedaHotel.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="title">Lista de Pasajeros (Ordenados por Hotel)</h2>
      <div className="search">
        <input type="text" value={busquedaNombre} onChange={(e) => setBusquedaNombre(e.target.value)} placeholder="Buscar pasajero por nombre" />
        <input type="text" value={busquedaHotel} onChange={(e) => setBusquedaHotel(e.target.value)} placeholder="Buscar pasajero por hotel" />
      </div>

      {/* Formulario para agregar o actualizar pasajero */}
      <form className="form" onSubmit={handleSavePasajero}>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de pasajero/s" required />
        <input type="text" value={hotel} onChange={(e) => setHotel(e.target.value)} placeholder="Hotel del pasajero" required />
        
        {/* Menu desplegable de tipos de habitación */}
        <select value={tipoHabitacion} onChange={(e) => setTipoHabitacion(e.target.value)} required>
          <option value="">Tipo de habitación</option>
          <option value="simple">Simple</option>
          <option value="doble">Doble</option>
          <option value="triple">Triple</option>
          <option value="cuadruple">Cuádruple</option>
        </select>

        {/* Campo para la anotación */}
        <textarea value={anotacion} onChange={(e) => setAnotacion(e.target.value)} placeholder="Anotación (opcional)" />

        {/* Botones de eliminar, actualizar y cancelar */}
        {pasajeroSeleccionado && (
          <div className="opciones">
            <button type="button" onClick={handleDeletePasajero}>Eliminar</button>
            <button type="submit">Actualizar</button>
            <button type="button" onClick={handleCancelAction}>Cancelar Acción</button>
          </div>
        )}

        <button type="submit" disabled={pasajeroSeleccionado}>Agregar</button>
      </form>

      <ul>
        {pasajerosFiltrados.map((pasajero) => (
          <li key={pasajero.id} onClick={() => handleSelectPasajero(pasajero)}>
            {pasajero.nombre} - {pasajero.hotel} ({pasajero.tipoHabitacion})
            {pasajero.anotacion && <span className="alerta">!</span>}
          </li>
        ))}
      </ul>

      <button className="export-btn" onClick={handleExport}>Exportar a CSV</button>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>

      {/* Contador de Habitaciones */}
      <div className="contador">
        <h3>Contador de Habitaciones</h3>
        {Object.keys(habitacionesContador).map((hotel) => (
          <div key={hotel} className="hotel-contador">
            <h4>{hotel.charAt(0).toUpperCase() + hotel.slice(1)}</h4>
            {Object.keys(habitacionesContador[hotel]).map((tipo) => (
              <p key={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}: {habitacionesContador[hotel][tipo]}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pasajeros;

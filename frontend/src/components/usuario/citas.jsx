import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usuario/citas.css"; // opcional: puedes crear este archivo y poner ahí tus estilos

function Citas() {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState("");
  const [doctor, setDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState([]);
  const [terms, setTerms] = useState(false);
  const [doctoresDisponibles, setDoctoresDisponibles] = useState([]);
  const [fechaMinima, setFechaMinima] = useState("");
  const [fechaMaxima, setFechaMaxima] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [horarios, setHorarios] = useState([]);


  // Fecha mínima = hoy
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFechaMinima(today);
  }, []);

  //Logica para obtener especialidades (si se obtiene de una API)
  useEffect(() => {
    fetch("http://localhost:8080/api/especialidad", {
      credentials: "include", // include the session cookie
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEspecialidades(data))
      .catch((error) => console.error("Error al cargar especialidades:", error));
  }, []);


  // Lógica para habilitar doctores al elegir especialidad
  useEffect(() => {
    if (especialidad) {
      // especialidad es el id seleccionado
      fetch(`http://localhost:8080/api/doctores/especialidad/${especialidad}`, {
        credentials: "include", // include the session cookie
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setDoctoresDisponibles(data)) // data será la lista de doctores
        .catch((error) => console.error("Error al cargar doctores:", error));
    } else {
      setDoctoresDisponibles([]);
      setDoctor("");
    }
  }, [especialidad]);

  // Lógica para fecha máxima (3 meses desde hoy)
  useEffect(() => {
    const today = new Date();

    // Minimum date: 2 days from today
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1);

    // Maximum date: 3 months from today
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);

    // Format to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    setFechaMinima(formatDate(minDate));
    setFechaMaxima(formatDate(maxDate));
  }, []);

  // Lógica para obtener horarios disponibles al seleccionar fecha y doctor
  useEffect(() => {
    if (fecha && doctor) {
      fetch(`http://localhost:8080/api/horarios/disponibles?fecha=${fecha}&doctorId=${doctor}`, {
        credentials: "include", // include the session cookie
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener horarios');
          return res.json();
        })
        .then((data) => {
          setHorarios(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [fecha, doctor]);


  // Valida si todos los campos están completos
  const formularioValido =
    especialidad && doctor && fecha && hora && terms;
  const navigate = useNavigate();


  // Función para enviar la cita al backend
  const enviarCitaAPI = async (formData) => {
    console.log("Sending to API:", formData);
console.log("JSON:", JSON.stringify(formData));

    const response = await fetch("http://localhost:8080/Cita/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // include the session cookie
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Error al agendar la cita");
    }

    return await response.json();
  };


  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Datos a enviar
    const formData = {
      horarioId: horarioSeleccionado,         // assuming hora is the ID of the selected time slot
      doctorId: doctor,        // assuming doctor is the ID
      fechaAgendada: fecha     // should be in "YYYY-MM-DD" format
    };

    try {
      await enviarCitaAPI(formData);
      alert(`Cita agendada exitosamente!\n\nDoctor ID: ${doctor}\nFecha: ${fecha}\nHora ID: ${hora}`);
      setEspecialidad("");
      setDoctor("");
      setFecha("");
      setHora("");
      setTerms(false);
    } catch (err) {
      alert("No se pudo guardar la cita: " + err.message);
    }
  };
  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="navbar-container">
          <a className="navbar-logo" href="#">
            🏥 Hospital
          </a>
          <div className="navbar-menu">
            <a
              href="#"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault(); navigate("/usuario/perfil");
              }}
            >
              Mi Perfil
            </a>
            <a
              href="#"
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/usuario/mis-citas");
              }}
            >
              Mis Citas
            </a>
            <a
              href="#"
              className="navbar-link logout"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("¿Cerrar sesión?")) {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("userEmail");
                  localStorage.removeItem("token");
                  alert("Sesión cerrada exitosamente");
                  window.location.href = "/login";
                }
              }}
            >
              Cerrar Sesión
            </a>
          </div>
        </div>
      </nav>

      {/* --- HEADER --- */}
      <div className="header-image">
        <h1>Citas Médicas</h1>
        <p>Agenda tu cita!</p>
      </div>

      {/* --- FORMULARIO --- */}
      <div className="container">
        <p className="form-instruction">
          Selecciona la opción del detalle de la cita en cada campo
        </p>

        <form id="appointmentForm" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Especialidad</label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                required
              >
                <option value="">Selecciona una opción</option>
                {especialidades.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.especialidad}
                  </option>
                ))}
              </select>

            </div>

            <div className="form-group">
              <label>Doctor</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
              >
                <option value="">Selecciona un doctor</option>
                {doctoresDisponibles.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Selecciona el día de la cita (sujeto a disponibilidad)</label>
            <input
              type="date"
              min={fechaMinima}
              max={fechaMaxima}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Horario disponible</label>
            <select
              value={horarioSeleccionado}
              onChange={(e) => setHorarioSeleccionado(e.target.value)}
              required
            >
              <option value="">Selecciona un horario</option>
              {horarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.horario}
                </option>
              ))}
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <label htmlFor="termsCheckbox">
              Acepto los{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Aquí se mostrarían los Términos y Condiciones");
                }}
              >
                términos y condiciones
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!formularioValido}
          >
            Agendar Cita
          </button>
        </form>
      </div>
    </>
  );
}

export default Citas;

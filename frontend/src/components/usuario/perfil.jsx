import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usuario/perfil.css";

function Perfil() {
  const navigate = useNavigate();
  
  // Estados para información personal
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    direccion: ""
  });

  // Estados para información médica
  const [datosMedicos, setDatosMedicos] = useState({
    tipoSangre: "",
    altura: "",
    alergias: "",
    enfermedadesCronicas: ""
  });

  const [editandoPersonal, setEditandoPersonal] = useState(false);
  const [editandoMedico, setEditandoMedico] = useState(false);
  const [datosOriginalesPersonal, setDatosOriginalesPersonal] = useState({});
  const [datosOriginalesMedico, setDatosOriginalesMedico] = useState({});

  // Verificar sesión y cargar datos
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      alert("Debes iniciar sesión para acceder a esta página");
      navigate("/login");
      return;
    }

    cargarDatosUsuario();
  }, [navigate]);

  const cargarDatosUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/perfil", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }

      const data = await response.json();
      setDatosPersonales({
        nombre: data.nombre || "",
        apellidos: data.apellidos || "",
        email: data.email || localStorage.getItem("userEmail") || "",
        fechaNacimiento: data.fechaNacimiento || "",
        genero: data.genero || "",
        telefono: data.telefono || "",
        direccion: data.direccion || ""
      });

      setDatosMedicos({
        tipoSangre: data.tipoSangre || "",
        altura: data.altura || "",
        alergias: data.alergias || "",
        enfermedadesCronicas: data.enfermedadesCronicas || ""
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      
      // Datos de ejemplo para pruebas
      const userEmail = localStorage.getItem("userEmail");
      setDatosPersonales({
        nombre: "Juan",
        apellidos: "Pérez García",
        email: userEmail || "juan.perez@ejemplo.com",
        fechaNacimiento: "1990-05-15",
        genero: "masculino",
        telefono: "(555) 123-4567",
        direccion: "Av. Principal 123, Col. Centro"
      });

      setDatosMedicos({
        tipoSangre: "O+",
        altura: "175",
        alergias: "Penicilina, Polen",
        enfermedadesCronicas: "Ninguna"
      });
    }
  };

  // Handlers para información personal
  const handleEditPersonal = () => {
    setDatosOriginalesPersonal({ ...datosPersonales });
    setEditandoPersonal(true);
  };

  const handleCancelPersonal = () => {
    setDatosPersonales(datosOriginalesPersonal);
    setEditandoPersonal(false);
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/perfil/personal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(datosPersonales)
      });

      if (!response.ok) {
        throw new Error("Error al guardar los datos");
      }

      alert("Información personal actualizada exitosamente");
      setEditandoPersonal(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al actualizar la información");
    }
  };

  const handleChangePersonal = (e) => {
    const { name, value } = e.target;
    setDatosPersonales(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handlers para información médica
  const handleEditMedico = () => {
    setDatosOriginalesMedico({ ...datosMedicos });
    setEditandoMedico(true);
  };

  const handleCancelMedico = () => {
    setDatosMedicos(datosOriginalesMedico);
    setEditandoMedico(false);
  };

  const handleSaveMedico = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/perfil/medico", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(datosMedicos)
      });

      if (!response.ok) {
        throw new Error("Error al guardar los datos");
      }

      alert("Información médica actualizada exitosamente");
      setEditandoMedico(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al actualizar la información");
    }
  };

  const handleChangeMedico = (e) => {
    const { name, value } = e.target;
    setDatosMedicos(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">🏥 Hospital</div>
          <div className="navbar-menu">
            <a href="#" className="navbar-link active">Mi Perfil</a>
            <a href="#" className="navbar-link" onClick={(e) => { e.preventDefault(); navigate("/mis-citas"); }}>
              Mis Citas
            </a>
            <a href="#" className="navbar-link" onClick={(e) => { e.preventDefault(); navigate("/citas"); }}>
              Agendar Cita
            </a>
            <a
              href="#"
              className="navbar-link logout"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("¿Cerrar sesión?")) {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("userEmail");
                  localStorage.removeItem("userType");
                  localStorage.removeItem("token");
                  navigate("/login");
                }
              }}
            >
              Cerrar Sesión
            </a>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Encabezado del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h1>{datosPersonales.nombre} {datosPersonales.apellidos}</h1>
            <p>{datosPersonales.email}</p>
          </div>
        </div>

        {/* Información Personal */}
        <div className="profile-section">
          <h2 className="section-title">Información Personal</h2>

          <div className="info-box">
            <p>💡 Haz clic en "Editar" para modificar tu información</p>
          </div>

          <form onSubmit={handleSavePersonal}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre(s)</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={datosPersonales.nombre}
                  onChange={handleChangePersonal}
                  disabled={!editandoPersonal}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={datosPersonales.apellidos}
                  onChange={handleChangePersonal}
                  disabled={!editandoPersonal}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={datosPersonales.fechaNacimiento}
                  onChange={handleChangePersonal}
                  disabled={!editandoPersonal}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="genero">Género</label>
                <select
                  id="genero"
                  name="genero"
                  value={datosPersonales.genero}
                  onChange={handleChangePersonal}
                  disabled={!editandoPersonal}
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={datosPersonales.telefono}
                  onChange={handleChangePersonal}
                  placeholder="(000) 000-0000"
                  disabled={!editandoPersonal}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={datosPersonales.email}
                  onChange={handleChangePersonal}
                  disabled={!editandoPersonal}
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={datosPersonales.direccion}
                onChange={handleChangePersonal}
                placeholder="Calle, Número, Colonia"
                disabled={!editandoPersonal}
              />
            </div>

            <div className="button-group">
              {!editandoPersonal ? (
                <button type="button" className="btn btn-primary" onClick={handleEditPersonal}>
                  Editar
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelPersonal}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Información Médica */}
        <div className="profile-section">
          <h2 className="section-title">Información Médica</h2>

          <form onSubmit={handleSaveMedico}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoSangre">Tipo de Sangre</label>
                <select
                  id="tipoSangre"
                  name="tipoSangre"
                  value={datosMedicos.tipoSangre}
                  onChange={handleChangeMedico}
                  disabled={!editandoMedico}
                >
                  <option value="">Selecciona</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="altura">Altura (cm)</label>
                <input
                  type="text"
                  id="altura"
                  name="altura"
                  value={datosMedicos.altura}
                  onChange={handleChangeMedico}
                  placeholder="170"
                  disabled={!editandoMedico}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="alergias">Alergias</label>
              <textarea
                id="alergias"
                name="alergias"
                value={datosMedicos.alergias}
                onChange={handleChangeMedico}
                placeholder="Describe tus alergias (medicamentos, alimentos, etc.)"
                disabled={!editandoMedico}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="enfermedadesCronicas">Enfermedades Crónicas</label>
              <textarea
                id="enfermedadesCronicas"
                name="enfermedadesCronicas"
                value={datosMedicos.enfermedadesCronicas}
                onChange={handleChangeMedico}
                placeholder="Diabetes, hipertensión, asma, etc."
                disabled={!editandoMedico}
              />
            </div>

            <div className="button-group">
              {!editandoMedico ? (
                <button type="button" className="btn btn-primary" onClick={handleEditMedico}>
                  Editar
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelMedico}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Perfil;

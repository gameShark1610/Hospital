import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";

function Registro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
    confirmPassword: "",
    tipoUsuario: "",
    nombre: "",
    paterno: "",
    materno: "",
    fechaNac: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fecha máxima (18 años atrás desde hoy)
  const getFechaMaxima = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    // Validación de edad mínima
    const fechaNacimiento = new Date(formData.fechaNac);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    if (edad < 18) {
      setErrorMessage("Debes ser mayor de 18 años");
      return;
    }

    // Datos a enviar (sin confirmPassword)
    const dataToSend = {
      correo: formData.correo,
      password: formData.password,
      tipoUsuario: formData.tipoUsuario,
      nombre: formData.nombre,
      paterno: formData.paterno,
      materno: formData.materno,
      fechaNac: formData.fechaNac
    };

    try {
      const response = await fetch("http://localhost:8080/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar usuario");
      }

      const data = await response.json();
      setSuccessMessage("¡Registro exitoso! Redirigiendo al login...");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setErrorMessage(error.message || "Error al registrar. Intenta de nuevo.");
      console.error("Error en registro:", error);
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-header">
          <div className="logo">🏥</div>
          <h1>Crear Cuenta</h1>
          <p>Completa tus datos para registrarte</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tipoUsuario">Tipo de Usuario</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tipo de usuario</option>
              <option value="paciente">Paciente</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre(s)</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="paterno">Apellido Paterno</label>
              <input
                type="text"
                id="paterno"
                name="paterno"
                value={formData.paterno}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="materno">Apellido Materno</label>
            <input
              type="text"
              id="materno"
              name="materno"
              value={formData.materno}
              onChange={handleChange}
              placeholder="García"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaNac">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNac"
              name="fechaNac"
              value={formData.fechaNac}
              onChange={handleChange}
              max={getFechaMaxima()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="registro-btn">
            Registrarse
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <div className="login-link">
          ¿Ya tienes cuenta?{" "}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}>
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default Registro;

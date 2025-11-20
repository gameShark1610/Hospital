import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    correo: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/citas");
    }
  }, [navigate]);

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

    // Validación básica
    if (!formData.correo || !formData.password) {
      setErrorMessage("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          usuario: formData.correo,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenciales inválidas");
      }

      
      setSuccessMessage("¡Inicio de sesión exitoso!");
      
      // Guardar información en localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.correo);
      navigate("/citas");
 

      // Redirigir según tipo de usuario
      /*
      setTimeout(() => {
        if (data.tipoUsuario === "doctor") {
          navigate("/dashboard-doctor");
        } else {
          navigate("/citas");
        }
      }, 1000);*/

    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">🏥</div>
          <h1>Bienvenido</h1>
          <p>Inicia sesión para continuar</p>
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
            <label htmlFor="correo">User</label>
            <input
              type="text"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="User"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Recordarme</label>
            </div>
            <a 
              href="#" 
              className="forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Se enviará un correo para recuperar tu contraseña");
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <div className="register-link">
          ¿No tienes cuenta?{" "}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            navigate("/registro");
          }}>
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
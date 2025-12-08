import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usuario/mis-citas.css";

function MisCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("all");

  // Verificar si el usuario está logueado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      alert("Debes iniciar sesión para acceder a esta página");
      navigate("/login");
      return;
    }

    cargarCitas();
  }, [navigate]);

  const cargarCitas = async () => {
    try {
      const response = await fetch("http://localhost:8080/Cita/mis-Citas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error al cargar las citas");
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data); // Debugging
      setCitas(data);
      setCitasFiltradas(data);
    } catch (error) {
      console.error("Error al cargar las citas:", error);

      // Datos de ejemplo para pruebas (eliminar cuando la API esté lista)
      const citasEjemplo = [
        {
          id: 1,
          especialidad: "Cardiología",
          doctor: "Dr. García Martínez",
          fecha: "2025-12-15",
          hora: "10:00",
          consultorio: "301-A",
          estado: "confirmed",
          precio: 150.0,
          pagado: true,
          fechaPago: "2025-12-01",
          notas: "Traer estudios previos de electrocardiograma"
        },
        {
          id: 2,
          especialidad: "Dermatología",
          doctor: "Dra. López Hernández",
          fecha: "2025-12-20",
          hora: "14:30",
          consultorio: "205-B",
          estado: "pending",
          precio: 150.0,
          pagado: false,
          notas: "Primera consulta"
        },
        {
          id: 3,
          especialidad: "Pediatría",
          doctor: "Dr. Rodríguez Pérez",
          fecha: "2025-10-15",
          hora: "09:00",
          consultorio: "102-C",
          estado: "completed",
          precio: 150.0,
          pagado: true,
          fechaPago: "2025-10-10",
          fechaCompletada: "2025-10-15"
        },
        {
          id: 4,
          especialidad: "Medicina General",
          doctor: "Dra. Martínez Sánchez",
          fecha: "2025-10-05",
          hora: "11:00",
          consultorio: "401-D",
          estado: "cancelled",
          precio: 150.0,
          pagado: false,
          fechaCancelacion: "2025-10-04",
          horaCancelacion: "15:30"
        }
      ];
      setCitas(citasEjemplo);
      setCitasFiltradas(citasEjemplo);
    }
  };


  const filtrarCitas = (filtro) => {
    setFiltroActivo(filtro);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let resultado = citas;

    if (filtro === "proximas") {
      resultado = citas.filter((cita) => {
        const fecha = new Date(cita.fecha);
        return fecha >= hoy && (cita.estado === "confirmed" || cita.estado === "pending");
      });
    } else if (filtro === "completadas") {
      resultado = citas.filter((cita) => cita.estado === "completed");
    } else if (filtro === "canceladas") {
      resultado = citas.filter((cita) => cita.estado === "cancelled");
    }

    setCitasFiltradas(resultado);
  };

  const irAPagar = (cita) => {
    navigate("/usuario/pagar", { state: { cita } });
  };

  const cancelarCita = async (citaId) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/Cita/cancelar/${citaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      alert("Cita cancelada exitosamente");
      cargarCitas(); // Recargar las citas
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      alert("Error al cancelar la cita");
    }
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      confirmed: "Confirmada",
      pending: "Pendiente",
      cancelled: "Cancelada",
      completed: "Completada",
      "to cancel": "Por cancelar"
    };
    return textos[estado] || estado;
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return {
      dia: fecha.getDate(),
      mes: fecha.toLocaleDateString("es-MX", { month: "short" }),
      anio: fecha.getFullYear(),
      completa: fecha.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short"
      })
    };
  };

  const renderAccionesCita = (cita) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCita = new Date(cita.fecha);
    const esProxima = fechaCita >= hoy;

    // No mostrar acciones para citas completadas o canceladas o por cancelar
    if (cita.estado === "completed" || cita.estado === "cancelled" || cita.estado === "to cancel") {
      return null;
    }

    // Si está pendiente de pago, mostrar botón de pagar y cancelar
    if (cita.estado === "pending" && !cita.pagado) {
      return (
        <>
          <button className="btn btn-pay" onClick={() => irAPagar(cita)}>
            Pagar ${cita.precio.toFixed(2)}
          </button>
          <button className="btn btn-cancel" onClick={() => cancelarCita(cita.id)}>
            Cancelar
          </button>
        </>
      );
    }

    // Si está confirmada y es próxima, solo mostrar cancelar
    if (cita.estado === "confirmed" && esProxima) {
      return (
        <button className="btn btn-cancel" onClick={() => cancelarCita(cita.id)}>
          Cancelar
        </button>
      );
    }

    return null;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
          <div className="navbar-menu">
            <a href="/doctor/principalDoctor" className="navbar-link">Principal</a>
            <a href="/doctor/citas" className="navbar-link">Citas por atender</a>
            <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
            <a href="/doctor/citas-agendar" className="navbar-link">
              Agendar Cita (Paciente)
            </a>
            <a href="/doctor/mis-citas" className="navbar-link active">Mis Citas</a>
            <a href="/doctor/perfil" className="navbar-link">Mi Perfil</a>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              if (window.confirm("¿Cerrar sesión?")) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("token");
                alert("Sesión cerrada exitosamente");
                window.location.href = "/login";
              }
            }} className="navbar-link logout">
              Cerrar Sesión
            </a>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="container">
        <div className="page-header">
          <h1>Mis Citas</h1>
          <p>Gestiona y consulta todas tus citas médicas</p>
        </div>

        {/* Filtros */}
        <div className="filter-tabs">
          <button
            className={`tab-btn ${filtroActivo === "all" ? "active" : ""}`}
            onClick={() => filtrarCitas("all")}
          >
            Todas
          </button>
          <button
            className={`tab-btn ${filtroActivo === "proximas" ? "active" : ""}`}
            onClick={() => filtrarCitas("proximas")}
          >
            Próximas
          </button>
          <button
            className={`tab-btn ${filtroActivo === "completadas" ? "active" : ""}`}
            onClick={() => filtrarCitas("completadas")}
          >
            Completadas
          </button>
          <button
            className={`tab-btn ${filtroActivo === "canceladas" ? "active" : ""}`}
            onClick={() => filtrarCitas("canceladas")}
          >
            Canceladas
          </button>
        </div>

        {/* Grid de citas */}
        <div className="appointments-grid">
          {citasFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No hay citas</h3>
              <p>No tienes citas agendadas en esta categoría</p>
              <button className="btn btn-pay" onClick={() => navigate("/citas")}>
                Agendar una cita
              </button>
            </div>
          ) : (
            citasFiltradas.map((cita) => {
              const fecha = formatearFecha(cita.fecha);
              return (
                <div key={cita.id} className="appointment-card">
                  <div className="appointment-date">
                    <div className="day">{fecha.dia}</div>
                    <div className="month">{fecha.mes}</div>
                    <div className="year">{fecha.anio}</div>
                  </div>

                  <div className="appointment-info">
                    <span className={`status-badge status-${cita.estado}`}>
                      {getEstadoTexto(cita.estado)}
                    </span>
                    <div className="appointment-specialty">{cita.especialidad}</div>
                    <div className="appointment-doctor">{cita.doctor}</div>

                    <div className="appointment-details-row">
                      <div className="detail-item">
                        <span className="detail-item-icon">🕐</span>
                        <span>{cita.hora} hrs</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-item-icon">🏥</span>
                        <span>Consultorio {cita.consultorio}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-item-icon">📅</span>
                        <span>{fecha.completa}</span>
                      </div>
                    </div>

                    <div className="appointment-extra-info">
                      <div className="extra-info-item">
                        <span className="extra-info-label">Precio:</span>
                        <span className="extra-info-value price">
                          ${cita.precio.toFixed(2)}
                        </span>
                      </div>
                      <div className="extra-info-item">
                        <span className="extra-info-label">Pago:</span>
                        <span className={`extra-info-value ${cita.pagado ? "paid" : "unpaid"}`}>
                          {cita.pagado ? "✓ Pagado" : "⚠ Pendiente"}
                        </span>
                      </div>
                      {cita.pagado && cita.fechaPago && (
                        <div className="extra-info-item">
                          <span className="extra-info-label">Fecha de pago:</span>
                          <span className="extra-info-value">
                            {new Date(cita.fechaPago).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      )}
                    </div>

                    {cita.notas && (
                      <div className="appointment-notes">
                        <span className="notes-icon">📌</span>
                        <strong>Notas:</strong> {cita.notas}
                      </div>
                    )}

                    {cita.estado === "cancelled" && (
                      <div className="cancellation-info">
                        <strong>✕ Cancelada:</strong>{" "}
                        {new Date(cita.fechaCancelacion).toLocaleDateString("es-MX")}
                        {cita.horaCancelacion && ` a las ${cita.horaCancelacion} hrs`}
                      </div>
                    )}

                    {cita.estado === "completed" && (
                      <div className="completed-info">
                        <strong>✓ Completada:</strong>{" "}
                        {new Date(cita.fechaCompletada).toLocaleDateString("es-MX")}
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">{renderAccionesCita(cita)}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default MisCitas;

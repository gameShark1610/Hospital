import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/doctor/principalDoctor.css';

const DashboardDoctor = () => {
    const navigate = useNavigate();

    // Datos de ejemplo - estos vendrían del backend
    const stats = {
        citasHoy: 8,
        citasPendientes: 3,
        pacientesAtendidos: 127,
        proximaCita: '10:00'
    };

    const citasHoy = [
        {
            id: 1,
            hora: '10:00',
            periodo: 'AM',
            paciente: 'Juan Pérez García',
            tipo: 'Consulta General',
            consultorio: '301-A'
        },
        {
            id: 2,
            hora: '11:30',
            periodo: 'AM',
            paciente: 'María López Hernández',
            tipo: 'Control de Diabetes',
            consultorio: '301-A'
        },
        {
            id: 3,
            hora: '14:00',
            periodo: 'PM',
            paciente: 'Carlos Rodríguez Pérez',
            tipo: 'Revisión de Presión',
            consultorio: '301-A'
        }
    ];

    const handleAtender = (citaId) => {
        console.log('Atender cita:', citaId);
        // Aquí irá la lógica para atender la cita
    };

    const handleVerHistorial = (citaId) => {
        console.log('Ver historial de cita:', citaId);
        // Aquí irá la lógica para ver el historial
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="#" className="navbar-link active">Dashboard</a>
                        <a href="/doctor/citas" className="navbar-link">Mis Citas</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
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

            <div className="container">
                <div className="welcome-section">
                    <h1>👋 Bienvenido, Dr. García Martínez</h1>
                    <p>Miércoles, 4 de Diciembre de 2025</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Citas Hoy</h3>
                        <div className="number">{stats.citasHoy}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Citas Pendientes</h3>
                        <div className="number">{stats.citasPendientes}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Pacientes Atendidos (mes)</h3>
                        <div className="number">{stats.pacientesAtendidos}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Próxima Cita</h3>
                        <div className="number">{stats.proximaCita}</div>
                    </div>
                </div>

                <div className="citas-hoy">
                    <h2>📅 Citas de Hoy</h2>

                    {citasHoy.length > 0 ? (
                        citasHoy.map((cita) => (
                            <div key={cita.id} className="cita-item">
                                <div className="cita-hora">
                                    <div>{cita.hora}</div>
                                    <div style={{fontSize: '0.8rem'}}>{cita.periodo}</div>
                                </div>
                                <div className="cita-info">
                                    <h3>{cita.paciente}</h3>
                                    <p>{cita.tipo} - Consultorio {cita.consultorio}</p>
                                </div>
                                <div className="cita-actions">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleAtender(cita.id)}
                                    >
                                        Atender
                                    </button>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleVerHistorial(cita.id)}
                                    >
                                        Ver Historial
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📅</div>
                            <p>No hay citas programadas para hoy</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardDoctor;
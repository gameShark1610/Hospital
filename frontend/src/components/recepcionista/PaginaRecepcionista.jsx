import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/PaginaRecepcionista.css';

const PanelRecepcionista = () => {
    const navigate = useNavigate();

    // Estadísticas del día - estos datos vendrían del backend
    const estadisticas = {
        citasHoy: 24,
        pendientes: 8,
        cancelaciones: 3,
        pacientesActivos: 156
    };

    // Tarjetas de funciones administrativas
    const funciones = [
        {
            id: 'usuarios',
            icono: '👥',
            titulo: 'Gestión de Usuarios',
            descripcion: 'Dar de alta y baja a doctores, pacientes y recepcionistas',
            ruta: '/recepcionista/gestionarUsuarios',
            clase: 'usuarios'
        },
        {
            id: 'citas',
            icono: '📅',
            titulo: 'Consultar y Administrar Citas',
            descripcion: 'Ver citas por médico, atendidas y pendientes',
            ruta: '/consultar-citas-recepcionista',
            clase: 'citas'
        },
        {
            id: 'consultorios',
            icono: '🏢',
            titulo: 'Consultorios y Especialidades',
            descripcion: 'Registrar y gestionar consultorios y especialidades médicas',
            ruta: '/gestion-consultorios',
            clase: 'consultorios'
        },
        {
            id: 'servicios',
            icono: '💰',
            titulo: 'Servicios Extra y Tickets',
            descripcion: 'Venta de servicios, medicamentos y emisión de tickets',
            ruta: '/gestion-servicios',
            clase: 'servicios'
        },
        {
            id: 'recetas',
            icono: '💊',
            titulo: 'Recetas Emitidas',
            descripcion: 'Consultar recetas por médico con detalles completos',
            ruta: '/consultar-recetas',
            clase: 'recetas'
        },
        {
            id: 'inventario',
            icono: '📦',
            titulo: 'Inventario de Medicamentos',
            descripcion: 'Actualizar stock y gestionar medicamentos disponibles',
            ruta: '/inventario-medicamentos',
            clase: 'inventario'
        },
        {
            id: 'bitacora',
            icono: '📋',
            titulo: 'Consultar Bitácora',
            descripcion: 'Ver todos los movimientos y registros del sistema',
            ruta: '/consultar-bitacora',
            clase: 'bitacora'
        },
        {
            id: 'cancelaciones',
            icono: '✅',
            titulo: 'Aprobar Cancelaciones',
            descripcion: 'Revisar y aprobar solicitudes de cancelación de citas',
            ruta: '/aprobar-cancelaciones',
            clase: 'cancelaciones'
        }
    ];

    const handleCardClick = (ruta) => {
        navigate(ruta);
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="#" className="navbar-link active">Principal</a>
                        <a href="/perfil-recepcionista" className="navbar-link">Mi Perfil</a>
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
                    <h1>👋 Bienvenida, Ana García</h1>
                    <p>Panel de Administración - Recepción Hospital</p>
                </div>

                {/* Estadísticas Rápidas */}
                <h2 className="section-title">📊 Estadísticas del Día</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.citasHoy}</div>
                        <div className="stat-label">Citas de Hoy</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.pendientes}</div>
                        <div className="stat-label">Pendientes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.cancelaciones}</div>
                        <div className="stat-label">Cancelaciones</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.pacientesActivos}</div>
                        <div className="stat-label">Pacientes Activos</div>
                    </div>
                </div>

                {/* Funciones Principales */}
                <h2 className="section-title">⚙️ Funciones Administrativas</h2>
                <div className="cards-grid">
                    {funciones.map((funcion) => (
                        <div 
                            key={funcion.id}
                            className={`function-card ${funcion.clase}`}
                            onClick={() => handleCardClick(funcion.ruta)}
                        >
                            <div className="card-icon">{funcion.icono}</div>
                            <div className="card-title">{funcion.titulo}</div>
                            <div className="card-description">{funcion.descripcion}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PanelRecepcionista;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/aprobar_cancelaciones.css';

const AprobarCancelaciones = () => {
    const navigate = useNavigate();
    const [filtroActivo, setFiltroActivo] = useState('todas');
    const [modalAprobar, setModalAprobar] = useState(false);
    const [modalRechazar, setModalRechazar] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [notasAprobacion, setNotasAprobacion] = useState('');
    const [motivoRechazo, setMotivoRechazo] = useState('');

    // Datos simulados - vendrían del backend
    const [solicitudes, setSolicitudes] = useState([
        {
            id: 1,
            idCita: 'C-12345',
            fechaCita: '5 Dic 2025, 10:00 AM',
            paciente: 'Juan Pérez García',
            medico: 'Dr. Carlos Ramírez',
            especialidad: 'Cardiología',
            fechaSolicitud: '2 Dic 2025, 3:45 PM',
            motivo: 'Paciente contactó para reagendar debido a una emergencia familiar. Se programará nueva cita para la próxima semana según disponibilidad del paciente.',
            estado: 'pendiente'
        },
        {
            id: 2,
            idCita: 'C-12344',
            fechaCita: '6 Dic 2025, 2:00 PM',
            paciente: 'María López Hernández',
            medico: 'Dra. María González',
            especialidad: 'Pediatría',
            fechaSolicitud: '2 Dic 2025, 1:20 PM',
            motivo: 'El médico tiene una capacitación obligatoria ese día. Se ha contactado al paciente para reagendar la cita.',
            estado: 'pendiente'
        },
        {
            id: 3,
            idCita: 'C-12343',
            fechaCita: '7 Dic 2025, 9:00 AM',
            paciente: 'Pedro Martínez Ruiz',
            medico: 'Dr. Pedro Martínez',
            especialidad: 'Traumatología',
            fechaSolicitud: '1 Dic 2025, 5:00 PM',
            motivo: 'Paciente no se presentó a la última cita y solicita cancelar esta debido a viaje fuera de la ciudad. Se reagendará a su regreso.',
            estado: 'pendiente'
        }
    ]);

    const estadisticas = {
        pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
        aprobadasMes: 45,
        rechazadasMes: 8
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleAbrirModalAprobar = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalAprobar(true);
    };

    const handleAbrirModalRechazar = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalRechazar(true);
    };

    const handleCerrarModales = () => {
        setModalAprobar(false);
        setModalRechazar(false);
        setSolicitudSeleccionada(null);
        setNotasAprobacion('');
        setMotivoRechazo('');
    };

    const handleConfirmarAprobacion = () => {
        console.log('Aprobar solicitud:', solicitudSeleccionada);
        console.log('Notas:', notasAprobacion);
        
        // Actualizar estado de la solicitud
        setSolicitudes(solicitudes.map(s => 
            s.id === solicitudSeleccionada.id 
                ? { ...s, estado: 'aprobada' }
                : s
        ));

        // Aquí iría la llamada al backend
        handleCerrarModales();
    };

    const handleConfirmarRechazo = () => {
        if (!motivoRechazo.trim()) {
            alert('Por favor ingrese el motivo del rechazo');
            return;
        }

        console.log('Rechazar solicitud:', solicitudSeleccionada);
        console.log('Motivo:', motivoRechazo);
        
        // Actualizar estado de la solicitud
        setSolicitudes(solicitudes.map(s => 
            s.id === solicitudSeleccionada.id 
                ? { ...s, estado: 'rechazada' }
                : s
        ));

        // Aquí iría la llamada al backend
        handleCerrarModales();
    };

    const handleVerDetalles = (solicitud) => {
        console.log('Ver detalles completos:', solicitud);
        // Aquí iría la navegación a página de detalles o abrir modal
    };

    const handleModalClick = (e) => {
        if (e.target.className === 'modal show') {
            handleCerrarModales();
        }
    };

    const solicitudesFiltradas = solicitudes.filter(s => {
        if (filtroActivo === 'todas') return true;
        if (filtroActivo === 'pendientes') return s.estado === 'pendiente';
        if (filtroActivo === 'procesadas') return s.estado !== 'pendiente';
        return true;
    });

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="/recepcionista/paginaRecepcionista" className="navbar-link">
                            ← Volver al Panel
                        </a>
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
                <div className="page-header">
                    <h1>✅ Aprobar Cancelaciones de Citas</h1>
                    <p>Revisa y aprueba las solicitudes de cancelación enviadas por los médicos</p>
                </div>

                {/* Estadísticas */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="number">{estadisticas.pendientes}</div>
                        <div className="label">Solicitudes Pendientes</div>
                    </div>
                    <div className="stat-card">
                        <div className="number">{estadisticas.aprobadasMes}</div>
                        <div className="label">Aprobadas Este Mes</div>
                    </div>
                    <div className="stat-card">
                        <div className="number">{estadisticas.rechazadasMes}</div>
                        <div className="label">Rechazadas Este Mes</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Solicitudes de Cancelación</h2>

                    <div className="alert alert-info">
                        <strong>ℹ️ Información:</strong> Revisa cuidadosamente cada solicitud antes de aprobar o rechazar. El médico recibirá una notificación de tu decisión.
                    </div>

                    {/* Filtros */}
                    <div className="filter-tabs">
                        <button 
                            className={`filter-tab ${filtroActivo === 'todas' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('todas')}
                        >
                            Todas las Solicitudes
                        </button>
                        <button 
                            className={`filter-tab ${filtroActivo === 'pendientes' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('pendientes')}
                        >
                            Pendientes
                        </button>
                        <button 
                            className={`filter-tab ${filtroActivo === 'procesadas' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('procesadas')}
                        >
                            Procesadas
                        </button>
                    </div>

                    {/* Lista de Solicitudes */}
                    {solicitudesFiltradas.length > 0 ? (
                        solicitudesFiltradas.map((solicitud) => (
                            <div key={solicitud.id} className="solicitud-card">
                                <div className="solicitud-header">
                                    <div className="solicitud-info">
                                        <h3>Solicitud de Cancelación - {solicitud.idCita}</h3>
                                        <span className="badge badge-pendiente">
                                            {solicitud.estado === 'pendiente' ? 'Pendiente' : 
                                             solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                                        </span>
                                    </div>
                                </div>

                                <div className="details-grid">
                                    <div className="detail-item">
                                        <strong>ID Cita:</strong>
                                        <span>{solicitud.idCita}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Fecha de Cita:</strong>
                                        <span>{solicitud.fechaCita}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Paciente:</strong>
                                        <span>{solicitud.paciente}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Médico Solicitante:</strong>
                                        <span>{solicitud.medico}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Especialidad:</strong>
                                        <span>{solicitud.especialidad}</span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Fecha de Solicitud:</strong>
                                        <span>{solicitud.fechaSolicitud}</span>
                                    </div>
                                </div>

                                <div className="motivo-box">
                                    <h4>Motivo de Cancelación:</h4>
                                    <p>{solicitud.motivo}</p>
                                </div>

                                {solicitud.estado === 'pendiente' && (
                                    <div className="action-buttons">
                                        <button 
                                            className="btn btn-approve"
                                            onClick={() => handleAbrirModalAprobar(solicitud)}
                                        >
                                            ✓ Aprobar Cancelación
                                        </button>
                                        <button 
                                            className="btn btn-reject"
                                            onClick={() => handleAbrirModalRechazar(solicitud)}
                                        >
                                            ✕ Rechazar Solicitud
                                        </button>
                                        <button 
                                            className="btn btn-view"
                                            onClick={() => handleVerDetalles(solicitud)}
                                        >
                                            👁️ Ver Detalles Completos
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-solicitudes">
                            <div className="no-solicitudes-icon">📋</div>
                            <h3>No hay solicitudes</h3>
                            <p>No hay solicitudes de cancelación con el filtro seleccionado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Aprobar */}
            {modalAprobar && solicitudSeleccionada && (
                <div 
                    className={`modal ${modalAprobar ? 'show' : ''}`}
                    onClick={handleModalClick}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>✓ Aprobar Cancelación</h2>
                            <span className="close" onClick={handleCerrarModales}>&times;</span>
                        </div>

                        <div className="form-group">
                            <label>Notas adicionales (opcional):</label>
                            <textarea 
                                value={notasAprobacion}
                                onChange={(e) => setNotasAprobacion(e.target.value)}
                                placeholder="Ingrese cualquier observación o nota sobre esta aprobación"
                            />
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-approve" onClick={handleConfirmarAprobacion}>
                                Confirmar Aprobación
                            </button>
                            <button className="btn btn-reject" onClick={handleCerrarModales}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Rechazar */}
            {modalRechazar && solicitudSeleccionada && (
                <div 
                    className={`modal ${modalRechazar ? 'show' : ''}`}
                    onClick={handleModalClick}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>✕ Rechazar Solicitud</h2>
                            <span className="close" onClick={handleCerrarModales}>&times;</span>
                        </div>

                        <div className="form-group">
                            <label>Motivo del rechazo <span className="required">*</span></label>
                            <textarea 
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                                placeholder="Especifique el motivo por el cual se rechaza esta solicitud de cancelación"
                                required
                            />
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-reject" onClick={handleConfirmarRechazo}>
                                Confirmar Rechazo
                            </button>
                            <button className="btn btn-approve" onClick={handleCerrarModales}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AprobarCancelaciones;
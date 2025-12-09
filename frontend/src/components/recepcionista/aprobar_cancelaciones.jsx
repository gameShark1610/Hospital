import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/aprobar_cancelaciones.css';

const AprobarCancelaciones = () => {
    const navigate = useNavigate();
    const [filtroActivo, setFiltroActivo] = useState('poraprobar'); // 'poraprobar' or 'canceladas'
    const [modalAprobar, setModalAprobar] = useState(false);
    const [modalRechazar, setModalRechazar] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [notasAprobacion, setNotasAprobacion] = useState('');
    const [motivoRechazo, setMotivoRechazo] = useState('');

    // State for data from backend
    const [solicitudes, setSolicitudes] = useState([]);
    const [stats, setStats] = useState({ pendientes: 0, aprobadasMes: 0, rechazadasMes: 0 });

    const fetchSolicitudes = async () => {
        try {
            let url = '';
            if (filtroActivo === 'poraprobar') {
                url = 'http://localhost:8080/api/recepcionista/solicitudes-cancelacion';
            } else {
                url = 'http://localhost:8080/api/recepcionista/citas-canceladas';
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Data-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Data fetched:", data);
                // Map backend DTO to frontend structure
                const mappedData = data.map(cita => ({
                    id: cita.id,
                    idCita: `C-${cita.id}`, // Formatting ID
                    fechaCita: cita.fecha ? cita.fecha.split('T')[0] : 'N/A', // Simple format
                    paciente: cita.paciente || 'Desconocido',
                    medico: cita.doctor,
                    especialidad: cita.especialidad,
                    fechaSolicitud: 'N/A', // Backend doesn't send this yet, maybe add later
                    motivo: cita.notas,
                    estado: cita.estado // 'pendiente' or 'cancelada'
                }));
                setSolicitudes(mappedData);

                // Update stats locally based on fetched data count (simplified)
                if (filtroActivo === 'poraprobar') {
                    setStats(prev => ({ ...prev, pendientes: mappedData.length }));
                }
            } else {
                console.error("Failed to fetch data");
                setSolicitudes([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setSolicitudes([]);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, [filtroActivo]);

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.clear();
            navigate('/login');
        }
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

    const handleConfirmarAprobacion = async () => {
        if (!solicitudSeleccionada) return;

        try {
            const response = await fetch(`http://localhost:8080/api/recepcionista/aprobar-cancelacion/${solicitudSeleccionada.id}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Solicitud aprobada exitosamente");
                fetchSolicitudes(); // Refresh list
            } else {
                alert("Error al aprobar la solicitud");
            }
        } catch (error) {
            console.error("Error approving:", error);
            alert("Error de conexión");
        }
        handleCerrarModales();
    };

    const handleConfirmarRechazo = async () => {
        if (!solicitudSeleccionada) return;
        if (!motivoRechazo.trim()) {
            alert('Por favor ingrese el motivo del rechazo');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/recepcionista/rechazar-cancelacion/${solicitudSeleccionada.id}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Solicitud rechazada exitosamente");
                fetchSolicitudes(); // Refresh list
            } else {
                alert("Error al rechazar la solicitud");
            }
        } catch (error) {
            console.error("Error rejecting:", error);
            alert("Error de conexión");
        }
        handleCerrarModales();
    };

    const handleModalClick = (e) => {
        if (e.target.className.includes('modal show')) {
            handleCerrarModales();
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="/recepcionista/paginaRecepcionista" className="navbar-link">
                            ← Volver al Panel
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="navbar-link logout">
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

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="number">{stats.pendientes}</div>
                        <div className="label">Solicitudes Pendientes (Vista Actual)</div>
                    </div>
                    {/* Placeholder stats as backend aggregation isn't implemented yet */}
                    <div className="stat-card">
                        <div className="number">--</div>
                        <div className="label">Aprobadas Este Mes</div>
                    </div>
                    <div className="stat-card">
                        <div className="number">--</div>
                        <div className="label">Rechazadas Este Mes</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Solicitudes de Cancelación</h2>

                    <div className="alert alert-info">
                        <strong>ℹ️ Información:</strong> Revisa cuidadosamente cada solicitud antes de aprobar o rechazar.
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filtroActivo === 'canceladas' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('canceladas')}
                        >
                            Citas Canceladas
                        </button>
                        <button
                            className={`filter-tab ${filtroActivo === 'poraprobar' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('poraprobar')}
                        >
                            Por aprobar
                        </button>
                    </div>

                    {solicitudes.length > 0 ? (
                        solicitudes.map((solicitud) => (
                            <div key={solicitud.id} className="solicitud-card">
                                <div className="solicitud-header">
                                    <div className="solicitud-info">
                                        <h3>Solicitud de Cancelación - {solicitud.idCita}</h3>
                                        <span className={`badge badge-${solicitud.estado === 'pendiente' ? 'pendiente' : 'aprobada'}`}>
                                            {solicitud.estado === 'pendiente' ? 'Por Aprobar' : 'Cancelada'}
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
                                </div>

                                <div className="motivo-box">
                                    <h4>Nota / Motivo:</h4>
                                    <p>{solicitud.motivo || 'Sin nota disponible'}</p>
                                </div>

                                {filtroActivo === 'poraprobar' && (
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
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-solicitudes">
                            <div className="no-solicitudes-icon">📋</div>
                            <h3>No hay solicitudes</h3>
                            <p>No hay registros para este filtro.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            {modalAprobar && (
                <div className={`modal ${modalAprobar ? 'show' : ''}`} onClick={handleModalClick}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>✓ Aprobar Cancelación</h2>
                            <span className="close" onClick={handleCerrarModales}>&times;</span>
                        </div>
                        <div className="form-group">
                            <label>Confirmar aprobación de cancelación para cita {solicitudSeleccionada?.idCita}</label>
                        </div>
                        <div className="action-buttons">
                            <button className="btn btn-approve" onClick={handleConfirmarAprobacion}>Confirmar</button>
                            <button className="btn btn-reject" onClick={handleCerrarModales}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalRechazar && (
                <div className={`modal ${modalRechazar ? 'show' : ''}`} onClick={handleModalClick}>
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
                                placeholder="Especifique el motivo"
                                required
                            />
                        </div>
                        <div className="action-buttons">
                            <button className="btn btn-reject" onClick={handleConfirmarRechazo}>Confirmar Rechazo</button>
                            <button className="btn btn-approve" onClick={handleCerrarModales}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AprobarCancelaciones;
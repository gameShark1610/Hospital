import React, { useState } from 'react';
import '../../styles/doctor/citas.css';

const CitasDoctor = () => {
    const [activeTab, setActiveTab] = useState('todas');

    const citas = [
        {
            id: 1,
            paciente: 'Juan Pérez García',
            tipo: 'Consulta General',
            fecha: { dia: 4, mes: 'dic', año: 2025 },
            hora: '10:00 AM',
            consultorio: 'Consultorio 301-A',
            telefono: '(555) 123-4567',
            estado: 'pendiente'
        },
        {
            id: 2,
            paciente: 'María López Hernández',
            tipo: 'Control de Diabetes',
            fecha: { dia: 4, mes: 'dic', año: 2025 },
            hora: '11:30 AM',
            consultorio: 'Consultorio 301-A',
            telefono: '(555) 987-6543',
            estado: 'confirmada'
        },
        {
            id: 3,
            paciente: 'Carlos Rodríguez Pérez',
            tipo: 'Revisión de Presión',
            fecha: { dia: 3, mes: 'dic', año: 2025 },
            hora: '14:00 PM',
            consultorio: 'Consultorio 301-A',
            telefono: '(555) 456-7890',
            estado: 'completada'
        }
    ];

    const filteredCitas = citas.filter(cita => {
        if (activeTab === 'todas') return true;
        if (activeTab === 'hoy') return cita.fecha.dia === 4; // Simulación
        if (activeTab === 'pendientes') return cita.estado === 'pendiente' || cita.estado === 'confirmada';
        if (activeTab === 'completadas') return cita.estado === 'completada';
        return true;
    });

    const handleAtenderCita = (citaId) => {
        // Navegar a la página de atender cita
        window.location.href = `/atender-cita/${citaId}`;
    };

    const handleVerHistorial = (citaId) => {
        // Navegar al historial del paciente
        window.location.href = `/historial-pacientes`;
    };

    const handleCancelar = (citaId) => {
        if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
            // Enviar solicitud de cancelación al backend
            console.log('Cancelar cita:', citaId);
        }
    };

    const getStatusClass = (estado) => {
        switch(estado) {
            case 'pendiente': return 'status-pendiente';
            case 'confirmada': return 'status-confirmada';
            case 'completada': return 'status-completada';
            default: return '';
        }
    };

    const getStatusText = (estado) => {
        switch(estado) {
            case 'pendiente': return 'Pendiente';
            case 'confirmada': return 'Confirmada';
            case 'completada': return 'Completada';
            default: return '';
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="/doctor/principalDoctor" className="navbar-link">Principal</a>
                        <a href="/doctor/citas" className="navbar-link active">Mis Citas</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
                        <a href="/doctor/perfil" className="navbar-link">Mi Perfil</a>
                        <a href="/login" className="navbar-link logout">Cerrar Sesión</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>📋 Mis Citas</h1>
                    <p>Gestiona tus consultas programadas</p>
                </div>

                <div className="filter-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'todas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('todas')}
                    >
                        Todas
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'hoy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hoy')}
                    >
                        Hoy
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'pendientes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pendientes')}
                    >
                        Pendientes
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'completadas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completadas')}
                    >
                        Completadas
                    </button>
                </div>

                <div className="citas-grid">
                    {filteredCitas.map(cita => (
                        <div key={cita.id} className="cita-card">
                            <div className="cita-fecha">
                                <div className="dia">{cita.fecha.dia}</div>
                                <div className="mes">{cita.fecha.mes}</div>
                                <div>{cita.fecha.año}</div>
                            </div>

                            <div className="cita-info">
                                <span className={`status-badge ${getStatusClass(cita.estado)}`}>
                                    {getStatusText(cita.estado)}
                                </span>
                                <h3>{cita.paciente}</h3>
                                <p>{cita.tipo}</p>
                                <div className="cita-detalles">
                                    <span>🕐 {cita.hora}</span>
                                    <span>🏥 {cita.consultorio}</span>
                                    <span>📞 {cita.telefono}</span>
                                </div>
                            </div>

                            <div className="cita-actions">
                                {cita.estado !== 'completada' && (
                                    <>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => handleAtenderCita(cita.id)}
                                        >
                                            Atender Cita
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleVerHistorial(cita.id)}
                                        >
                                            Ver Historial
                                        </button>
                                        <button 
                                            className="btn btn-cancel"
                                            onClick={() => handleCancelar(cita.id)}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                                {cita.estado === 'completada' && (
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleVerHistorial(cita.id)}
                                    >
                                        Ver Detalles
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CitasDoctor;

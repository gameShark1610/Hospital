import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/consultar_citas.css';

const ConsultarCitas = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [medicoEncontrado, setMedicoEncontrado] = useState(null);
    const [filtroActivo, setFiltroActivo] = useState('todas');
    const [mostrarNoResultados, setMostrarNoResultados] = useState(false);

    // Datos simulados del médico - vendrían del backend
    const datosDoctor = {
        id: 'D-12345',
        nombre: 'Dr. Carlos Ramírez López',
        especialidad: 'Cardiología',
        cedula: '1234567',
        telefono: '(555) 123-4567'
    };

    // Citas simuladas - vendrían del backend
    const citasCompletas = [
        {
            id: 'C-001',
            fecha: '4 Dic 2025, 10:00 AM',
            paciente: 'Juan Pérez García',
            tipo: 'Consulta General',
            consultorio: 'Consultorio 3A',
            estado: 'pendiente'
        },
        {
            id: 'C-002',
            fecha: '4 Dic 2025, 11:00 AM',
            paciente: 'María López Hernández',
            tipo: 'Control Cardiológico',
            consultorio: 'Consultorio 3A',
            estado: 'atendida'
        },
        {
            id: 'C-003',
            fecha: '4 Dic 2025, 2:00 PM',
            paciente: 'Pedro Martínez Ruiz',
            tipo: 'Consulta General',
            consultorio: 'Consultorio 3A',
            estado: 'pendiente'
        },
        {
            id: 'C-004',
            fecha: '3 Dic 2025, 9:00 AM',
            paciente: 'Ana Torres González',
            tipo: 'Seguimiento',
            consultorio: 'Consultorio 3A',
            estado: 'atendida'
        },
        {
            id: 'C-005',
            fecha: '3 Dic 2025, 4:00 PM',
            paciente: 'Luis Sánchez Díaz',
            tipo: 'Consulta Especializada',
            consultorio: 'Consultorio 3A',
            estado: 'cancelada'
        }
    ];

    const [citas, setCitas] = useState(citasCompletas);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleBuscarMedico = () => {
        if (busqueda.trim() === '') {
            alert('Por favor ingrese un nombre o ID de médico');
            return;
        }

        // Aquí iría la llamada al backend
        console.log('Buscar médico:', busqueda);
        
        // Simulación de búsqueda exitosa
        setMedicoEncontrado(datosDoctor);
        setMostrarNoResultados(false);
        setCitas(citasCompletas);
        setFiltroActivo('todas');

        // Para simular cuando no se encuentra:
        // setMedicoEncontrado(null);
        // setMostrarNoResultados(true);
    };

    const handleFiltrarCitas = (tipo) => {
        setFiltroActivo(tipo);
        
        if (tipo === 'todas') {
            setCitas(citasCompletas);
        } else if (tipo === 'pendientes') {
            setCitas(citasCompletas.filter(cita => cita.estado === 'pendiente'));
        } else if (tipo === 'atendidas') {
            setCitas(citasCompletas.filter(cita => cita.estado === 'atendida'));
        }
    };

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'badge-pendiente';
            case 'atendida':
                return 'badge-atendida';
            case 'cancelada':
                return 'badge-cancelada';
            default:
                return '';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'Pendiente';
            case 'atendida':
                return 'Atendida';
            case 'cancelada':
                return 'Cancelada';
            default:
                return estado;
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
                    <h1>📅 Consultar y Administrar Citas</h1>
                    <p>Consulta las citas de los médicos por nombre o ID</p>
                </div>

                <div className="section">
                    <h2 className="section-title">Buscar Médico</h2>
                    
                    <div className="search-section">
                        <label>Buscar por Nombre Completo o ID del Médico</label>
                        <div className="search-bar">
                            <input 
                                type="text" 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Ej: Dr. Carlos Ramírez o D-12345"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscarMedico()}
                            />
                            <button className="btn btn-primary" onClick={handleBuscarMedico}>
                                🔍 Buscar
                            </button>
                        </div>
                    </div>

                    {/* Información del Médico */}
                    {medicoEncontrado && (
                        <div>
                            <div className="doctor-info">
                                <h3>👨‍⚕️ {medicoEncontrado.nombre}</h3>
                                <div className="doctor-details">
                                    <div>
                                        <strong>ID:</strong> {medicoEncontrado.id}
                                    </div>
                                    <div>
                                        <strong>Especialidad:</strong> {medicoEncontrado.especialidad}
                                    </div>
                                    <div>
                                        <strong>Cédula:</strong> {medicoEncontrado.cedula}
                                    </div>
                                    <div>
                                        <strong>Teléfono:</strong> {medicoEncontrado.telefono}
                                    </div>
                                </div>
                            </div>

                            {/* Filtros de Estado */}
                            <div className="filter-tabs">
                                <button 
                                    className={`filter-tab ${filtroActivo === 'todas' ? 'active' : ''}`}
                                    onClick={() => handleFiltrarCitas('todas')}
                                >
                                    Todas las Citas
                                </button>
                                <button 
                                    className={`filter-tab ${filtroActivo === 'pendientes' ? 'active' : ''}`}
                                    onClick={() => handleFiltrarCitas('pendientes')}
                                >
                                    Pendientes
                                </button>
                                <button 
                                    className={`filter-tab ${filtroActivo === 'atendidas' ? 'active' : ''}`}
                                    onClick={() => handleFiltrarCitas('atendidas')}
                                >
                                    Atendidas
                                </button>
                            </div>

                            {/* Tabla de Citas */}
                            {citas.length > 0 ? (
                                <table className="citas-table">
                                    <thead>
                                        <tr>
                                            <th>ID Cita</th>
                                            <th>Fecha y Hora</th>
                                            <th>Paciente</th>
                                            <th>Tipo de Consulta</th>
                                            <th>Consultorio</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {citas.map((cita) => (
                                            <tr key={cita.id}>
                                                <td><strong>{cita.id}</strong></td>
                                                <td>{cita.fecha}</td>
                                                <td>{cita.paciente}</td>
                                                <td>{cita.tipo}</td>
                                                <td>{cita.consultorio}</td>
                                                <td>
                                                    <span className={`badge ${getBadgeClass(cita.estado)}`}>
                                                        {getEstadoTexto(cita.estado)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-results">
                                    <div className="no-results-icon">📅</div>
                                    <h3>No hay citas</h3>
                                    <p>No se encontraron citas con el filtro seleccionado</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sin resultados */}
                    {mostrarNoResultados && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No se encontró el médico</h3>
                            <p>No existe ningún médico con el ID o nombre ingresado</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ConsultarCitas;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/consultar_bitacora.css';

const ConsultarBitacora = () => {
    const navigate = useNavigate();

    // Estados para filtros
    const [filtros, setFiltros] = useState({
        fechaDesde: '',
        fechaHasta: '',
        especialidad: '',
        medico: '',
        paciente: '',
        idBitacora: ''
    });

    // Datos simulados - vendrían del backend
    const registros = [
        {
            id: 'BIT-248',
            fecha: '2 Dic 2025, 10:30 AM',
            medico: 'Dr. Carlos Ramírez',
            especialidad: 'cardiologia',
            paciente: 'Juan Pérez García',
            diagnostico: 'Hipertensión',
            consultorio: 'Consultorio 3A'
        },
        {
            id: 'BIT-247',
            fecha: '2 Dic 2025, 9:00 AM',
            medico: 'Dra. María González',
            especialidad: 'pediatria',
            paciente: 'Ana Torres González',
            diagnostico: 'Control de rutina',
            consultorio: 'Consultorio 2A'
        },
        {
            id: 'BIT-246',
            fecha: '1 Dic 2025, 4:00 PM',
            medico: 'Dr. Pedro Martínez',
            especialidad: 'traumatologia',
            paciente: 'Luis Sánchez Díaz',
            diagnostico: 'Esguince de tobillo',
            consultorio: 'Consultorio 4C'
        },
        {
            id: 'BIT-245',
            fecha: '1 Dic 2025, 2:00 PM',
            medico: 'Dr. Carlos Ramírez',
            especialidad: 'cardiologia',
            paciente: 'María López Hernández',
            diagnostico: 'Arritmia cardíaca',
            consultorio: 'Consultorio 3A'
        },
        {
            id: 'BIT-244',
            fecha: '1 Dic 2025, 11:00 AM',
            medico: 'Dra. Ana Torres',
            especialidad: 'general',
            paciente: 'Pedro Martínez Ruiz',
            diagnostico: 'Gripe común',
            consultorio: 'Consultorio 1B'
        },
        {
            id: 'BIT-243',
            fecha: '30 Nov 2025, 3:30 PM',
            medico: 'Dr. Carlos Ramírez',
            especialidad: 'cardiologia',
            paciente: 'Roberto Fernández',
            diagnostico: 'Control de presión',
            consultorio: 'Consultorio 3A'
        },
        {
            id: 'BIT-242',
            fecha: '30 Nov 2025, 1:00 PM',
            medico: 'Dra. María González',
            especialidad: 'pediatria',
            paciente: 'Sofía Ramírez Castro',
            diagnostico: 'Vacunación',
            consultorio: 'Consultorio 2A'
        },
        {
            id: 'BIT-241',
            fecha: '29 Nov 2025, 10:00 AM',
            medico: 'Dr. Pedro Martínez',
            especialidad: 'traumatologia',
            paciente: 'Jorge Hernández Ruiz',
            diagnostico: 'Fractura de muñeca',
            consultorio: 'Consultorio 4C'
        }
    ];

    const estadisticas = {
        total: 248,
        esteMes: 156,
        estaSemana: 42,
        hoy: 8
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleChangeFiltro = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    const handleBuscar = () => {
        console.log('Buscar con filtros:', filtros);
        // Aquí iría la llamada al backend con los filtros
    };

    const handleVerDetalle = (registro) => {
        console.log('Ver detalle de registro:', registro);
        // Aquí iría la lógica para mostrar detalles (modal o navegación)
    };

    const getBadgeClass = (especialidad) => {
        const badges = {
            cardiologia: 'badge-cardiologia',
            pediatria: 'badge-pediatria',
            general: 'badge-general',
            traumatologia: 'badge-traumatologia'
        };
        return badges[especialidad] || '';
    };

    const getEspecialidadTexto = (especialidad) => {
        const textos = {
            cardiologia: 'Cardiología',
            pediatria: 'Pediatría',
            general: 'Medicina General',
            traumatologia: 'Traumatología'
        };
        return textos[especialidad] || especialidad;
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
                    <h1>📋 Consultar Bitácora de Movimientos</h1>
                    <p>Visualiza todos los registros y movimientos del sistema</p>
                </div>

                <div className="section">
                    <h2 className="section-title">Filtros de Búsqueda</h2>

                    <div className="filters">
                        <div className="form-group">
                            <label>Fecha Desde</label>
                            <input 
                                type="date" 
                                name="fechaDesde"
                                value={filtros.fechaDesde}
                                onChange={handleChangeFiltro}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha Hasta</label>
                            <input 
                                type="date" 
                                name="fechaHasta"
                                value={filtros.fechaHasta}
                                onChange={handleChangeFiltro}
                            />
                        </div>
                        <div className="form-group">
                            <label>Especialidad</label>
                            <select 
                                name="especialidad"
                                value={filtros.especialidad}
                                onChange={handleChangeFiltro}
                            >
                                <option value="">Todas las especialidades</option>
                                <option value="cardiologia">Cardiología</option>
                                <option value="pediatria">Pediatría</option>
                                <option value="general">Medicina General</option>
                                <option value="traumatologia">Traumatología</option>
                            </select>
                        </div>
                    </div>

                    <div className="filters">
                        <div className="form-group">
                            <label>Médico</label>
                            <input 
                                type="text" 
                                name="medico"
                                value={filtros.medico}
                                onChange={handleChangeFiltro}
                                placeholder="Nombre del médico"
                            />
                        </div>
                        <div className="form-group">
                            <label>Paciente</label>
                            <input 
                                type="text" 
                                name="paciente"
                                value={filtros.paciente}
                                onChange={handleChangeFiltro}
                                placeholder="Nombre del paciente"
                            />
                        </div>
                        <div className="form-group">
                            <label>ID Bitácora</label>
                            <input 
                                type="text" 
                                name="idBitacora"
                                value={filtros.idBitacora}
                                onChange={handleChangeFiltro}
                                placeholder="Ej: BIT-001"
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleBuscar}>
                        🔍 Buscar Registros
                    </button>
                </div>

                <div className="section">
                    <h2 className="section-title">Registros de Bitácora</h2>

                    <div className="stats-row">
                        <div className="stat-item">
                            <div className="number">{estadisticas.total}</div>
                            <div className="label">Total Registros</div>
                        </div>
                        <div className="stat-item">
                            <div className="number">{estadisticas.esteMes}</div>
                            <div className="label">Este Mes</div>
                        </div>
                        <div className="stat-item">
                            <div className="number">{estadisticas.estaSemana}</div>
                            <div className="label">Esta Semana</div>
                        </div>
                        <div className="stat-item">
                            <div className="number">{estadisticas.hoy}</div>
                            <div className="label">Hoy</div>
                        </div>
                    </div>

                    <table className="bitacora-table">
                        <thead>
                            <tr>
                                <th>ID Bitácora</th>
                                <th>Fecha Movimiento</th>
                                <th>Usuario (Médico)</th>
                                <th>Especialidad</th>
                                <th>Paciente</th>
                                <th>Diagnóstico</th>
                                <th>Consultorio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((registro) => (
                                <tr key={registro.id}>
                                    <td><strong>{registro.id}</strong></td>
                                    <td>{registro.fecha}</td>
                                    <td>{registro.medico}</td>
                                    <td>
                                        <span className={`badge ${getBadgeClass(registro.especialidad)}`}>
                                            {getEspecialidadTexto(registro.especialidad)}
                                        </span>
                                    </td>
                                    <td>{registro.paciente}</td>
                                    <td>{registro.diagnostico}</td>
                                    <td>{registro.consultorio}</td>
                                    <td>
                                        <button 
                                            className="btn-detail"
                                            onClick={() => handleVerDetalle(registro)}
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ConsultarBitacora;
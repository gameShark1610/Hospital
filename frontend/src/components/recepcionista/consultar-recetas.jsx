import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/consultar_recetas.css';

const ConsultarRecetas = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [medicoEncontrado, setMedicoEncontrado] = useState(null);
    const [mostrarNoResultados, setMostrarNoResultados] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

    // Datos simulados - vendrían del backend
    const datosDoctor = {
        nombre: 'Dr. Carlos Ramírez López',
        cedula: '1234567',
        especialidad: 'Cardiología',
        totalRecetas: 48
    };

    const recetas = [
        {
            id: 'REC-12345',
            fecha: '2 Dic 2025',
            paciente: 'Juan Pérez García',
            diagnostico: 'Hipertensión',
            numMedicamentos: 2,
            diagnosticoCompleto: 'Hipertensión arterial grado 1. Presión arterial elevada (140/90 mmHg) detectada en consulta de rutina.',
            medicamentos: [
                { nombre: 'Enalapril 10mg', cantidad: '30 tabletas' },
                { nombre: 'Hidroclorotiazida 25mg', cantidad: '30 tabletas' }
            ],
            tratamiento: 'Enalapril: Tomar 1 tableta cada 24 horas, preferentemente por la mañana. Hidroclorotiazida: Tomar 1 tableta cada 24 horas junto con el Enalapril.',
            observaciones: 'Control de presión arterial diaria. Dieta baja en sodio. Evitar alimentos procesados. Seguimiento en 2 semanas. En caso de mareos o efectos secundarios, contactar inmediatamente.'
        },
        {
            id: 'REC-12344',
            fecha: '1 Dic 2025',
            paciente: 'María López Hernández',
            diagnostico: 'Arritmia cardíaca',
            numMedicamentos: 3,
            diagnosticoCompleto: 'Arritmia cardíaca con palpitaciones frecuentes.',
            medicamentos: [
                { nombre: 'Bisoprolol 5mg', cantidad: '30 tabletas' },
                { nombre: 'Aspirina 100mg', cantidad: '30 tabletas' },
                { nombre: 'Atorvastatina 20mg', cantidad: '30 tabletas' }
            ],
            tratamiento: 'Seguir indicaciones médicas específicas para cada medicamento.',
            observaciones: 'Monitoreo constante del ritmo cardíaco.'
        },
        {
            id: 'REC-12343',
            fecha: '30 Nov 2025',
            paciente: 'Pedro Martínez Ruiz',
            diagnostico: 'Control de presión',
            numMedicamentos: 1,
            diagnosticoCompleto: 'Control de presión arterial de rutina.',
            medicamentos: [
                { nombre: 'Losartán 50mg', cantidad: '30 tabletas' }
            ],
            tratamiento: 'Tomar 1 tableta diaria.',
            observaciones: 'Control mensual de presión arterial.'
        },
        {
            id: 'REC-12342',
            fecha: '29 Nov 2025',
            paciente: 'Ana Torres González',
            diagnostico: 'Insuficiencia cardíaca',
            numMedicamentos: 4,
            diagnosticoCompleto: 'Insuficiencia cardíaca en tratamiento.',
            medicamentos: [
                { nombre: 'Furosemida 40mg', cantidad: '30 tabletas' },
                { nombre: 'Espironolactona 25mg', cantidad: '30 tabletas' },
                { nombre: 'Carvedilol 12.5mg', cantidad: '60 tabletas' },
                { nombre: 'Ramipril 5mg', cantidad: '30 tabletas' }
            ],
            tratamiento: 'Seguir estrictamente las indicaciones médicas.',
            observaciones: 'Evitar exceso de sal. Control semanal.'
        },
        {
            id: 'REC-12341',
            fecha: '28 Nov 2025',
            paciente: 'Luis Sánchez Díaz',
            diagnostico: 'Revisión general',
            numMedicamentos: 2,
            diagnosticoCompleto: 'Revisión general de salud cardiovascular.',
            medicamentos: [
                { nombre: 'Atorvastatina 10mg', cantidad: '30 tabletas' },
                { nombre: 'Aspirina 81mg', cantidad: '30 tabletas' }
            ],
            tratamiento: 'Medicación preventiva.',
            observaciones: 'Mantener hábitos saludables.'
        }
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    const handleBuscarRecetas = () => {
        if (busqueda.trim() === '') {
            alert('Por favor ingrese un nombre o cédula de médico');
            return;
        }

        // Aquí iría la llamada al backend
        console.log('Buscar recetas del médico:', busqueda);
        
        // Simulación de búsqueda exitosa
        setMedicoEncontrado(datosDoctor);
        setMostrarNoResultados(false);

        // Para simular cuando no se encuentra:
        // setMedicoEncontrado(null);
        // setMostrarNoResultados(true);
    };

    const handleVerDetalle = (receta) => {
        setRecetaSeleccionada(receta);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setRecetaSeleccionada(null);
    };

    const handleModalClick = (e) => {
        if (e.target.className === 'modal show') {
            handleCerrarModal();
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
                    <h1>💊 Recetas Médicas Emitidas</h1>
                    <p>Consulta las recetas generadas por los médicos</p>
                </div>

                <div className="section">
                    <h2 className="section-title">Buscar por Médico</h2>
                    
                    <div className="search-section">
                        <label>Buscar por Nombre Completo o Cédula del Médico</label>
                        <div className="search-bar">
                            <input 
                                type="text" 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Ej: Dr. Carlos Ramírez o 1234567"
                                onKeyPress={(e) => e.key === 'Enter' && handleBuscarRecetas()}
                            />
                            <button className="btn btn-primary" onClick={handleBuscarRecetas}>
                                🔍 Buscar Recetas
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
                                        <strong>Cédula:</strong> {medicoEncontrado.cedula}
                                    </div>
                                    <div>
                                        <strong>Especialidad:</strong> {medicoEncontrado.especialidad}
                                    </div>
                                    <div>
                                        <strong>Total Recetas:</strong> {medicoEncontrado.totalRecetas}
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de Recetas */}
                            <table className="recetas-table">
                                <thead>
                                    <tr>
                                        <th>Num. Receta</th>
                                        <th>Fecha</th>
                                        <th>Paciente</th>
                                        <th>Diagnóstico</th>
                                        <th>Medicamentos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recetas.map((receta) => (
                                        <tr key={receta.id}>
                                            <td><strong>{receta.id}</strong></td>
                                            <td>{receta.fecha}</td>
                                            <td>{receta.paciente}</td>
                                            <td>{receta.diagnostico}</td>
                                            <td>{receta.numMedicamentos} medicamentos</td>
                                            <td>
                                                <button 
                                                    className="btn-detail"
                                                    onClick={() => handleVerDetalle(receta)}
                                                >
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Sin resultados */}
                    {mostrarNoResultados && (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No se encontró el médico</h3>
                            <p>No existe ningún médico con la cédula o nombre ingresado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detalle de Receta */}
            {modalAbierto && recetaSeleccionada && (
                <div 
                    className={`modal ${modalAbierto ? 'show' : ''}`}
                    onClick={handleModalClick}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>💊 Detalle de Receta - {recetaSeleccionada.id}</h2>
                            <span className="close" onClick={handleCerrarModal}>&times;</span>
                        </div>

                        <div className="detail-section">
                            <h3>Información General</h3>
                            <p><strong>Número de Receta:</strong> {recetaSeleccionada.id}</p>
                            <p><strong>Fecha:</strong> {recetaSeleccionada.fecha}</p>
                            <p><strong>Nombre del Paciente:</strong> {recetaSeleccionada.paciente}</p>
                            <p><strong>Nombre del Médico:</strong> {medicoEncontrado.nombre}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Diagnóstico</h3>
                            <p>{recetaSeleccionada.diagnosticoCompleto}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Medicamentos Recetados</h3>
                            <div className="medicamentos-list">
                                {recetaSeleccionada.medicamentos.map((medicamento, index) => (
                                    <div key={index} className="medicamento-item">
                                        <p><strong>Medicamento:</strong> {medicamento.nombre}</p>
                                        <p><strong>Cantidad:</strong> {medicamento.cantidad}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Tratamiento Recetado</h3>
                            <p>{recetaSeleccionada.tratamiento}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Observaciones</h3>
                            <p>{recetaSeleccionada.observaciones}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConsultarRecetas;
import React, { useState } from 'react';
import '../../styles/doctor/historial_pacientes.css';

const HistorialPacientes = () => {
    const [searchId, setSearchId] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBitacora, setSelectedBitacora] = useState(null);

    const [pacienteData, setPacienteData] = useState({
        id: '',
        nombre: '',
        edad: '',
        tipoSangre: '',
        telefono: '',
        alergias: '',
        totalConsultas: ''
    });

    const [bitacoraData, setBitacoraData] = useState([]);

    const buscarPaciente = async () => {
        if (searchId.trim() === '') {
            alert('Por favor ingrese un ID de paciente');
            return;
        }

        try {
            // Check if ID starts with P- and strip it if necessary, or just send raw ID if backend expects int
            // Backend expects Integer ID.
            const idToSend = searchId.replace("P-", "");

            const response = await fetch(`http://localhost:8080/api/doctores/historial/${idToSend}`, {
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setPacienteData(data); // Assuming state matches DTO structure roughly, might need mapping
                setBitacoraData(data.bitacora);
                setShowResults(true);
                setShowNoResults(false);
            } else {
                setShowResults(false);
                setShowNoResults(true);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            alert("Error al buscar historial");
        }
    };

    const verDetalle = (bitacora) => {
        setSelectedBitacora(bitacora);
        setShowModal(true);
    };

    const cerrarDetalle = () => {
        setShowModal(false);
        setSelectedBitacora(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            buscarPaciente();
        }
    };

    const getEspecialidadClass = (especialidad) => {
        const classes = {
            'Cardiología': 'badge-cardiologia',
            'Medicina General': 'badge-general',
            'Traumatología': 'badge-traumatologia',
            'Pediatría': 'badge-pediatria'
        };
        return classes[especialidad] || 'badge-general';
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="/doctor/principalDoctor" className="navbar-link">Principal</a>
                        <a href="/doctor/citas" className="navbar-link">Citas por atender</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link active">Historial Pacientes</a>
                        <a href="/doctor/citas-agendar" className="navbar-link">
                            Agendar Cita (Paciente)
                        </a>
                        <a href="/doctor/mis-citas" className="navbar-link">Mis Citas</a>
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
                <div className="page-header">
                    <h1>📚 Historial de Pacientes - Bitácora</h1>
                    <p>Busca el historial médico completo de un paciente por su ID</p>

                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ingrese el ID del paciente (Ej: P-12345)"
                        />
                        <button onClick={buscarPaciente}>🔍 Buscar</button>
                    </div>
                </div>

                {showResults && (
                    <div className="results-section">
                        <div className="patient-info-header">
                            <h2>👤 {pacienteData.nombre}</h2>
                            <div className="patient-info-grid">
                                <div className="info-item">
                                    <strong>ID Paciente:</strong>
                                    <span>{pacienteData.id}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Edad:</strong>
                                    <span>{pacienteData.edad}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Tipo de Sangre:</strong>
                                    <span>{pacienteData.tipoSangre}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Teléfono:</strong>
                                    <span>{pacienteData.telefono}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Alergias:</strong>
                                    <span>{pacienteData.alergias}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Total de Consultas:</strong>
                                    <span>{pacienteData.totalConsultas}</span>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>📋 Registro de Bitácora</h3>

                        <table className="bitacora-table">
                            <thead>
                                <tr>
                                    <th>ID Bitácora</th>
                                    <th>Fecha Movimiento</th>
                                    <th>Usuario (Médico)</th>
                                    <th>Especialidad</th>
                                    <th>Diagnóstico</th>
                                    <th>Consultorio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bitacoraData.map(bitacora => (
                                    <tr key={bitacora.id}>
                                        <td><strong>{bitacora.id}</strong></td>
                                        <td>{bitacora.fechaMov.split('T')[0]}</td>
                                        <td>{bitacora.medico}</td>
                                        <td>
                                            <span className={`badge ${getEspecialidadClass(bitacora.especialidad)}`}>
                                                {bitacora.especialidad}
                                            </span>
                                        </td>
                                        <td>{bitacora.diagnostico}</td>
                                        <td>{bitacora.consultorio}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showNoResults && (
                    <div className="results-section">
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No se encontraron resultados</h3>
                            <p>No existe ningún paciente con el ID ingresado</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Detalle Completo */}
            <div className={`modal ${showModal ? 'show' : ''}`} onClick={cerrarDetalle}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>📋 Detalle de Consulta - {selectedBitacora?.id}</h2>
                        <span className="close" onClick={cerrarDetalle}>&times;</span>
                    </div>

                    {selectedBitacora && (
                        <>
                            <div className="detail-section">
                                <h3>Información de la Consulta</h3>
                                <div className="detail-grid">
                                    <p><strong>ID Bitácora:</strong> {selectedBitacora.id}</p>
                                    <p><strong>Fecha:</strong> {selectedBitacora.fechaMov.split('T')[0]}</p>
                                    <p><strong>Paciente:</strong> {pacienteData.nombre}</p>
                                    <p><strong>ID Paciente:</strong> {pacienteData.id}</p>
                                    <p><strong>Médico:</strong> {selectedBitacora.medico}</p>
                                    <p><strong>Especialidad:</strong> {selectedBitacora.especialidad}</p>
                                    <p><strong>Consultorio:</strong> {selectedBitacora.consultorio}</p>
                                    <p><strong>Diagnóstico:</strong> {selectedBitacora.diagnostico}</p>
                                </div>
                            </div>

                            {selectedBitacora.diagnostico && (
                                <div className="detail-section">
                                    <h3>Diagnóstico</h3>
                                    <p>{selectedBitacora.diagnostico}</p>
                                </div>
                            )}

                            {selectedBitacora.notas && (
                                <div className="detail-section">
                                    <h3>Observaciones</h3>
                                    <p>{selectedBitacora.notas}</p>
                                </div>
                            )}

                            {selectedBitacora.tratamiento && (
                                <div className="detail-section">
                                    <h3>Tratamiento</h3>
                                    <p>{selectedBitacora.tratamiento}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistorialPacientes;

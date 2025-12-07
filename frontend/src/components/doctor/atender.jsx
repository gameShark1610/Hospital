import React, { useState } from 'react';
import '../../styles/doctor/atender.css';

const GenerarReceta = () => {
    const [medicamentos, setMedicamentos] = useState([
        { id: 1, nombre: '', tratamiento: '' }
    ]);
    const [diagnostico, setDiagnostico] = useState('');
    const [duracion, setDuracion] = useState('');

    const addMedicamento = () => {
        const newId = medicamentos.length + 1;
        setMedicamentos([...medicamentos, { id: newId, nombre: '', tratamiento: '' }]);
    };

    const removeMedicamento = (id) => {
        if (medicamentos.length > 1) {
            setMedicamentos(medicamentos.filter(med => med.id !== id));
        } else {
            alert('Debe haber al menos un medicamento en la receta.');
        }
    };

    const handleMedicamentoChange = (id, field, value) => {
        setMedicamentos(medicamentos.map(med => 
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se enviaría la información al backend
        console.log({
            diagnostico,
            medicamentos,
            duracion
        });
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="/dashboard-doctor" className="navbar-link">Principal</a>
                        <a href="/consultar-citas-doctor" className="navbar-link">Mis Citas</a>
                        <a href="/historial-pacientes" className="navbar-link">Historial Pacientes</a>
                        <a href="/citas" className="navbar-link agendar-paciente">📅 Agendar Cita (Paciente)</a>
                        <a href="/perfil-doctor" className="navbar-link">Mi Perfil</a>
                        <a href="/login" className="navbar-link logout">Cerrar Sesión</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>💊 Generar Receta Médica</h1>
                    <p>Complete los datos para generar una nueva receta</p>
                </div>

                {/* Información del Paciente */}
                <div className="form-section">
                    <h2 className="section-title">👤 Información del Paciente</h2>
                    
                    <div className="patient-info-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>ID Paciente:</strong> P-12345<br />
                                <strong>Paciente:</strong> Juan Pérez García<br />
                                <strong>Consulta:</strong> Consulta General - 10:00 AM
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Datos de la Receta */}
                    <div className="form-section">
                        <h2 className="section-title">📋 Datos de la Receta</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Número de Receta <span className="required">*</span></label>
                                <input type="text" disabled value="REC-12345" />
                            </div>
                            <div className="form-group">
                                <label>Fecha <span className="required">*</span></label>
                                <input type="date" disabled value="2025-12-02" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nombre del Paciente <span className="required">*</span></label>
                            <input type="text" value="Juan Pérez García" disabled />
                        </div>

                        <div className="form-group">
                            <label>Nombre del Médico <span className="required">*</span></label>
                            <input type="text" value="Dr. Carlos Ramírez" disabled />
                        </div>

                        <div className="form-group">
                            <label>Diagnóstico <span className="required">*</span></label>
                            <textarea 
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                                placeholder="Describa el diagnóstico del paciente"
                                required
                            />
                        </div>
                    </div>

                    {/* Medicamentos y Tratamiento */}
                    <div className="form-section">
                        <h2 className="section-title">💊 Medicamentos y Tratamiento</h2>

                        <div id="medicamentosContainer">
                            {medicamentos.map((medicamento, index) => (
                                <div key={medicamento.id} className="medicamento-item">
                                    <div className="medicamento-header">
                                        <span className="medicamento-number">Medicamento {index + 1}</span>
                                        <button 
                                            type="button"
                                            className="btn-remove" 
                                            onClick={() => removeMedicamento(medicamento.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <label>Medicamento <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder="Ej: Paracetamol 500mg"
                                            value={medicamento.nombre}
                                            onChange={(e) => handleMedicamentoChange(medicamento.id, 'nombre', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tratamiento (Dosis e indicaciones) <span className="required">*</span></label>
                                        <textarea 
                                            placeholder="Ej: 1 tableta cada 8 horas por 5 días. Tomar con alimentos."
                                            value={medicamento.tratamiento}
                                            onChange={(e) => handleMedicamentoChange(medicamento.id, 'tratamiento', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="button" className="btn btn-add" onClick={addMedicamento}>
                            + Agregar Medicamento
                        </button>
                    </div>

                    {/* Duración del Tratamiento */}
                    <div className="form-section">
                        <h2 className="section-title">⏱️ Duración del Tratamiento</h2>

                        <div className="form-group">
                            <label>Duración <span className="required">*</span></label>
                            <input 
                                type="text" 
                                value={duracion}
                                onChange={(e) => setDuracion(e.target.value)}
                                placeholder="Ej: 7 días, 2 semanas, 1 mes"
                                required
                            />
                        </div>

                        <div className="alert alert-info">
                            <strong>ℹ️ Nota:</strong> Asegúrese de especificar claramente la duración total del tratamiento.
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="form-section">
                        <div className="action-buttons">
                            <button type="submit" className="btn btn-primary">Generar Receta</button>
                            <button type="button" className="btn btn-secondary">Vista Previa</button>
                            <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>
                                ← Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerarReceta;

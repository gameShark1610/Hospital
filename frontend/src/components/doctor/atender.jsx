import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import '../../styles/doctor/atender.css';

const GenerarReceta = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Recuperamos los datos enviados
    const { citaData } = location.state || {};

    // 1. ESTADO: Catálogo de medicamentos (viene de la BD)
    const [listaMedicamentos, setListaMedicamentos] = useState([]);

    // 2. ESTADO: Filas de la receta (lo que el doctor edita)
    // Nota: Agregamos 'medicamentoId' y movimos 'duracion' aquí dentro
    const [medicamentosReceta, setMedicamentosReceta] = useState([
        { id: 1, medicamentoId: "", tratamiento: "", duracion: "" }
    ]);

    const [diagnostico, setDiagnostico] = useState('');
    const [observacion, setObservacion] = useState('');
    const [fechaHoy, setFechaHoy] = useState('');

    // Validación de entrada y fecha
    useEffect(() => {
        if (!citaData) {
            alert("No se ha seleccionado ninguna cita. Redirigiendo...");
            navigate('/doctor/citas');
            return;
        }
        const hoy = new Date().toISOString().split('T')[0];
        setFechaHoy(hoy);
    }, [citaData, navigate]);

    // Carga de medicamentos desde el Backend
    useEffect(() => {
        fetch("http://localhost:8080/medicamentos", {
          credentials: "include", 
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
              // Guardamos en la lista del catálogo, NO sobrescribimos la receta
              setListaMedicamentos(data);
          })
          .catch((error) => console.error("Error al cargar medicamentos:", error));
      }, []);

    if (!citaData) return <div>Cargando datos del paciente...</div>;

    // Agregar nueva fila vacía
    const addMedicamento = () => {
        const newId = medicamentosReceta.length + 1;
        setMedicamentosReceta([
            ...medicamentosReceta, 
            { id: newId, medicamentoId: "", tratamiento: "", duracion: "" }
        ]);
    };

    // Eliminar fila
    const removeMedicamento = (id) => {
        if (medicamentosReceta.length > 1) {
            setMedicamentosReceta(medicamentosReceta.filter(med => med.id !== id));
        } else {
            alert('Debe haber al menos un medicamento en la receta.');
        }
    };

    // Manejar cambios en los inputs de la tabla (Select, Tratamiento, Duración)
    const handleMedicamentoChange = (rowId, field, value) => {
        setMedicamentosReceta(medicamentosReceta.map(row => 
            row.id === rowId ? { ...row, [field]: value } : row
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Construimos el objeto JSON
        const datosReceta = {
            citaId: citaData.citasId, 
            pacienteId: citaData.pacienteId,
            diagnostico: diagnostico,
            observacion: observacion,
            fecha: fechaHoy,
            // Esta lista debe coincidir con MedicamentoDTO en Java
            medicamentos: medicamentosReceta.map(item => ({
                medicamentoId: item.medicamentoId, // El ID del select
                tratamiento: item.tratamiento,
                duracion: item.duracion
            }))
        };

        // Fetch al endpoint
        fetch("http://localhost:8080/api/doctores/guardarReceta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // include the session cookie
            body: JSON.stringify(datosReceta) // Convertimos a JSON string
        })
        .then(response => {
            if (response.ok) {
                alert("Receta guardada con éxito");
                navigate('/doctor/citas'); // Redirigir al terminar
            } else {
                alert("Error al guardar");
            }
        })
        .catch(error => console.error("Error:", error));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.clear();
            alert("Sesión cerrada exitosamente");
            window.location.href = "/login";
        }
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="/doctor/principalDoctor" className="navbar-link">Principal</a>
                        <a href="/doctor/citas" className="navbar-link active">Citas por atender</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
                        <a href="/doctor/citas-agendar" className="navbar-link">Agendar Cita (Paciente)</a>
                        <a href="/doctor/mis-citas" className="navbar-link">Mis Citas</a>
                        <a href="/doctor/perfil" className="navbar-link">Mi Perfil</a>
                        <a href="#" onClick={handleLogout} className="navbar-link logout">Cerrar Sesión</a>
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
                                <strong>Paciente:</strong> {citaData.nombrePaciente}<br />
                                <strong>Horario:</strong> {citaData.horario} - Consultorio {citaData.numConsultorio}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2 className="section-title">📋 Datos de la Receta</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Número de Receta</label>
                                <input type="text" disabled value={citaData.citasId} />
                            </div>
                            <div className="form-group">
                                <label>Fecha <span className="required">*</span></label>
                                <input type="date" disabled value={fechaHoy} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nombre del Paciente</label>
                            <input type="text" value={citaData.nombrePaciente} disabled />
                        </div>

                        <div className="form-group">
                            <label>Nombre del Médico</label>
                            <input type="text" value={citaData.nombreDoctor || "Dr. Asignado"} disabled />
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

                        <div className="form-group">
                            <label>Observación General <span className="required">*</span></label>
                            <textarea 
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                                placeholder="Describa la observación general (ej: reposo, dieta...)"
                                required
                            />
                        </div>
                    </div>

                    {/* Medicamentos y Tratamiento */}
                    <div className="form-section">
                        <h2 className="section-title">💊 Medicamentos y Tratamiento</h2>

                        <div id="medicamentosContainer">
                            {medicamentosReceta.map((fila, index) => (
                                <div key={fila.id} className="medicamento-item">
                                    <div className="medicamento-header">
                                        <span className="medicamento-number">Medicamento {index + 1}</span>
                                        <button 
                                            type="button"
                                            className="btn-remove" 
                                            onClick={() => removeMedicamento(fila.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    {/* 1. SELECCIÓN DE MEDICAMENTO */}
                                    <div className="form-group">
                                        <label>Medicamento <span className="required">*</span></label>
                                        <select 
                                            value={fila.medicamentoId}
                                            onChange={(e) => handleMedicamentoChange(fila.id, 'medicamentoId', e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        >
                                            <option value="">-- Seleccione Medicamento --</option>
                                            {listaMedicamentos.map((med) => (
                                                <option key={med.id} value={med.id}>
                                                    {med.nombreMed}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 2. TRATAMIENTO */}
                                    <div className="form-group">
                                        <label>Tratamiento (Dosis e indicaciones) <span className="required">*</span></label>
                                        <textarea 
                                            placeholder="Ej: 1 tableta cada 8 horas. Tomar con alimentos."
                                            value={fila.tratamiento}
                                            onChange={(e) => handleMedicamentoChange(fila.id, 'tratamiento', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* 3. DURACIÓN INDIVIDUAL */}
                                    <div className="form-group">
                                        <label>Duración <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            value={fila.duracion}
                                            onChange={(e) => handleMedicamentoChange(fila.id, 'duracion', e.target.value)}
                                            placeholder="Ej: 7 días, 2 semanas"
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
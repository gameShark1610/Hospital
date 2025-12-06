import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/gestion_servicios.css';

const GestionServicios = () => {
    const navigate = useNavigate();
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
    const [tipoConsulta, setTipoConsulta] = useState('');
    const [medicoAsignado, setMedicoAsignado] = useState('');
    const [servicios, setServicios] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);

    // Catálogos de precios
    const preciosConsultas = {
        general: 500,
        especializada: 800,
        urgencia: 1200,
        seguimiento: 400
    };

    const serviciosDisponibles = {
        rayosx: { nombre: 'Rayos X', precio: 300 },
        laboratorio: { nombre: 'Análisis de Laboratorio', precio: 450 },
        electrocardiograma: { nombre: 'Electrocardiograma', precio: 350 },
        ultrasonido: { nombre: 'Ultrasonido', precio: 600 }
    };

    const medicamentosDisponibles = {
        paracetamol: { nombre: 'Paracetamol 500mg', precio: 50 },
        amoxicilina: { nombre: 'Amoxicilina 500mg', precio: 120 },
        ibuprofeno: { nombre: 'Ibuprofeno 400mg', precio: 80 },
        omeprazol: { nombre: 'Omeprazol 20mg', precio: 95 }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleBuscarPaciente = () => {
        if (busquedaPaciente.trim() === '') {
            alert('Por favor ingrese un ID de paciente');
            return;
        }

        // Simulación de búsqueda - aquí iría la llamada al backend
        setPacienteEncontrado({
            id: 'P-12345',
            nombre: 'Juan Pérez García',
            telefono: '(555) 123-4567'
        });
    };

    const handleAgregarServicio = () => {
        const nuevoServicio = {
            id: Date.now(),
            tipo: '',
            cantidad: 1,
            precio: 0,
            total: 0
        };
        setServicios([...servicios, nuevoServicio]);
    };

    const handleAgregarMedicamento = () => {
        const nuevoMedicamento = {
            id: Date.now(),
            tipo: '',
            cantidad: 1,
            precio: 0,
            total: 0
        };
        setMedicamentos([...medicamentos, nuevoMedicamento]);
    };

    const handleChangeServicio = (id, field, value) => {
        setServicios(servicios.map(servicio => {
            if (servicio.id === id) {
                const updated = { ...servicio, [field]: value };
                
                if (field === 'tipo' && value) {
                    updated.precio = serviciosDisponibles[value].precio;
                    updated.total = updated.precio * updated.cantidad;
                } else if (field === 'cantidad') {
                    updated.total = updated.precio * value;
                }
                
                return updated;
            }
            return servicio;
        }));
    };

    const handleChangeMedicamento = (id, field, value) => {
        setMedicamentos(medicamentos.map(medicamento => {
            if (medicamento.id === id) {
                const updated = { ...medicamento, [field]: value };
                
                if (field === 'tipo' && value) {
                    updated.precio = medicamentosDisponibles[value].precio;
                    updated.total = updated.precio * updated.cantidad;
                } else if (field === 'cantidad') {
                    updated.total = updated.precio * value;
                }
                
                return updated;
            }
            return medicamento;
        }));
    };

    const handleEliminarServicio = (id) => {
        setServicios(servicios.filter(s => s.id !== id));
    };

    const handleEliminarMedicamento = (id) => {
        setMedicamentos(medicamentos.filter(m => m.id !== id));
    };

    const calcularSubtotalConsulta = () => {
        return tipoConsulta ? preciosConsultas[tipoConsulta] : 0;
    };

    const calcularSubtotalServicios = () => {
        return servicios.reduce((sum, s) => sum + s.total, 0);
    };

    const calcularSubtotalMedicamentos = () => {
        return medicamentos.reduce((sum, m) => sum + m.total, 0);
    };

    const calcularTotal = () => {
        return calcularSubtotalConsulta() + calcularSubtotalServicios() + calcularSubtotalMedicamentos();
    };

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    const handleGenerarTicket = () => {
        const ticket = {
            paciente: pacienteEncontrado,
            tipoConsulta,
            medicoAsignado,
            servicios,
            medicamentos,
            subtotalConsulta: calcularSubtotalConsulta(),
            subtotalServicios: calcularSubtotalServicios(),
            subtotalMedicamentos: calcularSubtotalMedicamentos(),
            total: calcularTotal()
        };
        
        console.log('Generar ticket:', ticket);
        // Aquí iría la llamada al backend y la lógica de impresión
    };

    const handleCancelar = () => {
        setBusquedaPaciente('');
        setPacienteEncontrado(null);
        setTipoConsulta('');
        setMedicoAsignado('');
        setServicios([]);
        setMedicamentos([]);
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
                    <h1>💰 Gestión de Servicios y Tickets</h1>
                    <p>Registra servicios extra, medicamentos y genera tickets de pago</p>
                </div>

                <div className="section">
                    <h2 className="section-title">Buscar Paciente</h2>
                    
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={busquedaPaciente}
                            onChange={(e) => setBusquedaPaciente(e.target.value)}
                            placeholder="Ingrese ID del paciente"
                            onKeyPress={(e) => e.key === 'Enter' && handleBuscarPaciente()}
                        />
                        <button className="btn btn-primary" onClick={handleBuscarPaciente}>
                            🔍 Buscar
                        </button>
                    </div>

                    {pacienteEncontrado && (
                        <div className="patient-info">
                            <h3>👤 Información del Paciente</h3>
                            <p><strong>ID:</strong> {pacienteEncontrado.id}</p>
                            <p><strong>Nombre:</strong> {pacienteEncontrado.nombre}</p>
                            <p><strong>Teléfono:</strong> {pacienteEncontrado.telefono}</p>
                        </div>
                    )}
                </div>

                {pacienteEncontrado && (
                    <>
                        <div className="section">
                            <h2 className="section-title">Servicios y Consulta</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo de Consulta <span className="required">*</span></label>
                                    <select 
                                        value={tipoConsulta}
                                        onChange={(e) => setTipoConsulta(e.target.value)}
                                    >
                                        <option value="">Seleccione tipo de consulta</option>
                                        <option value="general">Consulta General - $500.00</option>
                                        <option value="especializada">Consulta Especializada - $800.00</option>
                                        <option value="urgencia">Urgencia - $1,200.00</option>
                                        <option value="seguimiento">Seguimiento - $400.00</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Médico Asignado <span className="required">*</span></label>
                                    <select 
                                        value={medicoAsignado}
                                        onChange={(e) => setMedicoAsignado(e.target.value)}
                                    >
                                        <option value="">Seleccione médico</option>
                                        <option value="1">Dr. Carlos Ramírez - Cardiología</option>
                                        <option value="2">Dra. María González - Pediatría</option>
                                        <option value="3">Dr. Pedro Martínez - Medicina General</option>
                                    </select>
                                </div>
                            </div>

                            <h3 className="subtitle">Servicios Extra</h3>

                            <div className="item-list">
                                {servicios.map((servicio, index) => (
                                    <div key={servicio.id} className="item-row">
                                        <div className="item-header">
                                            <strong>Servicio {index + 1}</strong>
                                            <button 
                                                className="btn-remove"
                                                onClick={() => handleEliminarServicio(servicio.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <div className="item-details">
                                            <select
                                                value={servicio.tipo}
                                                onChange={(e) => handleChangeServicio(servicio.id, 'tipo', e.target.value)}
                                            >
                                                <option value="">Seleccione servicio</option>
                                                <option value="rayosx">Rayos X - $300.00</option>
                                                <option value="laboratorio">Análisis de Laboratorio - $450.00</option>
                                                <option value="electrocardiograma">Electrocardiograma - $350.00</option>
                                                <option value="ultrasonido">Ultrasonido - $600.00</option>
                                            </select>
                                            <input 
                                                type="number" 
                                                value={servicio.cantidad}
                                                onChange={(e) => handleChangeServicio(servicio.id, 'cantidad', parseInt(e.target.value) || 1)}
                                                min="1"
                                                placeholder="Cantidad"
                                            />
                                            <input 
                                                type="text" 
                                                value={formatCurrency(servicio.precio)}
                                                readOnly 
                                                placeholder="Precio"
                                            />
                                            <input 
                                                type="text" 
                                                value={formatCurrency(servicio.total)}
                                                readOnly 
                                                placeholder="Total"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-add" onClick={handleAgregarServicio}>
                                + Agregar Servicio Extra
                            </button>

                            <h3 className="subtitle">Medicamentos</h3>

                            <div className="item-list">
                                {medicamentos.map((medicamento, index) => (
                                    <div key={medicamento.id} className="item-row">
                                        <div className="item-header">
                                            <strong>Medicamento {index + 1}</strong>
                                            <button 
                                                className="btn-remove"
                                                onClick={() => handleEliminarMedicamento(medicamento.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <div className="item-details">
                                            <select
                                                value={medicamento.tipo}
                                                onChange={(e) => handleChangeMedicamento(medicamento.id, 'tipo', e.target.value)}
                                            >
                                                <option value="">Seleccione medicamento</option>
                                                <option value="paracetamol">Paracetamol 500mg - $50.00</option>
                                                <option value="amoxicilina">Amoxicilina 500mg - $120.00</option>
                                                <option value="ibuprofeno">Ibuprofeno 400mg - $80.00</option>
                                                <option value="omeprazol">Omeprazol 20mg - $95.00</option>
                                            </select>
                                            <input 
                                                type="number" 
                                                value={medicamento.cantidad}
                                                onChange={(e) => handleChangeMedicamento(medicamento.id, 'cantidad', parseInt(e.target.value) || 1)}
                                                min="1"
                                                placeholder="Cantidad"
                                            />
                                            <input 
                                                type="text" 
                                                value={formatCurrency(medicamento.precio)}
                                                readOnly 
                                                placeholder="Precio"
                                            />
                                            <input 
                                                type="text" 
                                                value={formatCurrency(medicamento.total)}
                                                readOnly 
                                                placeholder="Total"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-add" onClick={handleAgregarMedicamento}>
                                + Agregar Medicamento
                            </button>
                        </div>

                        <div className="section">
                            <h2 className="section-title">Resumen de Pago</h2>

                            <div className="total-section">
                                <div className="total-grid">
                                    <div className="total-row">
                                        <span>Subtotal Consulta:</span>
                                        <span>{formatCurrency(calcularSubtotalConsulta())}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Subtotal Servicios:</span>
                                        <span>{formatCurrency(calcularSubtotalServicios())}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Subtotal Medicamentos:</span>
                                        <span>{formatCurrency(calcularSubtotalMedicamentos())}</span>
                                    </div>
                                    <div className="total-row total-final">
                                        <span>TOTAL A PAGAR:</span>
                                        <span>{formatCurrency(calcularTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleGenerarTicket}>
                                    🎫 Generar e Imprimir Ticket
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancelar}>
                                    ✕ Cancelar
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GestionServicios;
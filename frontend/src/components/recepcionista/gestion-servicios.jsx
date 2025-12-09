import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/gestion_servicios.css';

const GestionServicios = () => {
    const navigate = useNavigate();
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
    const [tipoConsulta, setTipoConsulta] = useState(''); // Keep simple string or enhance if needed
    // Removed medicoAsignado per user instruction flow or keeping simplistic. 
    // Wait, previous code had medicoAsignado. The TicketDTO handles it. User said "Medicamentos and Servicios".
    // I will keep the structure but focus on M&S.

    const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
    const [medicamentosSeleccionados, setMedicamentosSeleccionados] = useState([]);

    const [catalogoServicios, setCatalogoServicios] = useState([]);
    const [catalogoMedicamentos, setCatalogoMedicamentos] = useState([]);

    useEffect(() => {
        fetchCatalogs();
    }, []);

    const fetchCatalogs = async () => {
        try {
            const resMed = await fetch('http://localhost:8080/medicamentos', { credentials: 'include' });
            if (resMed.ok) setCatalogoMedicamentos(await resMed.json());

            const resServ = await fetch('http://localhost:8080/api/servicios', { credentials: 'include' });
            if (resServ.ok) setCatalogoServicios(await resServ.json());
        } catch (error) {
            console.error("Error fetching catalogs:", error);
        }
    };

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleBuscarPaciente = () => {
        if (!busquedaPaciente.trim()) {
            alert('Ingrese ID/Nombre');
            return;
        }
        // Mock search for now, or implement backend search if requested previously? 
        // User didn't request patient search implementation explicitly, just ticket generation.
        // Assuming simplified behavior: just input name manually if search fails, OR keep the mock
        setPacienteEncontrado({
            id: 'P-999',
            nombre: busquedaPaciente, // Use input as name for simplicty if no backend search
            telefono: 'N/A'
        });
    };

    const handleAgregarServicio = () => {
        setServiciosSeleccionados([...serviciosSeleccionados, { id: Date.now(), servicioId: '', cantidad: 1, price: 0, total: 0 }]);
    };

    const handleAgregarMedicamento = () => {
        setMedicamentosSeleccionados([...medicamentosSeleccionados, { id: Date.now(), medicamentoId: '', cantidad: 1, price: 0, total: 0 }]);
    };

    const handleChangeServicio = (rowId, field, value) => {
        setServiciosSeleccionados(prev => prev.map(item => {
            if (item.id === rowId) {
                let updated = { ...item, [field]: value };
                if (field === 'servicioId') {
                    const serv = catalogoServicios.find(s => s.id === parseInt(value));
                    if (serv) {
                        updated.price = serv.precio;
                        updated.total = updated.price * updated.cantidad;
                    }
                } else if (field === 'cantidad') {
                    updated.total = updated.price * value;
                }
                return updated;
            }
            return item;
        }));
    };

    const handleChangeMedicamento = (rowId, field, value) => {
        setMedicamentosSeleccionados(prev => prev.map(item => {
            if (item.id === rowId) {
                let updated = { ...item, [field]: value };
                if (field === 'medicamentoId') {
                    const med = catalogoMedicamentos.find(m => m.id === parseInt(value));
                    if (med) {
                        updated.price = med.precio;
                        updated.total = updated.price * updated.cantidad;
                    }
                } else if (field === 'cantidad') {
                    updated.total = updated.price * value;
                }
                return updated;
            }
            return item;
        }));
    };

    const handleEliminarServicio = (id) => {
        setServiciosSeleccionados(prev => prev.filter(i => i.id !== id));
    };

    const handleEliminarMedicamento = (id) => {
        setMedicamentosSeleccionados(prev => prev.filter(i => i.id !== id));
    };

    const calcularTotal = () => {
        const totalServ = serviciosSeleccionados.reduce((acc, curr) => acc + curr.total, 0);
        const totalMed = medicamentosSeleccionados.reduce((acc, curr) => acc + curr.total, 0);
        return totalServ + totalMed;
    };

    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

    const handleGenerarTicket = async () => {
        if (!pacienteEncontrado) return;

        const detalles = [];
        serviciosSeleccionados.forEach(s => {
            if (s.servicioId) detalles.push({ tipo: 'servicio', idItem: s.servicioId, cantidad: s.cantidad });
        });
        medicamentosSeleccionados.forEach(m => {
            if (m.medicamentoId) detalles.push({ tipo: 'medicamento', idItem: m.medicamentoId, cantidad: m.cantidad });
        });

        if (detalles.length === 0) {
            alert("No hay items para generar ticket");
            return;
        }

        const ticketDTO = {
            nombreCliente: pacienteEncontrado.nombre,
            tipoConsulta: 'General', // Default or add selector
            detalles: detalles
        };

        try {
            const response = await fetch('http://localhost:8080/api/recepcionista/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(ticketDTO)
            });

            if (response.ok) {
                const ticketId = await response.json();
                alert(`Ticket generado con éxito: #${ticketId}. Descargando PDF...`);

                // Download PDF
                const pdfRes = await fetch(`http://localhost:8080/api/recepcionista/tickets/${ticketId}/pdf`, { credentials: 'include' });
                if (pdfRes.ok) {
                    const blob = await pdfRes.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ticket_${ticketId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    alert("Error al descargar PDF");
                }

                handleCancelar(); // Reset form
            } else {
                alert("Error al generar ticket");
            }
        } catch (error) {
            console.error("Error generating ticket:", error);
            alert("Error de conexión");
        }
    };

    const handleCancelar = () => {
        setBusquedaPaciente('');
        setPacienteEncontrado(null);
        setServiciosSeleccionados([]);
        setMedicamentosSeleccionados([]);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="/recepcionista/paginaRecepcionista" className="navbar-link">← Volver</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="navbar-link logout">Cerrar Sesión</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>💰 Gestión de Servicios y Tickets</h1>
                    <p>Registra servicios extra, medicamentos y genera tickets de pago</p>
                </div>

                <div className="section">
                    <h2 className="section-title">Datos del Cliente</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            value={busquedaPaciente}
                            onChange={(e) => setBusquedaPaciente(e.target.value)}
                            placeholder="Nombre del Cliente / Paciente"
                        />
                        <button className="btn btn-primary" onClick={handleBuscarPaciente}>🔍 Asignar</button>
                    </div>
                    {pacienteEncontrado && (
                        <div className="patient-info">
                            <h3>👤 Cliente: {pacienteEncontrado.nombre}</h3>
                        </div>
                    )}
                </div>

                {pacienteEncontrado && (
                    <>
                        <div className="section">
                            <h2 className="section-title">Detalles de Venta</h2>

                            <h3 className="subtitle">Servicios</h3>
                            {serviciosSeleccionados.map((item, index) => (
                                <div key={item.id} className="item-row">
                                    <div className="item-header">
                                        <strong>Servicio {index + 1}</strong>
                                        <button className="btn-remove" onClick={() => handleEliminarServicio(item.id)}>Eliminar</button>
                                    </div>
                                    <div className="item-details">
                                        <select value={item.servicioId} onChange={(e) => handleChangeServicio(item.id, 'servicioId', e.target.value)}>
                                            <option value="">Seleccione Servicio</option>
                                            {catalogoServicios.map(s => (
                                                <option key={s.id} value={s.id}>{s.servicio} - ${s.precio}</option>
                                            ))}
                                        </select>
                                        <input type="number" min="1" value={item.cantidad} onChange={(e) => handleChangeServicio(item.id, 'cantidad', parseInt(e.target.value))} />
                                        <input type="text" value={formatCurrency(item.price)} readOnly />
                                        <input type="text" value={formatCurrency(item.total)} readOnly />
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-add" onClick={handleAgregarServicio}>+ Agregar Servicio</button>

                            <h3 className="subtitle">Medicamentos</h3>
                            {medicamentosSeleccionados.map((item, index) => (
                                <div key={item.id} className="item-row">
                                    <div className="item-header">
                                        <strong>Medicamento {index + 1}</strong>
                                        <button className="btn-remove" onClick={() => handleEliminarMedicamento(item.id)}>Eliminar</button>
                                    </div>
                                    <div className="item-details">
                                        <select value={item.medicamentoId} onChange={(e) => handleChangeMedicamento(item.id, 'medicamentoId', e.target.value)}>
                                            <option value="">Seleccione Medicamento</option>
                                            {catalogoMedicamentos.map(m => (
                                                <option key={m.id} value={m.id}>{m.nombreMed} - ${m.precio}</option>
                                            ))}
                                        </select>
                                        <input type="number" min="1" value={item.cantidad} onChange={(e) => handleChangeMedicamento(item.id, 'cantidad', parseInt(e.target.value))} />
                                        <input type="text" value={formatCurrency(item.price)} readOnly />
                                        <input type="text" value={formatCurrency(item.total)} readOnly />
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-add" onClick={handleAgregarMedicamento}>+ Agregar Medicamento</button>
                        </div>

                        <div className="section">
                            <h2 className="section-title">Resumen</h2>
                            <div className="total-section">
                                <div className="total-row total-final">
                                    <span>TOTAL:</span>
                                    <span>{formatCurrency(calcularTotal())}</span>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleGenerarTicket}>🎫 Generar Ticket y PDF</button>
                                <button className="btn btn-secondary" onClick={handleCancelar}>✕ Cancelar</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GestionServicios;
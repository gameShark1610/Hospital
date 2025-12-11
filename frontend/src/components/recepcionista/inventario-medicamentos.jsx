import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/inventario_medicamentos.css';

const InventarioMedicamentos = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [cantidadAgregar, setCantidadAgregar] = useState('');

    const [medicamentos, setMedicamentos] = useState([]);
    const [stats, setStats] = useState({ total: 0, enStock: 0, agotados: 0 });

    const fetchMedicamentos = async () => {
        try {
            const response = await fetch('http://localhost:8080/medicamentos', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Medicamentos fetched:", data);
                // Map backend data to frontend model if needed, or use directly
                // Backend fields: id, nombreMed, precio, stock (bool), cantidad
                setMedicamentos(data);

                // Update stats
                const total = data.length;
                const enStock = data.filter(m => m.stock === true).length;
                const agotados = data.filter(m => m.stock === false || m.cantidad === 0).length;

                setStats({ total, enStock, agotados });
            } else {
                console.error("Failed to fetch medicamentos");
            }
        } catch (error) {
            console.error("Error fetching medicamentos:", error);
        }
    };

    useEffect(() => {
        fetchMedicamentos();
    }, []);

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleAbrirActualizar = (medicamento) => {
        setMedicamentoSeleccionado(medicamento);
        setCantidadAgregar('');
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setMedicamentoSeleccionado(null);
        setCantidadAgregar('');
    };

    const handleActualizarStock = async () => {
        if (!cantidadAgregar || parseInt(cantidadAgregar) <= 0) {
            alert('Por favor ingrese una cantidad válida');
            return;
        }

        try {
            // Include credentials if session uses cookies, although frontend snippet used credentials: 'include' recently.
            // Using params for amount as defined in controller: /medicamentos/{id}/agregar?cantidad=X
            const response = await fetch(`http://localhost:8080/medicamentos/${medicamentoSeleccionado.id}/agregar?cantidad=${cantidadAgregar}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Stock agregado exitosamente");
                fetchMedicamentos(); // Refresh list
                handleCerrarModal();
            } else {
                alert("Error al actualizar stock");
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Error de conexión");
        }
    };

    const handleModalClick = (e) => {
        if (e.target.className.includes('modal show')) {
            handleCerrarModal();
        }
    };

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    // Filtering logic
    const medicamentosFiltrados = medicamentos.filter(med => {
        const matchBusqueda = med.nombreMed.toLowerCase().includes(busqueda.toLowerCase());
        // Simple mapping for filter state
        // 'disponible' -> med.stock === true
        // 'agotado' -> med.stock === false
        let matchEstado = true;
        if (filtroEstado === 'disponible') matchEstado = med.stock === true;
        if (filtroEstado === 'agotado') matchEstado = med.stock === false;

        return matchBusqueda && matchEstado;
    });

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
                    <h1>📦 Inventario de Medicamentos</h1>
                    <p>Gestiona y actualiza el stock de medicamentos del hospital</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Medicamentos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.enStock}</div>
                        <div className="stat-label">En Stock</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.agotados}</div>
                        <div className="stat-label">Agotados (Stock=No)</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Inventario Actual</h2>

                    <div className="search-filter">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="disponible">En Stock</option>
                            <option value="agotado">Sin Stock</option>
                        </select>
                    </div>

                    <table className="medicamentos-table">
                        <thead>
                            <tr>
                                <th>MedicamentoId</th>
                                <th>NombreMed</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentosFiltrados.map((med) => (
                                <tr key={med.id}>
                                    <td><strong>{med.id}</strong></td>
                                    <td>{med.nombreMed}</td>
                                    <td>{formatCurrency(med.precio)}</td>
                                    <td>
                                        <span className={`badge ${med.stock ? 'badge-disponible' : 'badge-agotado'}`}>
                                            {med.stock ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    <td>{med.cantidad}</td>
                                    <td>
                                        <button
                                            className="btn-action"
                                            onClick={() => handleAbrirActualizar(med)}
                                        >
                                            + Agregar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Agregar Stock */}
            {modalAbierto && medicamentoSeleccionado && (
                <div className={`modal ${modalAbierto ? 'show' : ''}`} onClick={handleModalClick}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>📦 Agregar Stock</h2>
                            <span className="close" onClick={handleCerrarModal}>&times;</span>
                        </div>

                        <div className="form-group">
                            <label>Medicamento: <strong>{medicamentoSeleccionado.nombreMed}</strong></label>
                        </div>
                        <div className="form-group">
                            <label>Stock Actual: {medicamentoSeleccionado.cantidad}</label>
                        </div>

                        <div className="form-group">
                            <label>Cantidad a Agregar <span className="required">*</span></label>
                            <input
                                type="number"
                                value={cantidadAgregar}
                                onChange={(e) => setCantidadAgregar(e.target.value)}
                                placeholder="Ingrese cantidad"
                                min="1"
                            />
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={handleActualizarStock}>
                                ✓ Confirmar
                            </button>
                            <button className="btn btn-secondary" onClick={handleCerrarModal}>
                                ✕ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InventarioMedicamentos;
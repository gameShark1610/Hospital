import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/inventario_medicamentos.css';

const InventarioMedicamentos = () => {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);

    // Estados para el formulario del modal
    const [formActualizar, setFormActualizar] = useState({
        tipoMovimiento: '',
        cantidad: '',
        motivo: '',
        stockMinimo: ''
    });

    // Datos simulados - vendrían del backend
    const [medicamentos, setMedicamentos] = useState([
        {
            id: 'MED-001',
            nombre: 'Paracetamol',
            presentacion: '500mg - Tabletas',
            stockActual: 450,
            stockMinimo: 100,
            precio: 50.00,
            estado: 'disponible'
        },
        {
            id: 'MED-002',
            nombre: 'Amoxicilina',
            presentacion: '500mg - Cápsulas',
            stockActual: 85,
            stockMinimo: 100,
            precio: 120.00,
            estado: 'bajo'
        },
        {
            id: 'MED-003',
            nombre: 'Ibuprofeno',
            presentacion: '400mg - Tabletas',
            stockActual: 320,
            stockMinimo: 100,
            precio: 80.00,
            estado: 'disponible'
        },
        {
            id: 'MED-004',
            nombre: 'Omeprazol',
            presentacion: '20mg - Cápsulas',
            stockActual: 0,
            stockMinimo: 50,
            precio: 95.00,
            estado: 'agotado'
        },
        {
            id: 'MED-005',
            nombre: 'Enalapril',
            presentacion: '10mg - Tabletas',
            stockActual: 180,
            stockMinimo: 100,
            precio: 110.00,
            estado: 'disponible'
        },
        {
            id: 'MED-006',
            nombre: 'Metformina',
            presentacion: '850mg - Tabletas',
            stockActual: 65,
            stockMinimo: 80,
            precio: 85.00,
            estado: 'bajo'
        }
    ]);

    const estadisticas = {
        total: medicamentos.length,
        enStock: medicamentos.filter(m => m.estado === 'disponible').length,
        stockBajo: medicamentos.filter(m => m.estado === 'bajo').length,
        agotados: medicamentos.filter(m => m.estado === 'agotado').length
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleBuscar = () => {
        console.log('Buscar:', busqueda, 'Filtro:', filtroEstado);
        // Aquí iría la lógica de búsqueda y filtrado
    };

    const handleAbrirActualizar = (medicamento) => {
        setMedicamentoSeleccionado(medicamento);
        setFormActualizar({
            tipoMovimiento: '',
            cantidad: '',
            motivo: '',
            stockMinimo: medicamento.stockMinimo
        });
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setMedicamentoSeleccionado(null);
        setFormActualizar({
            tipoMovimiento: '',
            cantidad: '',
            motivo: '',
            stockMinimo: ''
        });
    };

    const handleChangeForm = (e) => {
        setFormActualizar({
            ...formActualizar,
            [e.target.name]: e.target.value
        });
    };

    const handleActualizarStock = () => {
        if (!formActualizar.tipoMovimiento || !formActualizar.cantidad || !formActualizar.motivo) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        const cantidad = parseInt(formActualizar.cantidad);
        let nuevoStock = medicamentoSeleccionado.stockActual;

        // Calcular nuevo stock según tipo de movimiento
        if (formActualizar.tipoMovimiento === 'entrada') {
            nuevoStock += cantidad;
        } else if (formActualizar.tipoMovimiento === 'salida') {
            nuevoStock -= cantidad;
        } else if (formActualizar.tipoMovimiento === 'ajuste') {
            nuevoStock = cantidad;
        }

        // Determinar nuevo estado
        let nuevoEstado = 'disponible';
        if (nuevoStock === 0) {
            nuevoEstado = 'agotado';
        } else if (nuevoStock < formActualizar.stockMinimo) {
            nuevoEstado = 'bajo';
        }

        // Actualizar medicamento
        setMedicamentos(medicamentos.map(med => {
            if (med.id === medicamentoSeleccionado.id) {
                return {
                    ...med,
                    stockActual: nuevoStock,
                    stockMinimo: parseInt(formActualizar.stockMinimo),
                    estado: nuevoEstado
                };
            }
            return med;
        }));

        console.log('Actualizar stock:', {
            medicamento: medicamentoSeleccionado,
            movimiento: formActualizar,
            nuevoStock,
            nuevoEstado
        });

        // Aquí iría la llamada al backend
        handleCerrarModal();
    };

    const handleModalClick = (e) => {
        if (e.target.className === 'modal show') {
            handleCerrarModal();
        }
    };

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'badge-disponible';
            case 'bajo':
                return 'badge-bajo';
            case 'agotado':
                return 'badge-agotado';
            default:
                return '';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'Disponible';
            case 'bajo':
                return 'Stock Bajo';
            case 'agotado':
                return 'Agotado';
            default:
                return estado;
        }
    };

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    const medicamentosFiltrados = medicamentos.filter(med => {
        const matchBusqueda = med.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const matchEstado = filtroEstado === '' || med.estado === filtroEstado;
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
                    <h1>📦 Inventario de Medicamentos</h1>
                    <p>Gestiona y actualiza el stock de medicamentos del hospital</p>
                </div>

                {/* Estadísticas */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.total}</div>
                        <div className="stat-label">Total Medicamentos</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.enStock}</div>
                        <div className="stat-label">En Stock</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.stockBajo}</div>
                        <div className="stat-label">Stock Bajo</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{estadisticas.agotados}</div>
                        <div className="stat-label">Agotados</div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Inventario Actual</h2>

                    <div className="search-filter">
                        <input 
                            type="text" 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar medicamento por nombre..."
                        />
                        <select 
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="disponible">Disponible</option>
                            <option value="bajo">Stock Bajo</option>
                            <option value="agotado">Agotado</option>
                        </select>
                        <button className="btn btn-primary" onClick={handleBuscar}>
                            🔍 Buscar
                        </button>
                    </div>

                    <table className="medicamentos-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Medicamento</th>
                                <th>Presentación</th>
                                <th>Stock Actual</th>
                                <th>Stock Mínimo</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentosFiltrados.map((medicamento) => (
                                <tr key={medicamento.id}>
                                    <td><strong>{medicamento.id}</strong></td>
                                    <td>{medicamento.nombre}</td>
                                    <td>{medicamento.presentacion}</td>
                                    <td>{medicamento.stockActual}</td>
                                    <td>{medicamento.stockMinimo}</td>
                                    <td>{formatCurrency(medicamento.precio)}</td>
                                    <td>
                                        <span className={`badge ${getBadgeClass(medicamento.estado)}`}>
                                            {getEstadoTexto(medicamento.estado)}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-action"
                                            onClick={() => handleAbrirActualizar(medicamento)}
                                        >
                                            Actualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Actualizar Stock */}
            {modalAbierto && medicamentoSeleccionado && (
                <div 
                    className={`modal ${modalAbierto ? 'show' : ''}`}
                    onClick={handleModalClick}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>📦 Actualizar Inventario</h2>
                            <span className="close" onClick={handleCerrarModal}>&times;</span>
                        </div>

                        <div className="form-group">
                            <label>Medicamento</label>
                            <input 
                                type="text" 
                                value={`${medicamentoSeleccionado.nombre} ${medicamentoSeleccionado.presentacion}`}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Actual</label>
                            <input 
                                type="text" 
                                value={`${medicamentoSeleccionado.stockActual} unidades`}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Movimiento <span className="required">*</span></label>
                            <select 
                                name="tipoMovimiento"
                                value={formActualizar.tipoMovimiento}
                                onChange={handleChangeForm}
                            >
                                <option value="">Seleccione tipo</option>
                                <option value="entrada">Entrada (Agregar stock)</option>
                                <option value="salida">Salida (Reducir stock)</option>
                                <option value="ajuste">Ajuste de inventario</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantidad <span className="required">*</span></label>
                            <input 
                                type="number" 
                                name="cantidad"
                                value={formActualizar.cantidad}
                                onChange={handleChangeForm}
                                placeholder="Ingrese la cantidad"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Motivo <span className="required">*</span></label>
                            <input 
                                type="text" 
                                name="motivo"
                                value={formActualizar.motivo}
                                onChange={handleChangeForm}
                                placeholder="Ej: Compra nueva, Venta, Corrección"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Mínimo</label>
                            <input 
                                type="number" 
                                name="stockMinimo"
                                value={formActualizar.stockMinimo}
                                onChange={handleChangeForm}
                            />
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={handleActualizarStock}>
                                ✓ Actualizar Stock
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
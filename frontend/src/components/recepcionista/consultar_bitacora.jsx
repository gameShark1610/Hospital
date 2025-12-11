import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/consultar_bitacora.css';

const ConsultarBitacora = () => {
    const navigate = useNavigate();
    const [bitacoraData, setBitacoraData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/recepcionista/bitacora-citas', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setBitacoraData(data);
                } else {
                    console.error("Error al obtener bitacora");
                }
            } catch (error) {
                console.error("Error de conexion", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBitacora();
    }, []);

    const logout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    // Filter logic
    const filteredData = bitacoraData.filter(registro => {
        const matchDoctor = registro.medico.toLowerCase().includes(filterDoctor.toLowerCase());
        const matchStatus = registro.estatus.toLowerCase().includes(filterStatus.toLowerCase());

        let matchDate = true;
        if (filterDate) {
            const registroDate = new Date(registro.fechaMov).toISOString().split('T')[0];
            matchDate = registroDate === filterDate;
        }

        return matchDoctor && matchStatus && matchDate;
    });

    return (
        <div className="consultar-bitacora-container">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Recepción</div>
                    <div className="navbar-menu">
                        <button onClick={() => navigate('/recepcionista/paginaRecepcionista')} className="navbar-link">
                            ← Volver al Panel
                        </button>
                        <button onClick={logout} className="navbar-link logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>📔 Bitácora de Citas</h1>
                    <p>Registro histórico de movimientos de citas</p>
                </div>

                <div className="section">
                    <div className="filters-container" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                        <div className="form-group">
                            <label>Buscar por Doctor:</label>
                            <input
                                type="text"
                                placeholder="Nombre del doctor"
                                value={filterDoctor}
                                onChange={(e) => setFilterDoctor(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Filtrar por Estatus:</label>
                            <input
                                type="text"
                                placeholder="Ej. Confirmada, Pendiente"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p>Cargando registros...</p>
                    ) : (
                        <table className="bitacora-table">
                            <thead>
                                <tr>
                                    <th>Bitácora ID</th>
                                    <th>Fecha Movimiento</th>
                                    <th>Folio Cita</th>
                                    <th>Médico</th>
                                    <th>Estatus</th>
                                    <th>Política</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((registro) => (
                                        <tr key={registro.bitacoraId}>
                                            <td>{registro.bitacoraId}</td>
                                            <td>{new Date(registro.fechaMov).toLocaleString()}</td>
                                            <td>{registro.folioCita}</td>
                                            <td>{registro.medico}</td>
                                            <td>
                                                <span className={`status-badge ${registro.estatus ? registro.estatus.toLowerCase() : ''}`}>
                                                    {registro.estatus}
                                                </span>
                                            </td>
                                            <td>{registro.politica ? 'Sí' : 'No'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron registros cons los filtros seleccionados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultarBitacora;
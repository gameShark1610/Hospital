import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/consultar_bitacora.css';

const ConsultarBitacora = () => {
    const navigate = useNavigate();
    const [bitacoraData, setBitacoraData] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                {bitacoraData.length > 0 ? (
                                    bitacoraData.map((registro) => (
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
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No hay registros disponibles</td>
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
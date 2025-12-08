import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/perfil_recepcionista.css';

const PerfilRecepcionista = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Datos de la recepcionista - vendrían del backend
    const [datosRecepcionista, setDatosRecepcionista] = useState({
        nombreCompleto: '',
        numeroEmpleado: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        fechaIngreso: 'Desconocida', // No database field for this yet
        curp: '',
        numeroExtension: ''
    });

    React.useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/recepcionista/perfil', {
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    setDatosRecepcionista({
                        ...data,
                        fechaIngreso: 'Desconocida' // Keep default or remove if not needed
                    });
                } else {
                    console.error("Error fetching profile");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            }
        };
        fetchPerfil();
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleEditar = () => {
        if (isEditing) {
            // Guardar cambios - aquí iría la llamada al backend
            console.log('Guardando cambios:', datosRecepcionista);
            // Aquí iría la llamada API
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (campo, valor) => {
        setDatosRecepcionista({
            ...datosRecepcionista,
            [campo]: valor
        });
    };

    const handleCancelar = () => {
        setIsEditing(false);
        // Recargar datos originales del backend
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="/recepcionista/paginaRecepcionista" className="navbar-link">Principal</a>
                        <a href="/recepcionista/perfil" className="navbar-link active">Mi Perfil</a>
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
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">👩‍💼</div>
                        <h1 className="profile-name">{datosRecepcionista.nombreCompleto}</h1>
                        <p className="profile-role">Recepcionista</p>
                        <span className="profile-badge">✓ Cuenta Activa</span>
                    </div>

                    <div className="profile-body">
                        <h2 className="section-title">Información Personal</h2>

                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Nombre Completo</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="info-value"
                                        value={datosRecepcionista.nombreCompleto}
                                        onChange={(e) => handleChange('nombreCompleto', e.target.value)}
                                        style={{
                                            border: '2px solid #667eea',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="info-value">{datosRecepcionista.nombreCompleto}</div>
                                )}
                            </div>

                            <div className="info-item">
                                <span className="info-label">Número de Empleado</span>
                                <div className="info-value">{datosRecepcionista.numeroEmpleado}</div>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Correo Electrónico</span>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        className="info-value"
                                        value={datosRecepcionista.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        style={{
                                            border: '2px solid #667eea',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="info-value">{datosRecepcionista.email}</div>
                                )}
                            </div>

                            <div className="info-item">
                                <span className="info-label">Teléfono</span>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        className="info-value"
                                        value={datosRecepcionista.telefono}
                                        onChange={(e) => handleChange('telefono', e.target.value)}
                                        style={{
                                            border: '2px solid #667eea',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="info-value">{datosRecepcionista.telefono}</div>
                                )}
                            </div>

                            <div className="info-item">
                                <span className="info-label">Fecha Nacimiento</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="info-value"
                                        value={datosRecepcionista.fechaNacimiento}
                                        onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                                        style={{
                                            border: '2px solid #667eea',
                                            outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="info-value">{datosRecepcionista.fechaNacimiento}</div>
                                )}
                            </div>

                            <div className="info-item">
                                <span className="info-label">Numero Extension</span>
                                <div className="info-value">{datosRecepcionista.numeroExtension}</div>
                            </div>
                        </div>

                        <div className="button-group">
                            <button className="btn btn-primary" onClick={handleEditar}>
                                {isEditing ? '💾 Guardar Cambios' : '✏️ Editar Información'}
                            </button>
                            {isEditing && (
                                <button
                                    className="btn"
                                    onClick={handleCancelar}
                                    style={{
                                        background: '#e5e7eb',
                                        color: '#4b5563'
                                    }}
                                >
                                    ✕ Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PerfilRecepcionista;
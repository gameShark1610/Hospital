import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener esto si usas navigate
import '../../styles/doctor/citas.css';

const CitasDoctor = () => {
    const [citas, setCitas] = useState([]); // Estado para todas las citas
    const [activeTab, setActiveTab] = useState('todas');
    const navigate = useNavigate();

    // Verificar si el usuario está logueado
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        /* Nota: Si estás probando y no tienes el login listo, 
           comenta la redirección temporalmente 
        */
        if (!isLoggedIn || isLoggedIn !== "true") {
            // alert("Debes iniciar sesión para acceder a esta página");
            // navigate("/login");
            // return;
        }

        cargarCitas();
    }, [navigate]);

    const cargarCitas = async () => {
        try {
            // URL actualizada según tu curl
            const response = await fetch("http://localhost:8080/api/doctores/citasPendientes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
                credentials: "include" // Descomenta si usas cookies/sesiones reales
            });

            if (!response.ok) {
                throw new Error("Error al cargar las citas");
            }

            const data = await response.json();
            console.log("Datos recibidos del backend:", data); 
            
            setCitas(data);
        } catch (error) {
            console.error("Error al cargar las citas:", error);
            // Puedes dejar un estado vacío o mostrar un error en UI
            setCitas([]); 
        }
    };

    // Lógica de filtrado basada en el estado "citas" (ya no en la constante estática)
    const getFilteredCitas = () => {
        return citas.filter(cita => {
            if (activeTab === 'todas') return true;
            
            // Lógica para "Hoy"
            if (activeTab === 'hoy') {
                const hoy = new Date().toISOString().split('T')[0]; // "2025-12-06"
                return cita.fechaAgendada === hoy;
            }

            // Lógica para estatus (ajustada a los valores de tu backend: pending, confirmed, etc.)
            if (activeTab === 'pendientes') {
                return cita.estatus === 'pending' || cita.estatus === 'confirmed';
            }
            if (activeTab === 'completadas') {
                return cita.estatus === 'completed';
            }
            return true;
        });
    };

    const filteredCitas = getFilteredCitas();

    // Función auxiliar para formatear la fecha que viene "2025-11-11"
    const formatFecha = (fechaString) => {
        if (!fechaString) return { dia: '--', mes: '--', anno: '--' };
        // Crear fecha asegurando zona horaria correcta o split simple
        const [year, month, day] = fechaString.split('-'); 
        const dateObj = new Date(year, month - 1, day);
        
        return {
            dia: day,
            mes: dateObj.toLocaleString('es-ES', { month: 'short' }), // 'nov'
            anno: year
        };
    };

    const handleAtenderCita = (citaId) => {
        // window.location.href = `/atender-cita/${citaId}`;
        navigate(`/doctor/atender`);
    };

    const handleVerHistorial = (citaId) => {
        navigate(`/historial-pacientes`);
    };

    const handleCancelar = (citaId) => {
        if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
            console.log('Cancelar cita ID:', citaId);
            // Aquí agregarías el fetch DELETE o PUT para cancelar
        }
    };

    // Ajustado a los valores en Inglés que retorna tu API
    const getStatusClass = (estado) => {
        switch(estado) {
            case 'pending': return 'status-pendiente'; // Asegúrate que en CSS exista esta clase
            case 'confirmed': return 'status-confirmada';
            case 'completed': return 'status-completada';
            case 'cancelled': return 'status-cancelada'; // Agrega estilo rojo en CSS si no existe
            default: return '';
        }
    };

    const getStatusText = (estado) => {
        switch(estado) {
            case 'pending': return 'Pendiente';
            case 'confirmed': return 'Confirmada';
            case 'completed': return 'Completada';
            case 'cancelled': return 'Cancelada';
            default: return estado;
        }
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
                    <h1>📋 Citas Pendientes</h1>
                    <p>Gestiona tus consultas programadas</p>
                </div>

                <div className="filter-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'todas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('todas')}
                    >
                        Todas
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'hoy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hoy')}
                    >
                        Hoy
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'pendientes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pendientes')}
                    >
                        Pendientes
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'completadas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completadas')}
                    >
                        Completadas
                    </button>
                </div>

                <div className="citas-grid">
                    {filteredCitas.length === 0 && <p style={{textAlign:'center', width:'100%'}}>No hay citas para mostrar.</p>}
                    
                    {filteredCitas.map(cita => {
                        const fechaObj = formatFecha(cita.fechaAgendada);
                        return (
                            <div key={cita.doctorId + '-' + cita.fechaAgendada} className="cita-card">
                                <div className="cita-fecha">
                                    <div className="dia">{fechaObj.dia}</div>
                                    <div className="mes">{fechaObj.mes}</div>
                                    <div>{fechaObj.anno}</div>
                                </div>

                                <div className="cita-info">
                                    <span className={`status-badge ${getStatusClass(cita.estatus)}`}>
                                        {getStatusText(cita.estatus)}
                                    </span>
                                    {/* Mapeo correcto de las propiedades del JSON */}
                                    <h3>{cita.nombrePaciente}</h3>
                                    {/* Tu API no devuelve 'tipo' de consulta, puedes poner un default o pedirlo al back */}
                                    <p>Consulta General</p> 
                                    
                                    <div className="cita-detalles">
                                        <span>🕐 {cita.horario}</span>
                                        <span>🏥 Cons. {cita.numConsultorio}</span>
                                        <span>📞 {cita.telefono}</span>
                                    </div>
                                </div>

                                <div className="cita-actions">
                                    {cita.estatus !== 'completed' && cita.estatus !== 'cancelled' && (
                                        <>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleAtenderCita(cita.citasId)} // Ojo: ¿el ID de la cita es doctorId? Usualmente hay un citaId único.
                                            >
                                                Atender
                                            </button>
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={() => handleVerHistorial(cita.doctorId)}
                                            >
                                                Historial
                                            </button>
                                            <button 
                                                className="btn btn-cancel"
                                                onClick={() => handleCancelar(cita.doctorId)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                    {(cita.estatus === 'completed' || cita.estatus === 'cancelled') && (
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => handleVerHistorial(cita.doctorId)}
                                        >
                                            Ver Detalles
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CitasDoctor;
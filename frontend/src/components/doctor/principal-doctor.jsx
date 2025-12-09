import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/doctor/principalDoctor.css';

const DashboardDoctor = () => {
    const navigate = useNavigate();
    const [citasHoyList, setCitasHoyList] = useState([]);
    const [doctorName, setDoctorName] = useState("Doctor"); // Estado para el nombre

    // Estado para las estadísticas
    const [stats, setStats] = useState({
        citasHoy: 0,
        citasPendientes: 0,
        pacientesAtendidos: 0,
        proximaCita: '--:--'
    });

    // Fecha actual para mostrar en el encabezado
    const fechaActualTexto = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // 1. Obtener datos al cargar
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        /* Descomentar validación de sesión cuando esté lista
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        */
        cargarDatosDashboard();
    }, [navigate]);

    const cargarDatosDashboard = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/doctores/citasPendientes", {
                method: "GET",
                headers: { "Content-Type": "application/json", "accept": "*/*" },
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al conectar con el servidor");

            const data = await response.json();
            procesarDatos(data);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    // 2. Procesar los datos crudos del Backend
    const procesarDatos = (data) => {
        // Obtener fecha de hoy en formato YYYY-MM-DD (igual que el backend)
        const hoyString = new Date().toISOString().split('T')[0];

        // Si hay datos, tomamos el nombre del doctor del primer registro
        if (data.length > 0 && data[0].nombreDoctor) {
            setDoctorName(data[0].nombreDoctor);
        }

        // Filtrar citas de HOY
        const citasDeHoy = data.filter(c => c.fechaAgendada === hoyString);

        // Calcular Estadísticas
        const pendientesTotal = data.filter(c => c.estatus === 'confirmed').length;
        const atendidosTotal = data.filter(c => c.estatus === 'completed').length;

        // Lógica para "Próxima Cita" (la primera de hoy que sea pendiente)
        // Nota: Esto asume que el backend devuelve las horas ordenadas, sino habría que ordenar.
        const proxima = citasDeHoy.find(c => c.estatus === 'confirmed');
        const horaProxima = proxima ? proxima.horario.split('-')[0].substring(0, 5) : '--:--';

        setStats({
            citasHoy: citasDeHoy.length,
            citasPendientes: pendientesTotal,
            pacientesAtendidos: atendidosTotal, // Nota: Si el endpoint solo trae pendientes, esto será 0
            proximaCita: horaProxima
        });

        setCitasHoyList(citasDeHoy);
    };

    // 3. Auxiliar para formatear "08:20:00-08:40:00" a Hora y AM/PM
    const formatTimeInfo = (rangoHorario) => {
        if (!rangoHorario) return { hora: '--:--', periodo: '--' };

        // Tomamos la hora de inicio "08:20:00"
        const horaInicio = rangoHorario.split('-')[0];
        const [hour, minute] = horaInicio.split(':');

        const h = parseInt(hour, 10);
        const periodo = h >= 12 ? 'PM' : 'AM';
        const hora12 = h % 12 || 12; // Convertir 0 a 12

        return {
            hora: `${hora12}:${minute}`,
            periodo: periodo
        };
    };

    const handleAtender = (cita) => {
        console.log('Atender cita del paciente:', cita.nombrePaciente);
        // Como tu DTO actual no tiene CitaId, usaremos doctorId temporalmente o el índice
        navigate(`/atender-cita/${cita.doctorId}`);
    };

    const handleVerHistorial = (cita) => {
        navigate('/doctor/historial-pacientes');
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
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="#" className="navbar-link active">Principal</a>
                        <a href="/doctor/citas" className="navbar-link">Citas por atender</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
                        <a href="/doctor/citas-agendar" className="navbar-link">Agendar Cita (Paciente)</a>
                        <a href="/doctor/mis-citas" className="navbar-link">Mis Citas</a>
                        <a href="/doctor/perfil" className="navbar-link">Mi Perfil</a>
                        <a href="#" onClick={handleLogout} className="navbar-link logout">Cerrar Sesión</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="welcome-section">
                    {/* Nombre dinámico traído del backend */}
                    <h1>👋 Bienvenido, {doctorName}</h1>
                    <p className="capitalize">{fechaActualTexto}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Citas Hoy</h3>
                        <div className="number">{stats.citasHoy}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Citas Pendientes</h3>
                        <div className="number">{stats.citasPendientes}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Pacientes Atendidos</h3>
                        <div className="number">{stats.pacientesAtendidos}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Próxima Cita</h3>
                        <div className="number">{stats.proximaCita}</div>
                    </div>
                </div>

                <div className="citas-hoy">
                    <h2>📅 Citas de Hoy</h2>

                    {citasHoyList.length > 0 ? (
                        citasHoyList.map((cita, index) => {
                            const timeInfo = formatTimeInfo(cita.horario);
                            return (
                                /* Usamos index como key fallback porque el DTO le falta CitaId único */
                                <div key={index} className="cita-item">
                                    <div className="cita-hora">
                                        <div>{timeInfo.hora}</div>
                                        <div style={{ fontSize: '0.8rem' }}>{timeInfo.periodo}</div>
                                    </div>
                                    <div className="cita-info">
                                        <h3>{cita.nombrePaciente}</h3>
                                        {/* El backend no manda 'tipo' de consulta aun, hardcodeamos o usamos consultorio */}
                                        <p>Consulta General - Cons. {cita.numConsultorio}</p>
                                    </div>
                                    <div className="cita-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAtender(cita)}
                                        >
                                            Atender
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleVerHistorial(cita)}
                                        >
                                            Ver Historial
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📅</div>
                            <p>No tienes citas programadas para hoy.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardDoctor;
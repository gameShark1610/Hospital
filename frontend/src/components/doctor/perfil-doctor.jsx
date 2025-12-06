import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/doctor/historial_pacientes.css';

const PerfilDoctor = () => {
    const navigate = useNavigate();

    // Estado para controlar si los campos están en modo edición
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingProfesional, setIsEditingProfesional] = useState(false);

    // Datos del doctor - estos vendrían del backend
    const [datosPersonales, setDatosPersonales] = useState({
        nombre: 'Alberto',
        apellidos: 'García Martínez',
        cedula: '12345678',
        especialidad: 'Cardiología',
        telefono: '(555) 111-2222',
        email: 'garcia.martinez@hospital.com'
    });

    const [datosProfesionales, setDatosProfesionales] = useState({
        experiencia: '15 años',
        consultorio: '301-A',
        formacion: `Universidad Nacional Autónoma de México (UNAM) - Medicina General
Hospital General de México - Especialidad en Cardiología
Certificación del Consejo Mexicano de Cardiología`,
        horario: `Lunes a Viernes: 8:00 AM - 4:00 PM
Sábados: 9:00 AM - 1:00 PM`
    });

    const estadisticas = {
        pacientesAtendidos: 127,
        consultasRealizadas: 152
    };

    const handleEditPersonal = () => {
        if (isEditingPersonal) {
            // Guardar cambios (aquí iría la llamada al backend)
            console.log('Guardando datos personales:', datosPersonales);
        }
        setIsEditingPersonal(!isEditingPersonal);
    };

    const handleEditProfesional = () => {
        if (isEditingProfesional) {
            // Guardar cambios (aquí iría la llamada al backend)
            console.log('Guardando datos profesionales:', datosProfesionales);
        }
        setIsEditingProfesional(!isEditingProfesional);
    };

    const handleChangePersonal = (e) => {
        setDatosPersonales({
            ...datosPersonales,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeProfesional = (e) => {
        setDatosProfesionales({
            ...datosProfesionales,
            [e.target.name]: e.target.value
        });
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Doctor</div>
                    <div className="navbar-menu">
                        <a href="/doctor/principalDoctor" className="navbar-link">Principal</a>
                        <a href="/doctor/citas" className="navbar-link">Citas por atender</a>
                        <a href="/doctor/historial-pacientes" className="navbar-link">Historial Pacientes</a>
                        <a href="/doctor/citas-agendar" className="navbar-link">
                            Agendar Cita (Paciente)
                        </a>
                        <a href="/doctor/mis-citas" className="navbar-link">Mis Citas</a>
                        <a href="/doctor/perfil" className="navbar-link active">Mi Perfil</a>
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
                <div className="profile-header">
                    <div className="profile-avatar">👨‍⚕️</div>
                    <div className="profile-info">
                        <h1>Dr. {datosPersonales.apellidos}</h1>
                        <p>{datosPersonales.email}</p>
                    </div>
                </div>

                {/* Información Personal */}
                <div className="profile-section">
                    <h2 className="section-title">👤 Información Personal</h2>
                    
                    <div className="info-box">
                        <p>💡 Haz clic en "Editar" para modificar tu información</p>
                    </div>

                    <form>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre(s)</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={datosPersonales.nombre}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellidos</label>
                                <input 
                                    type="text" 
                                    name="apellidos"
                                    value={datosPersonales.apellidos}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Cédula Profesional</label>
                                <input 
                                    type="text" 
                                    name="cedula"
                                    value={datosPersonales.cedula}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                            <div className="form-group">
                                <label>Especialidad</label>
                                <input 
                                    type="text" 
                                    name="especialidad"
                                    value={datosPersonales.especialidad}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input 
                                    type="tel" 
                                    name="telefono"
                                    value={datosPersonales.telefono}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={datosPersonales.email}
                                    onChange={handleChangePersonal}
                                    disabled={!isEditingPersonal}
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={handleEditPersonal}
                            >
                                {isEditingPersonal ? 'Guardar' : 'Editar'}
                            </button>
                            {isEditingPersonal && (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditingPersonal(false)}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Información Profesional */}
                <div className="profile-section">
                    <h2 className="section-title">🩺 Información Profesional</h2>
                    
                    <form>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Años de Experiencia</label>
                                <input 
                                    type="text" 
                                    name="experiencia"
                                    value={datosProfesionales.experiencia}
                                    onChange={handleChangeProfesional}
                                    disabled={!isEditingProfesional}
                                />
                            </div>
                            <div className="form-group">
                                <label>Consultorio Asignado</label>
                                <input 
                                    type="text" 
                                    name="consultorio"
                                    value={datosProfesionales.consultorio}
                                    onChange={handleChangeProfesional}
                                    disabled={!isEditingProfesional}
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Formación Académica</label>
                            <textarea 
                                name="formacion"
                                value={datosProfesionales.formacion}
                                onChange={handleChangeProfesional}
                                disabled={!isEditingProfesional}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Horario de Atención</label>
                            <textarea 
                                name="horario"
                                value={datosProfesionales.horario}
                                onChange={handleChangeProfesional}
                                disabled={!isEditingProfesional}
                            />
                        </div>

                        <div className="button-group">
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={handleEditProfesional}
                            >
                                {isEditingProfesional ? 'Guardar' : 'Editar'}
                            </button>
                            {isEditingProfesional && (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditingProfesional(false)}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Estadísticas */}
                <div className="profile-section">
                    <h2 className="section-title">📊 Estadísticas del Mes</h2>
                    
                    <div className="form-row">
                        <div className="stat-card">
                            <div className="stat-number">{estadisticas.pacientesAtendidos}</div>
                            <div className="stat-label">Pacientes Atendidos</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{estadisticas.consultasRealizadas}</div>
                            <div className="stat-label">Consultas Realizadas</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PerfilDoctor;
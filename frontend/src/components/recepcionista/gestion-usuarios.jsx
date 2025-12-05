import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/gestion_usuarios.css';

const GestionUsuarios = () => {
    const navigate = useNavigate();
    const [tabActivo, setTabActivo] = useState('alta');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [busquedaUsuario, setBusquedaUsuario] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [mostrarError, setMostrarError] = useState(false);

    // Estados para formularios
    const [formDoctor, setFormDoctor] = useState({
        nombre: '',
        apellidos: '',
        cedula: '',
        especialidad: '',
        telefono: '',
        email: '',
        horario: ''
    });

    const [formPaciente, setFormPaciente] = useState({
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: '',
        telefono: '',
        email: '',
        tipoSangre: '',
        alergias: '',
        direccion: ''
    });

    const [formRecepcionista, setFormRecepcionista] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        turno: '',
        fechaIngreso: ''
    });

    const [motivoBaja, setMotivoBaja] = useState('');

    const handleLogout = () => {
        navigate('/login');
    };

    const cambiarTab = (tab) => {
        setTabActivo(tab);
        // Limpiar formularios al cambiar de tab
        setTipoUsuario('');
        setUsuarioEncontrado(null);
        setMostrarError(false);
    };

    const handleChangeTipo = (e) => {
        setTipoUsuario(e.target.value);
    };

    const handleChangeDoctor = (e) => {
        setFormDoctor({
            ...formDoctor,
            [e.target.name]: e.target.value
        });
    };

    const handleChangePaciente = (e) => {
        setFormPaciente({
            ...formPaciente,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeRecepcionista = (e) => {
        setFormRecepcionista({
            ...formRecepcionista,
            [e.target.name]: e.target.value
        });
    };

    const handleRegistrar = () => {
        console.log('Registrar usuario tipo:', tipoUsuario);
        if (tipoUsuario === 'doctor') {
            console.log('Datos doctor:', formDoctor);
        } else if (tipoUsuario === 'paciente') {
            console.log('Datos paciente:', formPaciente);
        } else if (tipoUsuario === 'recepcionista') {
            console.log('Datos recepcionista:', formRecepcionista);
        }
        // Aquí iría la llamada al backend
    };

    const handleBuscarUsuario = () => {
        console.log('Buscar usuario:', busquedaUsuario);
        // Simulación de búsqueda - aquí iría la llamada al backend
        // Ejemplo con usuario que tiene citas
        // setMostrarError(true);
        // setUsuarioEncontrado(null);
        
        // Ejemplo con usuario sin citas
        setUsuarioEncontrado({
            id: 'D-12345',
            nombre: 'Dr. Carlos Ramírez López',
            tipo: 'Doctor',
            especialidad: 'Cardiología',
            citasActivas: 0,
            estado: 'Activo'
        });
        setMostrarError(false);
    };

    const handleDarDeBaja = () => {
        console.log('Dar de baja usuario:', usuarioEncontrado);
        console.log('Motivo:', motivoBaja);
        // Aquí iría la llamada al backend
    };

    const handleCancelar = () => {
        // Limpiar formularios
        setTipoUsuario('');
        setFormDoctor({
            nombre: '',
            apellidos: '',
            cedula: '',
            especialidad: '',
            telefono: '',
            email: '',
            horario: ''
        });
        setFormPaciente({
            nombre: '',
            apellidos: '',
            fechaNacimiento: '',
            genero: '',
            telefono: '',
            email: '',
            tipoSangre: '',
            alergias: '',
            direccion: ''
        });
        setFormRecepcionista({
            nombre: '',
            apellidos: '',
            telefono: '',
            email: '',
            turno: '',
            fechaIngreso: ''
        });
        setUsuarioEncontrado(null);
        setMotivoBaja('');
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
                    <h1>👥 Gestión de Usuarios</h1>
                    <p>Alta y baja de doctores, pacientes y recepcionistas</p>
                </div>

                <div className="tabs">
                    <div 
                        className={`tab ${tabActivo === 'alta' ? 'active' : ''}`}
                        onClick={() => cambiarTab('alta')}
                    >
                        ➕ Dar de Alta
                    </div>
                    <div 
                        className={`tab ${tabActivo === 'baja' ? 'active' : ''}`}
                        onClick={() => cambiarTab('baja')}
                    >
                        ➖ Dar de Baja
                    </div>
                </div>

                {/* TAB: DAR DE ALTA */}
                {tabActivo === 'alta' && (
                    <div className="tab-content active">
                        <div className="section">
                            <h2 className="section-title">Registrar Nuevo Usuario</h2>

                            <div className="form-group">
                                <label>Tipo de Usuario <span className="required">*</span></label>
                                <select value={tipoUsuario} onChange={handleChangeTipo}>
                                    <option value="">Seleccione un tipo</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="paciente">Paciente</option>
                                    <option value="recepcionista">Recepcionista</option>
                                </select>
                            </div>

                            {/* FORMULARIO DOCTOR */}
                            {tipoUsuario === 'doctor' && (
                                <>
                                    <h3 className="form-subtitle">Datos del Doctor</h3>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="nombre"
                                                value={formDoctor.nombre}
                                                onChange={handleChangeDoctor}
                                                placeholder="Nombre del doctor"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="apellidos"
                                                value={formDoctor.apellidos}
                                                onChange={handleChangeDoctor}
                                                placeholder="Apellidos del doctor"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Cédula Profesional <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="cedula"
                                                value={formDoctor.cedula}
                                                onChange={handleChangeDoctor}
                                                placeholder="Número de cédula"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Especialidad <span className="required">*</span></label>
                                            <select 
                                                name="especialidad"
                                                value={formDoctor.especialidad}
                                                onChange={handleChangeDoctor}
                                            >
                                                <option value="">Seleccione especialidad</option>
                                                <option value="cardiologia">Cardiología</option>
                                                <option value="pediatria">Pediatría</option>
                                                <option value="general">Medicina General</option>
                                                <option value="traumatologia">Traumatología</option>
                                                <option value="dermatologia">Dermatología</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input 
                                                type="tel" 
                                                name="telefono"
                                                value={formDoctor.telefono}
                                                onChange={handleChangeDoctor}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Correo Electrónico <span className="required">*</span></label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formDoctor.email}
                                                onChange={handleChangeDoctor}
                                                placeholder="doctor@hospital.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Horario de Atención</label>
                                        <input 
                                            type="text" 
                                            name="horario"
                                            value={formDoctor.horario}
                                            onChange={handleChangeDoctor}
                                            placeholder="Ej: Lunes a Viernes 9:00 AM - 5:00 PM"
                                        />
                                    </div>
                                </>
                            )}

                            {/* FORMULARIO PACIENTE */}
                            {tipoUsuario === 'paciente' && (
                                <>
                                    <h3 className="form-subtitle">Datos del Paciente</h3>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="nombre"
                                                value={formPaciente.nombre}
                                                onChange={handleChangePaciente}
                                                placeholder="Nombre del paciente"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="apellidos"
                                                value={formPaciente.apellidos}
                                                onChange={handleChangePaciente}
                                                placeholder="Apellidos del paciente"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha de Nacimiento <span className="required">*</span></label>
                                            <input 
                                                type="date" 
                                                name="fechaNacimiento"
                                                value={formPaciente.fechaNacimiento}
                                                onChange={handleChangePaciente}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Género <span className="required">*</span></label>
                                            <select 
                                                name="genero"
                                                value={formPaciente.genero}
                                                onChange={handleChangePaciente}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="masculino">Masculino</option>
                                                <option value="femenino">Femenino</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input 
                                                type="tel" 
                                                name="telefono"
                                                value={formPaciente.telefono}
                                                onChange={handleChangePaciente}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Correo Electrónico</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formPaciente.email}
                                                onChange={handleChangePaciente}
                                                placeholder="paciente@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tipo de Sangre</label>
                                            <select 
                                                name="tipoSangre"
                                                value={formPaciente.tipoSangre}
                                                onChange={handleChangePaciente}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Alergias</label>
                                            <input 
                                                type="text" 
                                                name="alergias"
                                                value={formPaciente.alergias}
                                                onChange={handleChangePaciente}
                                                placeholder="Ej: Penicilina, Polen"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Dirección</label>
                                        <textarea 
                                            name="direccion"
                                            value={formPaciente.direccion}
                                            onChange={handleChangePaciente}
                                            placeholder="Dirección completa del paciente"
                                        />
                                    </div>
                                </>
                            )}

                            {/* FORMULARIO RECEPCIONISTA */}
                            {tipoUsuario === 'recepcionista' && (
                                <>
                                    <h3 className="form-subtitle">Datos de la Recepcionista</h3>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="nombre"
                                                value={formRecepcionista.nombre}
                                                onChange={handleChangeRecepcionista}
                                                placeholder="Nombre"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellidos <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                name="apellidos"
                                                value={formRecepcionista.apellidos}
                                                onChange={handleChangeRecepcionista}
                                                placeholder="Apellidos"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input 
                                                type="tel" 
                                                name="telefono"
                                                value={formRecepcionista.telefono}
                                                onChange={handleChangeRecepcionista}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Correo Electrónico <span className="required">*</span></label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formRecepcionista.email}
                                                onChange={handleChangeRecepcionista}
                                                placeholder="recepcion@hospital.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Turno <span className="required">*</span></label>
                                            <select 
                                                name="turno"
                                                value={formRecepcionista.turno}
                                                onChange={handleChangeRecepcionista}
                                            >
                                                <option value="">Seleccione turno</option>
                                                <option value="matutino">Matutino (7:00 AM - 3:00 PM)</option>
                                                <option value="vespertino">Vespertino (3:00 PM - 11:00 PM)</option>
                                                <option value="nocturno">Nocturno (11:00 PM - 7:00 AM)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Fecha de Ingreso <span className="required">*</span></label>
                                            <input 
                                                type="date" 
                                                name="fechaIngreso"
                                                value={formRecepcionista.fechaIngreso}
                                                onChange={handleChangeRecepcionista}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {tipoUsuario && (
                                <div className="action-buttons">
                                    <button className="btn btn-primary" onClick={handleRegistrar}>
                                        ✓ Registrar Usuario
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancelar}>
                                        ✕ Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: DAR DE BAJA */}
                {tabActivo === 'baja' && (
                    <div className="tab-content active">
                        <div className="section">
                            <h2 className="section-title">Dar de Baja Usuario</h2>

                            <div className="alert alert-warning">
                                <strong>⚠️ Importante:</strong> El sistema verificará automáticamente que el usuario no tenga citas asignadas antes de proceder con la baja. El historial del usuario se conservará.
                            </div>

                            <div className="search-section">
                                <label>Buscar Usuario por ID o Nombre</label>
                                <div className="search-bar">
                                    <input 
                                        type="text" 
                                        value={busquedaUsuario}
                                        onChange={(e) => setBusquedaUsuario(e.target.value)}
                                        placeholder="Ingrese ID o nombre completo del usuario"
                                    />
                                    <button className="btn btn-primary" onClick={handleBuscarUsuario}>
                                        🔍 Buscar
                                    </button>
                                </div>
                            </div>

                            {/* Resultado de búsqueda */}
                            {usuarioEncontrado && (
                                <div className="user-info-box">
                                    <h3 style={{color: '#1e40af', marginBottom: '15px'}}>
                                        Usuario Encontrado
                                    </h3>
                                    <div className="user-info-grid">
                                        <div className="info-item">
                                            <strong>ID Usuario:</strong>
                                            <span>{usuarioEncontrado.id}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Nombre Completo:</strong>
                                            <span>{usuarioEncontrado.nombre}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Tipo:</strong>
                                            <span>{usuarioEncontrado.tipo}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Especialidad:</strong>
                                            <span>{usuarioEncontrado.especialidad}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Citas Activas:</strong>
                                            <span style={{color: '#059669', fontWeight: 600}}>
                                                {usuarioEncontrado.citasActivas} citas
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Estado:</strong>
                                            <span style={{color: '#059669', fontWeight: 600}}>
                                                ✓ {usuarioEncontrado.estado}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{marginTop: '20px'}}>
                                        <label>Motivo de Baja <span className="required">*</span></label>
                                        <textarea 
                                            value={motivoBaja}
                                            onChange={(e) => setMotivoBaja(e.target.value)}
                                            placeholder="Especifique el motivo de la baja del usuario"
                                        />
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn btn-danger" onClick={handleDarDeBaja}>
                                            🗑️ Dar de Baja Usuario
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleCancelar}>
                                            ✕ Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Mensaje cuando tiene citas */}
                            {mostrarError && (
                                <div className="alert alert-error">
                                    <strong>❌ No se puede dar de baja:</strong> El usuario tiene 5 citas activas asignadas. Debe reagendar o cancelar las citas antes de proceder con la baja.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GestionUsuarios;
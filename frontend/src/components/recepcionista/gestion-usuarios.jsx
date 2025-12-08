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

    // Estados para formularios actualizados con Paterno, Materno y Password
    const [formDoctor, setFormDoctor] = useState({
        nombre: '',
        paterno: '',
        materno: '',
        fechaNac: '',
        sexo: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
        // Historial Medico
        tipoSangre: '',
        peso: '',
        estatura: '',
        // Empleado
        sueldo: '',
        curp: '',
        horarioId: '',
        // Doctor
        cedula: '',
        especialidadId: '',
        consultorioId: ''
    });

    const [formPaciente, setFormPaciente] = useState({
        nombre: '',
        paterno: '',
        materno: '',
        fechaNac: '',
        sexo: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
        // Extras de paciente
        tipoSangre: '',
        alergias: '',
        direccion: ''
    });

    const [formRecepcionista, setFormRecepcionista] = useState({
        nombre: '',
        paterno: '',
        materno: '',
        fechaNac: '',
        sexo: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
        sueldo: '',
        curp: '',
        horarioId: '',
        numeroExtension: ''
    });

    const [motivoBaja, setMotivoBaja] = useState('');

    // Listas para dropdowns
    const [especialidades, setEspecialidades] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [consultorios, setConsultorios] = useState([]);

    React.useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [espRes, horRes, conRes] = await Promise.all([
                    fetch("http://localhost:8080/api/especialidad", { credentials: "include" }),
                    fetch("http://localhost:8080/api/options/horarios", { credentials: "include" }),
                    fetch("http://localhost:8080/api/options/consultorios", { credentials: "include" })
                ]);

                if (espRes.ok) setEspecialidades(await espRes.json());
                if (horRes.ok) setHorarios(await horRes.json());
                if (conRes.ok) setConsultorios(await conRes.json());
            } catch (err) {
                console.error("Error fetching options:", err);
            }
        };
        fetchOptions();
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const cambiarTab = (tab) => {
        setTabActivo(tab);
        setTipoUsuario('');
        setUsuarioEncontrado(null);
        setMostrarError(false);
    };

    const handleChangeTipo = (e) => {
        setTipoUsuario(e.target.value);
    };

    const handleChangeDoctor = (e) => {
        setFormDoctor({ ...formDoctor, [e.target.name]: e.target.value });
    };

    const handleChangePaciente = (e) => {
        setFormPaciente({ ...formPaciente, [e.target.name]: e.target.value });
    };

    const handleChangeRecepcionista = (e) => {
        setFormRecepcionista({ ...formRecepcionista, [e.target.name]: e.target.value });
    };

    // Función unificada para registrar
    const handleRegistrar = async () => {
        let datosFormulario;
        let tipoId;
        let endpoint = "http://localhost:8080/api/auth/register";

        // Selección de datos según el tipo
        if (tipoUsuario === 'doctor') {
            datosFormulario = formDoctor;
            tipoId = 2; // Asumiendo ID 2 para Doctor
            endpoint = "http://localhost:8080/api/auth/register/doctor";
        } else if (tipoUsuario === 'paciente') {
            datosFormulario = formPaciente;
            tipoId = 1; // ID 1 para Paciente
        } else if (tipoUsuario === 'recepcionista') {
            datosFormulario = formRecepcionista;
            tipoId = 3; // Asumiendo ID 3 para Recepcionista
            endpoint = "http://localhost:8080/api/auth/register/recepcionista";
        }

        // Validación básica de contraseñas
        if (datosFormulario.password !== datosFormulario.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        let dataToSend;

        if (tipoUsuario === 'doctor') {
            dataToSend = {
                // Base
                correo: datosFormulario.correo,
                password: datosFormulario.password,
                tipoUsuarioId: 2,
                nombre: datosFormulario.nombre,
                paterno: datosFormulario.paterno,
                materno: datosFormulario.materno,
                fechaNacim: datosFormulario.fechaNac,
                sexo: datosFormulario.sexo,
                telefono: datosFormulario.telefono,
                // Historial
                tipoSangre: datosFormulario.tipoSangre,
                peso: datosFormulario.peso,
                estatura: datosFormulario.estatura,
                // Empleado
                sueldo: datosFormulario.sueldo,
                curp: datosFormulario.curp,
                horarioId: datosFormulario.horarioId,
                // Doctor
                numCedula: datosFormulario.cedula,
                especialidadId: datosFormulario.especialidadId,
                consultorioId: datosFormulario.consultorioId
            }
        } else if (tipoUsuario === 'recepcionista') {
            dataToSend = {
                // Base
                correo: datosFormulario.correo,
                password: datosFormulario.password,
                tipoUsuarioId: 3,
                nombre: datosFormulario.nombre,
                paterno: datosFormulario.paterno,
                materno: datosFormulario.materno,
                fechaNacim: datosFormulario.fechaNac,
                sexo: datosFormulario.sexo,
                telefono: datosFormulario.telefono,
                // Empleado
                sueldo: datosFormulario.sueldo,
                curp: datosFormulario.curp,
                horarioId: datosFormulario.horarioId,
                // Recepcionista
                numeroExtension: datosFormulario.numeroExtension
            }
        } else {
            dataToSend = {
                correo: datosFormulario.correo,
                password: datosFormulario.password,
                tipoUsuarioId: tipoId,
                nombre: datosFormulario.nombre,
                paterno: datosFormulario.paterno,
                materno: datosFormulario.materno,
                fechaNacim: datosFormulario.fechaNac,
                sexo: datosFormulario.sexo,
                telefono: datosFormulario.telefono
            };
        }


        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Importante: enviar cookies de sesión
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al registrar");
            }

            alert("Usuario registrado exitosamente");
            handleCancelar(); // Limpiar formulario

        } catch (error) {
            alert(error.message);
            console.error("Error:", error);
        }
    };

    const handleBuscarUsuario = () => {
        // ... (Tu lógica de búsqueda simulada se mantiene igual)
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
        console.log('Dar de baja:', usuarioEncontrado?.id);
        // Lógica de baja
    };

    const handleCancelar = () => {
        setTipoUsuario('');
        // Reiniciar todos los estados a vacío
        const emptyState = (obj) => Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
        setFormDoctor(emptyState(formDoctor));
        setFormPaciente(emptyState(formPaciente));
        setFormRecepcionista(emptyState(formRecepcionista));
        setUsuarioEncontrado(null);
    };

    // Fecha máxima para validación de edad (opcional)
    const getFechaMaxima = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">🏥 Hospital - Panel Recepcionista</div>
                    <div className="navbar-menu">
                        <a href="/recepcionista/principal" className="navbar-link">← Volver al Panel</a>
                        <a href="#" onClick={handleLogout} className="navbar-link logout">Cerrar Sesión</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="page-header">
                    <h1>👥 Gestión de Usuarios</h1>
                    <p>Alta y baja de doctores, pacientes y recepcionistas</p>
                </div>

                <div className="tabs">
                    <div className={`tab ${tabActivo === 'alta' ? 'active' : ''}`} onClick={() => cambiarTab('alta')}>
                        ➕ Dar de Alta
                    </div>
                    <div className={`tab ${tabActivo === 'baja' ? 'active' : ''}`} onClick={() => cambiarTab('baja')}>
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

                            {/* ================= FORMULARIO DOCTOR ================= */}
                            {tipoUsuario === 'doctor' && (
                                <>
                                    <h3 className="form-subtitle">Datos Personales y Cuenta (Doctor)</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input type="text" name="nombre" value={formDoctor.nombre} onChange={handleChangeDoctor} placeholder="Nombre" />
                                        </div>
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input type="tel" name="telefono" value={formDoctor.telefono} onChange={handleChangeDoctor} placeholder="555-1234" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Apellido Paterno <span className="required">*</span></label>
                                            <input type="text" name="paterno" value={formDoctor.paterno} onChange={handleChangeDoctor} placeholder="Pérez" />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellido Materno <span className="required">*</span></label>
                                            <input type="text" name="materno" value={formDoctor.materno} onChange={handleChangeDoctor} placeholder="García" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha Nacimiento <span className="required">*</span></label>
                                            <input type="date" name="fechaNac" value={formDoctor.fechaNac} onChange={handleChangeDoctor} max={getFechaMaxima()} />
                                        </div>
                                        <div className="form-group">
                                            <label>Sexo <span className="required">*</span></label>
                                            <select name="sexo" value={formDoctor.sexo} onChange={handleChangeDoctor}>
                                                <option value="">Seleccione sexo</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Usuario (Correo) <span className="required">*</span></label>
                                            <input type="email" name="correo" value={formDoctor.correo} onChange={handleChangeDoctor} placeholder="doctor@hospital.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Cédula Profesional <span className="required">*</span></label>
                                            <input type="text" name="cedula" value={formDoctor.cedula} onChange={handleChangeDoctor} placeholder="Número de cédula" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Contraseña <span className="required">*</span></label>
                                            <input type="password" name="password" value={formDoctor.password} onChange={handleChangeDoctor} />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirmar Contraseña <span className="required">*</span></label>
                                            <input type="password" name="confirmPassword" value={formDoctor.confirmPassword} onChange={handleChangeDoctor} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Especialidad <span className="required">*</span></label>
                                            <select name="especialidadId" value={formDoctor.especialidadId} onChange={handleChangeDoctor}>
                                                <option value="">Seleccione</option>
                                                {especialidades.map(esp => (
                                                    <option key={esp.id} value={esp.id}>{esp.especialidad}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Horario <span className="required">*</span></label>
                                            <select name="horarioId" value={formDoctor.horarioId} onChange={handleChangeDoctor}>
                                                <option value="">Seleccione Horario</option>
                                                {horarios.map(h => (
                                                    <option key={h.id} value={h.id}>
                                                        {h.turno} ({h.horaEntrada} - {h.horaSalida})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Consultorio <span className="required">*</span></label>
                                            <select name="consultorioId" value={formDoctor.consultorioId} onChange={handleChangeDoctor}>
                                                <option value="">Seleccione</option>
                                                {consultorios.map(c => (
                                                    <option key={c.id} value={c.id}>{c.numConsultorio} (Piso {c.piso})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Sueldo Mensual ($) <span className="required">*</span></label>
                                            <input type="number" step="0.01" name="sueldo" value={formDoctor.sueldo} onChange={handleChangeDoctor} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>CURP <span className="required">*</span></label>
                                            <input type="text" name="curp" value={formDoctor.curp} onChange={handleChangeDoctor} maxLength="18" placeholder="CURP" />
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo de Sangre <span className="required">*</span></label>
                                            <select name="tipoSangre" value={formDoctor.tipoSangre} onChange={handleChangeDoctor}>
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
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Peso (kg) <span className="required">*</span></label>
                                            <input type="number" step="0.1" name="peso" value={formDoctor.peso} onChange={handleChangeDoctor} placeholder="70.5" />
                                        </div>
                                        <div className="form-group">
                                            <label>Estatura (metros) <span className="required">*</span></label>
                                            <input type="number" step="0.01" name="estatura" value={formDoctor.estatura} onChange={handleChangeDoctor} placeholder="1.75" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ================= FORMULARIO PACIENTE ================= */}
                            {tipoUsuario === 'paciente' && (
                                <>
                                    <h3 className="form-subtitle">Datos Personales y Cuenta (Paciente)</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input type="text" name="nombre" value={formPaciente.nombre} onChange={handleChangePaciente} placeholder="Juan" />
                                        </div>
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input type="tel" name="telefono" value={formPaciente.telefono} onChange={handleChangePaciente} placeholder="555-1234" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Apellido Paterno <span className="required">*</span></label>
                                            <input type="text" name="paterno" value={formPaciente.paterno} onChange={handleChangePaciente} placeholder="Pérez" />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellido Materno <span className="required">*</span></label>
                                            <input type="text" name="materno" value={formPaciente.materno} onChange={handleChangePaciente} placeholder="García" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha Nacimiento <span className="required">*</span></label>
                                            <input type="date" name="fechaNac" value={formPaciente.fechaNac} onChange={handleChangePaciente} max={getFechaMaxima()} />
                                        </div>
                                        <div className="form-group">
                                            <label>Sexo <span className="required">*</span></label>
                                            <select name="sexo" value={formPaciente.sexo} onChange={handleChangePaciente}>
                                                <option value="">Seleccione sexo</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Usuario (Correo) <span className="required">*</span></label>
                                            <input type="email" name="correo" value={formPaciente.correo} onChange={handleChangePaciente} placeholder="paciente@email.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo de Sangre</label>
                                            <select name="tipoSangre" value={formPaciente.tipoSangre} onChange={handleChangePaciente}>
                                                <option value="">Seleccione</option>
                                                <option value="O+">O+</option>
                                                <option value="A+">A+</option>
                                                {/* ... otros tipos */}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Contraseña <span className="required">*</span></label>
                                            <input type="password" name="password" value={formPaciente.password} onChange={handleChangePaciente} />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirmar Contraseña <span className="required">*</span></label>
                                            <input type="password" name="confirmPassword" value={formPaciente.confirmPassword} onChange={handleChangePaciente} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Alergias</label>
                                        <input type="text" name="alergias" value={formPaciente.alergias} onChange={handleChangePaciente} placeholder="Ninguna" />
                                    </div>
                                    <div className="form-group">
                                        <label>Dirección</label>
                                        <textarea name="direccion" value={formPaciente.direccion} onChange={handleChangePaciente} />
                                    </div>
                                </>
                            )}

                            {/* ================= FORMULARIO RECEPCIONISTA ================= */}
                            {tipoUsuario === 'recepcionista' && (
                                <>
                                    <h3 className="form-subtitle">Datos Personales y Cuenta (Recepcionista)</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre <span className="required">*</span></label>
                                            <input type="text" name="nombre" value={formRecepcionista.nombre} onChange={handleChangeRecepcionista} />
                                        </div>
                                        <div className="form-group">
                                            <label>Teléfono <span className="required">*</span></label>
                                            <input type="tel" name="telefono" value={formRecepcionista.telefono} onChange={handleChangeRecepcionista} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Apellido Paterno <span className="required">*</span></label>
                                            <input type="text" name="paterno" value={formRecepcionista.paterno} onChange={handleChangeRecepcionista} />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellido Materno <span className="required">*</span></label>
                                            <input type="text" name="materno" value={formRecepcionista.materno} onChange={handleChangeRecepcionista} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha Nacimiento <span className="required">*</span></label>
                                            <input type="date" name="fechaNac" value={formRecepcionista.fechaNac} onChange={handleChangeRecepcionista} max={getFechaMaxima()} />
                                        </div>
                                        <div className="form-group">
                                            <label>Sexo <span className="required">*</span></label>
                                            <select name="sexo" value={formRecepcionista.sexo} onChange={handleChangeRecepcionista}>
                                                <option value="">Seleccione sexo</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Usuario (Correo) <span className="required">*</span></label>
                                            <input type="email" name="correo" value={formRecepcionista.correo} onChange={handleChangeRecepcionista} />
                                        </div>
                                        <div className="form-group">
                                            <label>Horario <span className="required">*</span></label>
                                            <select name="horarioId" value={formRecepcionista.horarioId} onChange={handleChangeRecepcionista} required>
                                                <option value="">Seleccione Horario</option>
                                                {horarios.map(h => (
                                                    <option key={h.id} value={h.id}>
                                                        {h.turno} ({h.horaEntrada} - {h.horaSalida})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Sueldo Mensual ($) <span className="required">*</span></label>
                                            <input type="number" step="0.01" name="sueldo" value={formRecepcionista.sueldo} onChange={handleChangeRecepcionista} required />
                                        </div>
                                        <div className="form-group">
                                            <label>CURP <span className="required">*</span></label>
                                            <input type="text" name="curp" value={formRecepcionista.curp} onChange={handleChangeRecepcionista} maxLength="18" placeholder="CURP" required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Número de Extensión <span className="required">*</span></label>
                                            <input type="number" name="numeroExtension" value={formRecepcionista.numeroExtension} onChange={handleChangeRecepcionista} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Contraseña <span className="required">*</span></label>
                                            <input type="password" name="password" value={formRecepcionista.password} onChange={handleChangeRecepcionista} />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirmar Contraseña <span className="required">*</span></label>
                                            <input type="password" name="confirmPassword" value={formRecepcionista.confirmPassword} onChange={handleChangeRecepcionista} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {tipoUsuario && (
                                <div className="action-buttons">
                                    <button className="btn btn-primary" onClick={handleRegistrar}>
                                        ✓ Registrar {tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancelar}>
                                        ✕ Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: DAR DE BAJA (Sin cambios, solo se oculta cuando no es tabActivo) */}
                {tabActivo === 'baja' && (
                    <div className="tab-content active">
                        <div className="section">
                            <h2 className="section-title">Dar de Baja Usuario</h2>
                            {/* ... (Contenido de baja igual que tu código original) ... */}
                            <div className="search-section">
                                <label>Buscar Usuario por ID o Nombre</label>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        value={busquedaUsuario}
                                        onChange={(e) => setBusquedaUsuario(e.target.value)}
                                        placeholder="Ingrese ID o nombre"
                                    />
                                    <button className="btn btn-primary" onClick={handleBuscarUsuario}>🔍 Buscar</button>
                                </div>
                            </div>
                            {usuarioEncontrado && (
                                <div className="user-info-box">
                                    {/* ... Visualización del usuario igual ... */}
                                    <h3>Usuario Encontrado: {usuarioEncontrado.nombre}</h3>
                                    <button className="btn btn-danger" onClick={handleDarDeBaja}>🗑️ Dar de Baja</button>
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
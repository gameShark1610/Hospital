import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/recepcionista/gestion_consultorios.css';

const GestionConsultorios = () => {
    const navigate = useNavigate();
    const [tabActivo, setTabActivo] = useState('consultorios');

    // Estados para formulario de consultorio
    const [formConsultorio, setFormConsultorio] = useState({
        numero: '',
        ubicacion: '',
        capacidad: '',
        especialidad: '',
        equipamiento: ''
    });

    // Estados para formulario de especialidad
    const [formEspecialidad, setFormEspecialidad] = useState({
        nombre: '',
        descripcion: '',
        codigo: '',
        duracion: ''
    });

    // Datos simulados - vendrían del backend
    const [consultorios, setConsultorios] = useState([
        {
            id: 1,
            numero: 'Consultorio 3A',
            ubicacion: 'Piso 2, Ala Norte',
            especialidad: 'Cardiología',
            estado: 'disponible'
        },
        {
            id: 2,
            numero: 'Consultorio 1B',
            ubicacion: 'Piso 1, Ala Sur',
            especialidad: 'Medicina General',
            estado: 'ocupado'
        },
        {
            id: 3,
            numero: 'Consultorio 2A',
            ubicacion: 'Piso 2, Ala Este',
            especialidad: 'Pediatría',
            estado: 'disponible'
        }
    ]);

    const [especialidades, setEspecialidades] = useState([
        {
            id: 1,
            nombre: 'Cardiología',
            descripcion: 'Especialidad enfocada en el corazón y sistema cardiovascular',
            codigo: 'CARD-01',
            duracion: 40
        },
        {
            id: 2,
            nombre: 'Pediatría',
            descripcion: 'Atención médica especializada para niños y adolescentes',
            codigo: 'PEDI-01',
            duracion: 30
        },
        {
            id: 3,
            nombre: 'Medicina General',
            descripcion: 'Atención médica integral y diagnóstico inicial',
            codigo: 'MGEN-01',
            duracion: 25
        },
        {
            id: 4,
            nombre: 'Traumatología',
            descripcion: 'Tratamiento de lesiones del sistema musculoesquelético',
            codigo: 'TRAU-01',
            duracion: 35
        }
    ]);

    const handleLogout = () => {
        navigate('/login');
    };

    const cambiarTab = (tab) => {
        setTabActivo(tab);
    };

    const handleChangeConsultorio = (e) => {
        setFormConsultorio({
            ...formConsultorio,
            [e.target.name]: e.target.value
        });
    };

    const handleChangeEspecialidad = (e) => {
        setFormEspecialidad({
            ...formEspecialidad,
            [e.target.name]: e.target.value
        });
    };

    const handleRegistrarConsultorio = () => {
        console.log('Registrar consultorio:', formConsultorio);
        // Aquí iría la llamada al backend
        // Limpiar formulario después de registrar
        setFormConsultorio({
            numero: '',
            ubicacion: '',
            capacidad: '',
            especialidad: '',
            equipamiento: ''
        });
    };

    const handleRegistrarEspecialidad = () => {
        console.log('Registrar especialidad:', formEspecialidad);
        // Aquí iría la llamada al backend
        // Limpiar formulario después de registrar
        setFormEspecialidad({
            nombre: '',
            descripcion: '',
            codigo: '',
            duracion: ''
        });
    };

    const handleEditarConsultorio = (id) => {
        console.log('Editar consultorio ID:', id);
        // Aquí iría la lógica de edición
    };

    const handleEliminarConsultorio = (id) => {
        console.log('Eliminar consultorio ID:', id);
        // Aquí iría la llamada al backend para eliminar
        setConsultorios(consultorios.filter(c => c.id !== id));
    };

    const handleEditarEspecialidad = (id) => {
        console.log('Editar especialidad ID:', id);
        // Aquí iría la lógica de edición
    };

    const handleEliminarEspecialidad = (id) => {
        console.log('Eliminar especialidad ID:', id);
        // Aquí iría la llamada al backend para eliminar
        setEspecialidades(especialidades.filter(e => e.id !== id));
    };

    const handleCancelar = () => {
        if (tabActivo === 'consultorios') {
            setFormConsultorio({
                numero: '',
                ubicacion: '',
                capacidad: '',
                especialidad: '',
                equipamiento: ''
            });
        } else {
            setFormEspecialidad({
                nombre: '',
                descripcion: '',
                codigo: '',
                duracion: ''
            });
        }
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
                    <h1>🏢 Consultorios y Especialidades</h1>
                    <p>Registra y gestiona consultorios y especialidades médicas</p>
                </div>

                <div className="tabs">
                    <div 
                        className={`tab ${tabActivo === 'consultorios' ? 'active' : ''}`}
                        onClick={() => cambiarTab('consultorios')}
                    >
                        🚪 Consultorios
                    </div>
                    <div 
                        className={`tab ${tabActivo === 'especialidades' ? 'active' : ''}`}
                        onClick={() => cambiarTab('especialidades')}
                    >
                        🩺 Especialidades
                    </div>
                </div>

                {/* TAB: CONSULTORIOS */}
                {tabActivo === 'consultorios' && (
                    <div className="tab-content active">
                        <div className="section">
                            <h2 className="section-title">Registrar Nuevo Consultorio</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Número de Consultorio <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        name="numero"
                                        value={formConsultorio.numero}
                                        onChange={handleChangeConsultorio}
                                        placeholder="Ej: 3A, 101, Sala 5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ubicación <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        name="ubicacion"
                                        value={formConsultorio.ubicacion}
                                        onChange={handleChangeConsultorio}
                                        placeholder="Ej: Piso 2, Ala Norte"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Capacidad (personas)</label>
                                    <input 
                                        type="number" 
                                        name="capacidad"
                                        value={formConsultorio.capacidad}
                                        onChange={handleChangeConsultorio}
                                        placeholder="Ej: 3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Especialidad Asignada</label>
                                    <select 
                                        name="especialidad"
                                        value={formConsultorio.especialidad}
                                        onChange={handleChangeConsultorio}
                                    >
                                        <option value="">Seleccione especialidad</option>
                                        <option value="cardiologia">Cardiología</option>
                                        <option value="pediatria">Pediatría</option>
                                        <option value="general">Medicina General</option>
                                        <option value="traumatologia">Traumatología</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Equipamiento Disponible</label>
                                <textarea 
                                    name="equipamiento"
                                    value={formConsultorio.equipamiento}
                                    onChange={handleChangeConsultorio}
                                    placeholder="Ej: Camilla, escritorio, estetoscopio, tensiómetro"
                                />
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleRegistrarConsultorio}>
                                    ✓ Registrar Consultorio
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancelar}>
                                    ✕ Cancelar
                                </button>
                            </div>
                        </div>

                        <div className="section">
                            <h2 className="section-title">Consultorios Registrados</h2>
                            
                            <div className="items-grid">
                                {consultorios.map((consultorio) => (
                                    <div key={consultorio.id} className="item-card">
                                        <div className="item-info">
                                            <h4>{consultorio.numero}</h4>
                                            <p>📍 {consultorio.ubicacion} | {consultorio.especialidad}</p>
                                            <span className={`badge ${consultorio.estado === 'disponible' ? 'badge-disponible' : 'badge-ocupado'}`}>
                                                {consultorio.estado === 'disponible' ? 'Disponible' : 'Ocupado'}
                                            </span>
                                        </div>
                                        <div className="item-actions">
                                            <button 
                                                className="btn btn-primary btn-small"
                                                onClick={() => handleEditarConsultorio(consultorio.id)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleEliminarConsultorio(consultorio.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ESPECIALIDADES */}
                {tabActivo === 'especialidades' && (
                    <div className="tab-content active">
                        <div className="section">
                            <h2 className="section-title">Registrar Nueva Especialidad</h2>

                            <div className="form-group">
                                <label>Nombre de la Especialidad <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={formEspecialidad.nombre}
                                    onChange={handleChangeEspecialidad}
                                    placeholder="Ej: Cardiología, Pediatría, Dermatología"
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea 
                                    name="descripcion"
                                    value={formEspecialidad.descripcion}
                                    onChange={handleChangeEspecialidad}
                                    placeholder="Breve descripción de la especialidad médica"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Código de Especialidad</label>
                                    <input 
                                        type="text" 
                                        name="codigo"
                                        value={formEspecialidad.codigo}
                                        onChange={handleChangeEspecialidad}
                                        placeholder="Ej: CARD-01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duración Promedio de Consulta (minutos)</label>
                                    <input 
                                        type="number" 
                                        name="duracion"
                                        value={formEspecialidad.duracion}
                                        onChange={handleChangeEspecialidad}
                                        placeholder="Ej: 30"
                                    />
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={handleRegistrarEspecialidad}>
                                    ✓ Registrar Especialidad
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancelar}>
                                    ✕ Cancelar
                                </button>
                            </div>
                        </div>

                        <div className="section">
                            <h2 className="section-title">Especialidades Registradas</h2>
                            
                            <div className="items-grid">
                                {especialidades.map((especialidad) => (
                                    <div key={especialidad.id} className="item-card">
                                        <div className="item-info">
                                            <h4>{especialidad.nombre}</h4>
                                            <p>{especialidad.descripcion}</p>
                                            <p className="especialidad-info">
                                                <strong>Código:</strong> {especialidad.codigo} | <strong>Duración:</strong> {especialidad.duracion} min
                                            </p>
                                        </div>
                                        <div className="item-actions">
                                            <button 
                                                className="btn btn-primary btn-small"
                                                onClick={() => handleEditarEspecialidad(especialidad.id)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleEliminarEspecialidad(especialidad.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GestionConsultorios;
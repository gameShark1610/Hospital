package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.RegisterDoctorRequest;
import com.hospital.lacurita.hospital.dto.RegisterPacienteRequest;
import com.hospital.lacurita.hospital.dto.RegisterRecepcionistaRequest;
import com.hospital.lacurita.hospital.dto.RegisterRequest;
import com.hospital.lacurita.hospital.model.*;
import com.hospital.lacurita.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private HistorialMedicoRepository historialMedicoRepository;

    @Autowired
    private HorarioEmpleadoRepository horarioEmpleadoRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ConsultorioRepository consultorioRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    public Usuario authenticate(String correo, String password) {
        Usuario user = userRepository.findByUsuario(correo).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getContraseña())) {
            return user;
        }
        return null;
    }

    @Transactional
    public void register(RegisterRequest registerRequest) {

        // 1. Validar si el usuario ya existe (Buena práctica hacerlo antes de llamar a
        // BD)
        if (userRepository.findByUsuario(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 2. Encriptar la contraseña (El SP espera el string ya encriptado)
        String passwordEncriptada = passwordEncoder.encode(registerRequest.getPassword());

        // 3. Convertir el Sexo (String) a ID (int) para el SP
        // Asumiendo: 1 = Masculino, 0 = Femenino. Ajusta según tu lógica.
        int sexoId = 0;
        if (registerRequest.getSexo() != null &&
                (registerRequest.getSexo().equalsIgnoreCase("Masculino")
                        || registerRequest.getSexo().equalsIgnoreCase("M"))) {
            sexoId = 1;
        }

        // 4. Llamar al Stored Procedure mediante el Repositorio JPA
        userRepository.registrarUsuarioSp(
                registerRequest.getCorreo(),
                passwordEncriptada,
                registerRequest.getNombre(),
                registerRequest.getPaterno(),
                registerRequest.getMaterno(),
                registerRequest.getFechaNacim(),
                registerRequest.getTipoUsuarioId(),
                sexoId,
                // ... existing register code ...
                registerRequest.getTelefono());
    }

    @Transactional
    public void registerDoctor(RegisterDoctorRequest request) {
        // 1. Registrar Usuario Base (Persona)

        // Obtener Sexo ID
        boolean sexoId = false;
        if (request.getSexo() != null &&
                (request.getSexo().equalsIgnoreCase("Masculino")
                        || request.getSexo().equalsIgnoreCase("M"))) {
            sexoId = true;
        }

        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setPaterno(request.getPaterno());
        persona.setMaterno(request.getMaterno());
        persona.setFechaNacim(request.getFechaNacim());
        persona.setSexo(sexoId);
        persona.setTelefono(request.getTelefono());
        persona = personaRepository.save(persona);

        // 2. Registrar Usuario (Usuario)
        Usuario usuario = new Usuario();
        usuario.setUsuario(request.getCorreo());
        usuario.setContraseña(passwordEncoder.encode(request.getPassword()));
        usuario.setPersona(persona);
        usuario.setTipoUsuario(tipoUsuarioRepository.findById(request.getTipoUsuarioId())
                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado")));
        usuario = userRepository.save(usuario);

        // 3. Crear Historial Médico
        HistorialMedico historial = new HistorialMedico();
        historial.setTipoSangre(request.getTipoSangre());
        historial.setPeso(request.getPeso());
        historial.setEstatura(request.getEstatura());
        historial = historialMedicoRepository.save(historial);

        // 3. Crear Paciente (Todos son pacientes)
        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setHistorialMedico(historial);
        pacienteRepository.save(paciente);

        // 4. Crear Empleado
        Empleado empleado = new Empleado();
        empleado.setUsuario(usuario);
        empleado.setSueldo(request.getSueldo());
        empleado.setCurp(request.getCurp());

        HorarioEmpleado horario = horarioEmpleadoRepository.findById(request.getHorarioId())
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        empleado.setHorarioEmpleado(horario);

        empleado = empleadoRepository.save(empleado);

        // 5. Crear Doctor
        Doctor doctor = new Doctor();
        doctor.setEmpleado(empleado);
        doctor.setNumCedula(request.getNumCedula());

        Especialidad especialidad = especialidadRepository.findById(request.getEspecialidadId())
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
        doctor.setEspecialidad(especialidad);

        Consultorio consultorio = consultorioRepository.findById(request.getConsultorioId())
                .orElseThrow(() -> new RuntimeException("Consultorio no encontrado"));
        doctor.setConsultorio(consultorio);

        doctorRepository.save(doctor);
    }

    @Autowired
    private RecepcionistaRepository recepcionistaRepository;

    @Transactional
    public void registerRecepcionista(RegisterRecepcionistaRequest request) {
        // 1. Validar Email
        if (userRepository.findByUsuario(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 2. Crear y Guardar Persona
        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setPaterno(request.getPaterno());
        persona.setMaterno(request.getMaterno());
        persona.setFechaNacim(request.getFechaNacim());
        persona.setTelefono(request.getTelefono());

        // Mapeo Sexo
        boolean esMasculino = request.getSexo() != null &&
                (request.getSexo().equalsIgnoreCase("Masculino") ||
                        request.getSexo().equalsIgnoreCase("M"));
        persona.setSexo(esMasculino);

        persona = personaRepository.save(persona);

        // 3. Registrar Usuario (Tipo 3 = Recepcionista)
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(3)
                .orElseThrow(() -> new RuntimeException("Tipo de usuario Recepcionista no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setUsuario(request.getCorreo());
        usuario.setContraseña(passwordEncoder.encode(request.getPassword()));
        usuario.setPersona(persona);
        usuario.setTipoUsuario(tipoUsuario);

        usuario = userRepository.save(usuario);

        // NOTA: No creamos Paciente/HistorialMedico aquí porque no tenemos datos
        // médicos en el request para Recepcionista
        // Si se requiere que sea Paciente, se necesitarían valores por defecto o pedir
        // los datos.

        // 4. Crear Empleado
        Empleado empleado = new Empleado();
        empleado.setUsuario(usuario);
        empleado.setSueldo(request.getSueldo());
        empleado.setCurp(request.getCurp());

        HorarioEmpleado horario = horarioEmpleadoRepository.findById(request.getHorarioId())
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        empleado.setHorarioEmpleado(horario);

        empleado = empleadoRepository.save(empleado);

        // 5. Crear Recepcionista
        Recepcionista recepcionista = new Recepcionista();
        recepcionista.setEmpleado(empleado);
        recepcionista.setNumeroExtension(request.getNumeroExtension());

        recepcionistaRepository.save(recepcionista);
    }

    @Transactional
    public void registerPaciente(RegisterPacienteRequest request) {
        // 1. Validar Email
        if (userRepository.findByUsuario(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 2. Crear y Guardar Persona
        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setPaterno(request.getPaterno());
        persona.setMaterno(request.getMaterno());
        persona.setFechaNacim(request.getFechaNacim());
        persona.setTelefono(request.getTelefono());

        // Mapeo Sexo
        boolean esMasculino = request.getSexo() != null &&
                (request.getSexo().equalsIgnoreCase("Masculino") ||
                        request.getSexo().equalsIgnoreCase("M"));
        persona.setSexo(esMasculino);

        persona = personaRepository.save(persona);

        // 3. Registrar Usuario (Tipo 1 = Paciente)
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Tipo de usuario Paciente no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setUsuario(request.getCorreo());
        usuario.setContraseña(passwordEncoder.encode(request.getPassword()));
        usuario.setPersona(persona);
        usuario.setTipoUsuario(tipoUsuario);

        usuario = userRepository.save(usuario);

        // 4. Crear Historial Médico
        HistorialMedico historial = new HistorialMedico();
        historial.setTipoSangre(request.getTipoSangre());
        historial.setPeso(request.getPeso());
        historial.setEstatura(request.getEstatura());
        historial = historialMedicoRepository.save(historial);

        // 5. Crear Paciente
        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setHistorialMedico(historial);
        pacienteRepository.save(paciente);
    }

    public Usuario findByUsername(String username) {
        return userRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Integer obtenerUsuarioIdActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof Usuario usuario) {
                return usuario.getId();
            }
        }
        return null;
    }

    /*
     * public UserPerfilDTO obtenerPerfilUsuarioActual() {
     * Usuario usuario = userRepository.findById(obtenerUsuarioIdActual()).get();
     * UserPerfilDTO userPerfilDTO=new UserPerfilDTO();
     * userPerfilDTO.setNombre(usuario.getPersona().getNombre());
     * userPerfilDTO.setApellidos(usuario.getPersona().getPaterno()+" "+usuario.
     * getPersona().getMaterno());
     * userPerfilDTO.setEmail(usuario.getUsuario());
     * userPerfilDTO.setFechaNacimiento(usuario.getPersona().getFechaNacim());
     * userPerfilDTO.setGenero(usuario.getPersona().getSexo() ? "Masculino" :
     * "Femenino");
     * 
     * Paciente paciente =
     * pacienteRepository.findByUsuarioId(usuario.getId()).orElse(null);
     * userPerfilDTO.setAltura(paciente.getHistorialMedico() != null ?
     * paciente.getHistorialMedico().getEstatura() : new BigDecimal("0.0"));
     * return userPerfilDTO;
     * }
     */

}
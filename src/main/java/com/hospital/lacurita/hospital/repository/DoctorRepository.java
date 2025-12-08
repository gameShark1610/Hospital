package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    @Query(value = "SELECT DoctorId, NombreCompletoDoctor FROM DoctoresEspecialidad(:especialidadId,:pacineteId)", nativeQuery = true)
    List<Object[]> findDoctoresByEspecialidad(@Param("especialidadId") Integer especialidadId,
            @Param("pacineteId") Integer pacineteId);

    Optional<Doctor> findByEmpleadoId(Integer id);

    @Query(value = "SELECT * FROM CitasDoctor WHERE DoctorId = :doctorId", nativeQuery = true)
    List<Object[]> findCitasByDoctorId(@Param("doctorId") Integer doctorId);

    @Modifying
    @Query(value = "EXEC EliminarDoctor :doctorId", nativeQuery = true)
    void eliminarDoctorSp(@Param("doctorId") Integer doctorId);

    @Query(value = "SELECT d.DoctorId, p.Nombre, p.Paterno, p.Materno, e.Especialidad, c.NumConsultorio " +
            "FROM Doctor d " +
            "JOIN Empleado emp ON d.EmpleadoId = emp.EmpleadoId " +
            "JOIN Usuario u ON emp.UsuarioId = u.UsuarioId " +
            "JOIN Persona p ON u.PersonaId = p.PersonaId " +
            "JOIN Especialidad e ON d.EspecialidadId = e.EspecialidadId " +
            "JOIN Consultorio c ON d.ConsultorioId = c.ConsultorioId " +
            "WHERE p.Nombre LIKE %:query% OR CAST(d.DoctorId AS VARCHAR) LIKE %:query%", nativeQuery = true)
    List<Object[]> buscarPorIdONombre(@Param("query") String query);
}

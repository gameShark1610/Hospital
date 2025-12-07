package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    @Query(value = "SELECT DoctorId, NombreCompletoDoctor FROM DoctoresEspecialidad(:especialidadId,:pacineteId)", nativeQuery = true)
    List<Object[]> findDoctoresByEspecialidad(@Param("especialidadId") Integer especialidadId, @Param("pacineteId") Integer pacineteId);

    Optional<Doctor>  findByEmpleadoId(Integer id);

}

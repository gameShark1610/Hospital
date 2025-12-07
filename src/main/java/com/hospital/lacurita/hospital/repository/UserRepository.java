package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsuario(String usuario);
    Optional<Usuario> findById(Integer id);

    @Modifying // Indica que esto modificará la BD (Insert)
    @Query(value = "EXEC RegistrarUsuario " +
            "@Usuario = :usuario, " +
            "@Contraseña = :contrasena, " +
            "@Nombre = :nombre, " +
            "@Paterno = :paterno, " +
            "@Materno = :materno, " +
            "@FechaNa = :fechaNa, " +
            "@TipoUsuarioId = :tipoUsuarioId, " +
            "@SexoId = :sexoId, " +
            "@Telefono = :telefono", nativeQuery = true)
    void registrarUsuarioSp(
            @Param("usuario") String usuario,
            @Param("contrasena") String contrasena,
            @Param("nombre") String nombre,
            @Param("paterno") String paterno,
            @Param("materno") String materno,
            @Param("fechaNa") LocalDate fechaNa,
            @Param("tipoUsuarioId") int tipoUsuarioId,
            @Param("sexoId") int sexoId, // Mapeamos el BIT de SQL a int (0 o 1)
            @Param("telefono") String telefono
    );
}
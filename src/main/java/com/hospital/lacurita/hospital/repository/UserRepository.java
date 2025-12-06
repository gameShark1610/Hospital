package com.hospital.lacurita.hospital.repository;

import com.hospital.lacurita.hospital.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsuario(String usuario);
    Optional<Usuario> findById(Integer id);
}
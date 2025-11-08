package com.hospital.lacurita.hospital.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class PacientePadecimientoId implements Serializable {
    private static final long serialVersionUID = -2281484073886535346L;
    @NotNull
    @Column(name = "PadecimientoPrevioId", nullable = false)
    private Integer padecimientoPrevioId;

    @NotNull
    @Column(name = "PacienteId", nullable = false)
    private Integer pacienteId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PacientePadecimientoId entity = (PacientePadecimientoId) o;
        return Objects.equals(this.padecimientoPrevioId, entity.padecimientoPrevioId) &&
                Objects.equals(this.pacienteId, entity.pacienteId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(padecimientoPrevioId, pacienteId);
    }

}
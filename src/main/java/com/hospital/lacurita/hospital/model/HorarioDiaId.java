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
public class HorarioDiaId implements Serializable {
    private static final long serialVersionUID = -5500998083588290115L;
    @NotNull
    @Column(name = "HorarioEmpleadoId", nullable = false)
    private Integer horarioEmpleadoId;

    @NotNull
    @Column(name = "DiaId", nullable = false)
    private Integer diaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        HorarioDiaId entity = (HorarioDiaId) o;
        return Objects.equals(this.diaId, entity.diaId) &&
                Objects.equals(this.horarioEmpleadoId, entity.horarioEmpleadoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(diaId, horarioEmpleadoId);
    }

}
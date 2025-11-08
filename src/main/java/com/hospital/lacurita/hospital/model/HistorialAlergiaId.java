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
public class HistorialAlergiaId implements Serializable {
    private static final long serialVersionUID = -1164646731971392355L;
    @NotNull
    @Column(name = "HistorialMedicoId", nullable = false)
    private Integer historialMedicoId;

    @NotNull
    @Column(name = "AlergiaId", nullable = false)
    private Integer alergiaId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        HistorialAlergiaId entity = (HistorialAlergiaId) o;
        return Objects.equals(this.alergiaId, entity.alergiaId) &&
                Objects.equals(this.historialMedicoId, entity.historialMedicoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(alergiaId, historialMedicoId);
    }

}
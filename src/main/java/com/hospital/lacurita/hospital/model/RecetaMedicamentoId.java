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
public class RecetaMedicamentoId implements Serializable {
    private static final long serialVersionUID = -2460334323880082756L;
    @NotNull
    @Column(name = "Folio", nullable = false)
    private Integer folio;

    @NotNull
    @Column(name = "MedicamentoId", nullable = false)
    private Integer medicamentoId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RecetaMedicamentoId entity = (RecetaMedicamentoId) o;
        return Objects.equals(this.medicamentoId, entity.medicamentoId) &&
                Objects.equals(this.folio, entity.folio);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicamentoId, folio);
    }

}
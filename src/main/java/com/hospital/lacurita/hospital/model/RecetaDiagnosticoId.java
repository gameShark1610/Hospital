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
public class RecetaDiagnosticoId implements Serializable {
    private static final long serialVersionUID = -3542991851547568329L;
    @NotNull
    @Column(name = "Folio", nullable = false)
    private Integer folio;

    @NotNull
    @Column(name = "DiagnosticoId", nullable = false)
    private Integer diagnosticoId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RecetaDiagnosticoId entity = (RecetaDiagnosticoId) o;
        return Objects.equals(this.folio, entity.folio) &&
                Objects.equals(this.diagnosticoId, entity.diagnosticoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(folio, diagnosticoId);
    }

}
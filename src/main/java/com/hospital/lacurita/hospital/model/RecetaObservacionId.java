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
public class RecetaObservacionId implements Serializable {
    private static final long serialVersionUID = -3190437640195444473L;
    @NotNull
    @Column(name = "Folio", nullable = false)
    private Integer folio;

    @NotNull
    @Column(name = "ObservacionId", nullable = false)
    private Integer observacionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RecetaObservacionId entity = (RecetaObservacionId) o;
        return Objects.equals(this.folio, entity.folio) &&
                Objects.equals(this.observacionId, entity.observacionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(folio, observacionId);
    }

}
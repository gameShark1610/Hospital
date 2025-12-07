package com.hospital.lacurita.hospital.service;

import com.hospital.lacurita.hospital.dto.Doctor.MedicamentoDTO;
import com.hospital.lacurita.hospital.dto.Doctor.RecetaDTO;
import com.hospital.lacurita.hospital.repository.RecetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecetaService {

    @Autowired
    private RecetaRepository recetaRepository;

    @Transactional // Si falla un medicamento, borra la receta completa (Rollback)
    public void crearRecetaCompleta(RecetaDTO dto) {

        // 1. Llamar al SP de Encabezado
        Integer nuevaRecetaId = recetaRepository.crearEncabezado(
                dto.getCitaId(),
                dto.getDiagnostico(),
                dto.getObservacion()
        );

        // Validación de seguridad
        if (nuevaRecetaId == null) {
            throw new RuntimeException("Error: No se pudo generar el ID de la receta.");
        }

        // 2. Recorrer la lista de medicamentos e insertar uno por uno
        for (MedicamentoDTO med : dto.getMedicamentos()) {
            if (med.getMedicamentoId() != null) {
                recetaRepository.agregarMedicamento(
                        nuevaRecetaId,           // Usamos el ID que obtuvimos arriba
                        med.getMedicamentoId(),
                        med.getDuracion(),
                        med.getTratamiento()
                );
            }
        }


    }
}

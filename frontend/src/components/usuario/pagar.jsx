import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/usuario/pagar.css";

function Pagar() {
  const navigate = useNavigate();
  const location = useLocation();

  const cita = location.state?.cita;
  const [procesando, setProcesando] = useState(false);

  if (!cita) {
    return (
      <div className="pagar-page">
        <div className="pagar-container">
          <div className="loading">No se encontraron datos de la cita.</div>
        </div>
      </div>
    );
  }

  const handlePagar = async () => {
    setProcesando(true);

    try {
      const response = await fetch(
        `http://localhost:8080/Cita/pagar/${cita.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Pago fallido.");

      alert("¡Pago completado con éxito! Tu cita está confirmada.");
      navigate("/usuario/mis-citas");

    } catch (error) {
      alert("Hubo un error al procesar tu pago.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="pagar-page">
      <div className="pagar-container">

        <div className="pagar-header">
          <span className="icon">💳</span>
          <h1>Confirmación y Resumen</h1>
          <p>Revisa los detalles de tu cita antes de completar el pago.</p>
        </div>

        <div className="cita-info">
          <div className="info-row">
            <span className="label">Servicio:</span>
            <span className="value">{cita.especialidad}</span>
          </div>

          <div className="info-row">
            <span className="label">Fecha y Hora:</span>
            <span className="value">
              {cita.fecha}, {cita.hora}
            </span>
          </div>

          <div className="info-row">
            <span className="label">Doctor:</span>
            <span className="value">{cita.doctor}</span>
          </div>

          <div className="info-row">
            <span className="label">Precio Total:</span>
            <span className="value">${cita.precio}0</span>
          </div>
        </div>

        <div className="payment-section">
          <p className="payment-note">
            Escoger metodo de pago
          </p>

          <button
            className="pagar-btn"
            onClick={handlePagar}
            disabled={procesando}
          >
            {procesando
              ? "Procesando..."
              : `Pagar y confirmar (${cita.precio}0)`}
          </button>

          <button
            className="cancelar-btn"
            onClick={() => navigate("/usuario/mis-citas")}
            disabled={procesando}
          >
            Regresar y cancelar
          </button>
        </div>

      </div>
    </div>
  );
}

export default Pagar;

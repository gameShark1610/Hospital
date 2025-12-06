import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/login";
import Citas from "./components/usuario/citas";
import Registro from "./components/registro";
import PaginaRecepcionista from "./components/recepcionista/PaginaRecepcionista";
import MisCitas from "./components/usuario/mis-citas";
import PerfilUser from "./components/usuario/perfil";
import PagarCita from "./components/usuario/pagar";
import PrincipalDoctor from "./components/doctor/principal-doctor"
import DoctorCitas from "./components/doctor/citas";
import HistorialPacientes from "./components/doctor/historial-pacientes";
import PerfilDoctor from "./components/doctor/perfil-doctor";
import GestionUsuario from "./components/recepcionista/gestion-usuarios"
import ConsultarCitas from "./components/recepcionista/consultar-citas";
import GestionConsultorios from "./components/recepcionista/gestion-consultorios";
import GestionServicios from "./components/recepcionista/gestion-servicios";
import ConsultarRecetas from "./components/recepcionista/consultar-recetas";
import InventarioMedicamentos from "./components/recepcionista/inventario-medicamentos";
import ConsultarBitacora from "./components/recepcionista/consultar_bitacora";
import CitasAgendar from "./components/doctor/citas-agendar";
import DoctorMisCitas from "./components/doctor/mis-citas";
import "./App.css";

//It checks if there’s a flag called "isLoggedIn" in localStorage. If the flag is present, it allows access to the protected route; otherwise, it redirects the user to the login page.
//If it exists → show whatever is inside (children, e.g., <Citas />).
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<Registro />} />
        {/* Protected page */}
        <Route
          path="/usuario/citas"
          element={
            <ProtectedRoute>
              <Citas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/paginaRecepcionista"
          element={
            <ProtectedRoute>
              <PaginaRecepcionista />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/mis-citas"
          element={
            <ProtectedRoute>
              <DoctorMisCitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/citas-agendar"
          element={
            <ProtectedRoute>
              <CitasAgendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/consultar-bitacora"
          element={
            <ProtectedRoute>
              <ConsultarBitacora />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/inventario-medicamentos"
          element={
            <ProtectedRoute>
              <InventarioMedicamentos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/consultar-recetas"
          element={
            <ProtectedRoute>
              <ConsultarRecetas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/gestion-servicios"
          element={
            <ProtectedRoute>
              <GestionServicios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/historial-pacientes"
          element={
            <ProtectedRoute>
              <HistorialPacientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/gestion-consultorios"
          element={
            <ProtectedRoute>
              <GestionConsultorios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recepcionista/consultar-citas"
          element={
            <ProtectedRoute>
              <ConsultarCitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/perfil"
          element={
            <ProtectedRoute>
              <PerfilDoctor />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/recepcionista/gestionarUsuarios"
          element={
            <ProtectedRoute>
              <GestionUsuario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/principalDoctor"
          element={
            <ProtectedRoute>
              <PrincipalDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/citas"
          element={
            <ProtectedRoute>
              <DoctorCitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuario/mis-citas"
          element={
            <ProtectedRoute>
              <MisCitas />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/usuario/pagar"
          element={
            <ProtectedRoute>
              <PagarCita />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuario/perfil"
          element={
            <ProtectedRoute>
              <PerfilUser />
            </ProtectedRoute>
          }
        />



        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

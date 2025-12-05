import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/login";
import Citas from "./components/usuario/citas";
import Registro from "./components/registro";
import PaginaRecepcionista from "./components/recepcionista/PaginaRecepcionista";
import MisCitas from "./components/usuario/mis-citas";
import PerfilUser from "./components/usuario/perfil";
import PagarCita from "./components/usuario/pagar";
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

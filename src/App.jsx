import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Produto from "./pages/Produto";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EditarProduto from "./pages/EditarProduto";
import RotaProtegida from "./components/RotaProtegida";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <RotaProtegida>
              <Admin />
            </RotaProtegida>
          }
        />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/cadastro"
          element={
            <RotaProtegida>
              <Cadastro />
            </RotaProtegida>
          }
        />

        <Route
          path="/editar/:id"
          element={
            <RotaProtegida>
              <EditarProduto />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/Liberada/Login/login';
import Cadastro from './pages/Liberada/Cadastro/cadastro';
import Home from './pages/Liberada/Home/home';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedLayout, ProtectedLayoutFunc } from './ProtectedLayout/index';
import Homefunc from './pages/ProtectedFunc/Home/homefunc';
import Navbar from './pages/Liberada/Navbar/navbar';
import RegistroClien from "./pages/ProtectedFunc/Registros/cliente";
import RegistroFunc from "./pages/ProtectedFunc/Registros/funcionario"
import TFuncionario from "./pages/ProtectedFunc/Tabelas/funcionario";
import TCliente from "./pages/ProtectedFunc/Tabelas/cliente";

export default function Web() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/n" element={<Navbar />} />
          <Route path="/home" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/homefunc" element={<ProtectedLayoutFunc><Homefunc /></ProtectedLayoutFunc>} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/registrocliente" element={<ProtectedLayoutFunc><RegistroClien /></ProtectedLayoutFunc>} />
          <Route path="/registrofuncionario" element={<ProtectedLayoutFunc><RegistroFunc /></ProtectedLayoutFunc>} />
          <Route path="/tabelafuncionario" element={<ProtectedLayoutFunc><TFuncionario /></ProtectedLayoutFunc>} />
          <Route path="/tabelacliente" element={<ProtectedLayoutFunc><TCliente /></ProtectedLayoutFunc>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



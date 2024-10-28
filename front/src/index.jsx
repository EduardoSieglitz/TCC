import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/ProtectedClien/Login/login';
import Cadastro from './pages/ProtectedClien/Cadastro/cadastro';
import Home from './pages/ProtectedClien/Home/home';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedLayout, ProtectedLayoutFunc, ProtectedLayoutSenha } from './ProtectedLayout/index';
import Homefunc from './pages/ProtectedFunc/Home/homefunc';
import Navbar from './pages/ProtectedClien/Navbar/navbar';
import RegistroClien from "./pages/ProtectedFunc/Registros/cliente";
import RegistroFunc from "./pages/ProtectedFunc/Registros/funcionario"
import RegistroAgend from "./pages/ProtectedFunc/Registros/agendamento"
import RegistroCortina from "./pages/ProtectedFunc/Registros/cortina"
import TFuncionario from "./pages/ProtectedFunc/Tabelas/funcionario";
import TCliente from "./pages/ProtectedFunc/Tabelas/cliente";
import TAgendamento from "./pages/ProtectedFunc/Tabelas/agendamento";
import TCortina from "./pages/ProtectedFunc/Tabelas/cortina";
import Password from "./pages/ChangePassword/ResetPassword"
import Request from "./pages/ChangePassword/RequestReset"
import ChatFunc from './pages/ProtectedFunc/ChatAoVivo/estrutura';
import ChatClien from './pages/ProtectedClien/ChatAoVivo/estrutura';

export default function Web() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Navbar />} />
          <Route path="/ResetPassword" element={<ProtectedLayoutSenha><Password /></ProtectedLayoutSenha>} />
          <Route path="/RequestReset" element={<Request />} />
          <Route path="/home" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/homefunc" element={<ProtectedLayoutFunc><Homefunc /></ProtectedLayoutFunc>} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/registrocliente" element={<ProtectedLayoutFunc><RegistroClien /></ProtectedLayoutFunc>} />
          <Route path="/registrofuncionario" element={<ProtectedLayoutFunc><RegistroFunc /></ProtectedLayoutFunc>} />
          <Route path="/registroagendamento" element={<ProtectedLayoutFunc><RegistroAgend /></ProtectedLayoutFunc>} />
          <Route path="/tabelafuncionario" element={<ProtectedLayoutFunc><TFuncionario /></ProtectedLayoutFunc>} />
          <Route path="/tabelacliente" element={<ProtectedLayoutFunc><TCliente /></ProtectedLayoutFunc>} />
          <Route path="/tabelaagendamento" element={<ProtectedLayoutFunc><TAgendamento /></ProtectedLayoutFunc>} />
          <Route path="/tabelacortina" element={<ProtectedLayoutFunc><TCortina /></ProtectedLayoutFunc>} />
          <Route path="/registrocortinas" element={<ProtectedLayoutFunc><RegistroCortina /></ProtectedLayoutFunc>} />
          <Route path="/chatFunc" element={<ProtectedLayoutFunc><ChatFunc /></ProtectedLayoutFunc>} />
          <Route path="/chatClien" element={<ProtectedLayout><ChatClien /></ProtectedLayout>} />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



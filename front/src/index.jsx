import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedLayout, ProtectedLayoutFunc } from './ProtectedLayout/index';
import Homefunc from './pages/Home/homefunc';
import Navbar from './pages/Navbar/navbar';
import TFuncionario from "./pages/Tabelas/funcionario";

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
          <Route path="/tabelafuncionario" element={<TFuncionario />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



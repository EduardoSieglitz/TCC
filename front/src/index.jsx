import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Navbar from './pages/Navbar/navbar';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedLayout } from './pages/ProtectedLayout/index';

export default function Web() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



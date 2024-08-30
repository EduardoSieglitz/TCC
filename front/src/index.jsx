import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';
import context from "./context/AuthProvider";
import { useContext } from 'react';

export default function Web() {
  const Privete = ({ Item }) => {
    const user = false;
    return user == true ? <Item /> : <Login />
  };
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Privete Item={Home} />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
          <Route exact path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



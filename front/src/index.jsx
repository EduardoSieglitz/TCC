import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';

export default function Web() {
  return (
      <BrowserRouter>
          <Routes>
            <Route exact path="/home" element={<Home/>} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
            <Route exact path="/cadastro" element={<Cadastro />} />
          </Routes>
      </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



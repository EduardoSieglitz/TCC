import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';
import Autenticar from "./pages/Autenticação/contexts";
const Private = ({ Item }) => {
  const signed = Autenticar();
  return signed == true ? <Item /> : <Login />;
}


export default function Web() {
  return (
      <BrowserRouter>
          <Routes>
            <Route exact path="/home" element={<Private Item={Home} />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
            <Route exact path="/cadastro" element={<Cadastro />} />
          </Routes>
      </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



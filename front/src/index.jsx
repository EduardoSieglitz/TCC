import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Fragment } from 'react';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';
import useHook from "./Autenticação/hook";

const Private = ({ Item }) => {
  const signed = useHook;
  return signed > 0 ? <Item /> : <Login />;
}

export default function Web() {
  return (
    <useHook>
      <BrowserRouter>
        <Fragment>
          <Routes>
            <Route exact path="/home" element={<Private Item={Home} />} />
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
            <Route exact path="/cadastro" element={<Cadastro />} />
          </Routes>
        </Fragment >
      </BrowserRouter>
    </useHook>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



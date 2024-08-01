import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Fragment } from 'react';
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import Home from './pages/Home/home';

const Private = ({ Item }) => {
  const signed = false;
  return signed > 0 ? <Item /> : <Login />;
}

export default function Web() {
  return (
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
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Web />);



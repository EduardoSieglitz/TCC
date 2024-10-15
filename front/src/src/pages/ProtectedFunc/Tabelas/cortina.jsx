import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./cortina.module.css";
import Navbar from "../Navbar/navbar";

const CortinaPage = () => {
  const [cortinas, setCortinas] = useState([])
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tabelacortinas");
      console.log(response.data);
      setCortinas(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.cortinapage}>
        <h1>Lista de Cortinas</h1>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Material</th>
              <th>Tipo de Material</th>
              <th>Imagem</th>
            </tr>
          </thead>
          <tbody>
            {cortinas.map((cortina) => (
              <tr key={cortina.idCortina}>
                <td>{cortina.nome}</td>
                <td>{cortina.descricao}</td>
                <td>{cortina.material}</td>
                <td>{cortina.tipo}</td>
                <td>{cortina.imagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CortinaPage;

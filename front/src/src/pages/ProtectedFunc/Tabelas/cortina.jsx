import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import styles from "./cortina.module.css";

const CortinaPage = () => {
  const [cortinas, setCortinas] = useState([]);
  const [editCortinaId, setEditCortinaId] = useState(null);
  const [error, setError] = useState("");
  const { register, setValue, handleSubmit } = useForm();

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tabelacortinas");
      console.log(response.data)
      setCortinas(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (idCortina) => {
    try {
      await axios.delete(`http://localhost:3001/deletecortina/${idCortina}`);
      fetchData(); 
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleEdit = (cortina) => {
    setEditCortinaId(cortina.idCortina); 
    setValue("nome", cortina.nome); 
    setValue("material", cortina.material);
    setValue("tipo", cortina.tipo);
  };

  const handleSave = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/editarcortina/${editCortinaId}`,
        data
      );

      if (response.data === "Atualizado") {
        setError(""); 
        setEditCortinaId(null); 
        fetchData(); 
      } else if (response.data === "Nome") {
        setError("Nome já existe");
      } else if (response.data === "Material") {
        setError("Material já existe");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className={styles.cortinapage}>
      <h1>Lista de Cortinas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Material</th>
            <th>Tipo de Material</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cortinas.map((cortina) => (
            <tr key={cortina.idCortina}>
              <td>{cortina.nome}</td>
              <td>{cortina.material}</td>
              <td>{cortina.tipo}</td>
              <td>
                <button onClick={() => handleEdit(cortina)}>Editar</button>
                <button onClick={() => handleDelete(cortina.idCortina)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editCortinaId && (
        <form onSubmit={handleSubmit(handleSave)}>
          <input {...register("nome")} placeholder="Nome da Cortina" />
          <input {...register("material")} placeholder="Material" />
          <input {...register("tipo")} placeholder="Tipo de Material" />
          <button type="submit">Salvar</button>
        </form>
      )}
    </div>
  );
};

export default CortinaPage;

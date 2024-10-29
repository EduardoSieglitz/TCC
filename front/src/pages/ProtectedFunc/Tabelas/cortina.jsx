import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./cortina.module.css";
import NavbarCliente from '../../../components/NavbarCliente/navbar';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

const CortinaPage = () => {
  const [cortinas, setCortinas] = useState([]);
  const [selectedCortina, setSelectedCortina] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tabelacortinas");
      setCortinas(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleManage = (cortina) => {
    setSelectedCortina(cortina);
    setIsEditing(false);
  };

  const handleDelete = async (idCortina) => {
    try {
      await axios.delete(`http://localhost:3001/deletecortina/${idCortina}`);
      setSelectedCortina(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleEdit = () => {
    fetchData();
    setIsEditing(true);
    setValue("nome", selectedCortina.nome);
    setValue("descricao", selectedCortina.descricao);
    setValue("material", selectedCortina.material);
    setValue("tipo", selectedCortina.tipo);
  };

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    formData.append('tipo', data.tipo);
    formData.append('material', data.material);
    formData.append('image', data.image[0])
    try {

      const response = await axios.put(`http://localhost:3001/editarcortina/${selectedCortina.idCortina}`,  formData,{
        headers : {
          'Content-Type': 'multipart/form-data'
      }});
      if (response.data === "Atualizado") {
        navigate("/tabelacortina");
        fetchData();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleCloseManage = () => {
    setSelectedCortina(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCortinas = cortinas.filter((cortina) => {
    if (searchField === "Nome") {
      return cortina.nome.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchField === "Material") {
      return cortina.material.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchField === "Tipo") {
      return cortina.tipo.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  return (
    <>
      <NavbarCliente />
      <div className={styles.containerCortina__Table}>

        {!selectedCortina ? (
          <>
            <div className={styles.filter_section}>
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className={styles.select_filter}
              >
                <option value="">Selecione</option>
                <option value="Nome">Nome</option>
                <option value="Material">Material</option>
                <option value="Tipo">Tipo</option>
              </select>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Buscar ${searchField}`}
                className={styles.input_filter}
              />
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Material</th>
                  <th>Tipo de Material</th>
                  <th>Imagem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCortinas.map((cortina) => (
                  <tr key={cortina.idCortina}>
                    <td>{cortina.nome}</td>
                    <td>{cortina.descricao}</td>
                    <td>{cortina.material}</td>
                    <td>{cortina.tipo}</td>
                    <td><img src={"http://localhost:3001/img/" + cortina.imagem} alt="Imagem" width="100" /></td>
                    <td>
                      <button onClick={() => handleManage(cortina)}>Gerenciar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className={styles.cortina_details}>
            <h2>Gerenciar Cortina: {selectedCortina.nome}</h2>

            {!isEditing ? (
              <>
                <p><strong>Nome:</strong> {selectedCortina.nome}</p>
                <p><strong>Descrição:</strong> {selectedCortina.descricao}</p>
                <p><strong>Material:</strong> {selectedCortina.material}</p>
                <p><strong>Tipo:</strong> {selectedCortina.tipo}</p>
                <img
                  src={"http://localhost:3001/img/" + selectedCortina.imagem}
                  alt="Imagem"
                  width="200"
                />
                <br />
                <button onClick={handleEdit}>Editar</button>
                <button onClick={() => handleDelete(selectedCortina.idCortina)}>Deletar</button>
                <button onClick={handleCloseManage}>Voltar</button>
              </>
            ) : (
              <form onSubmit={handleSubmit(handleSave)}>
                <label>Nome:</label>
                <input
                  type="text"
                  {...register('nome', { required: true })}
                  className={errors?.nome && styles.input_error}
                />
                {errors?.nome && <p className={styles.input_message}>Nome é obrigatório</p>}

                <label>Descrição:</label>
                <input
                  type="text"
                  {...register('descricao')}
                />

                <label>Material:</label>
                <input
                  type="text"
                  {...register('material', { required: true })}
                  className={errors?.material && styles.input_error}
                />
                {errors?.material && <p className={styles.input_message}>Material é obrigatório</p>}

                <label>Tipo de Material:</label>
                <input
                  type="text"
                  {...register('tipo', { required: true })}
                  className={errors?.tipo && styles.input_error}
                />
                {errors?.tipo && <p className={styles.input_message}>Tipo de material é obrigatório</p>}

                <label>Nova Imagem:</label>
                <input
                  type="file"
                  {...register('image', { required: true })}
                  className={errors?.image && styles.input_error}
                />
                {errors?.image?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                <br />
                <button type="submit">Salvar</button>
                <button onClick={() => setIsEditing(false)}>Cancelar</button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CortinaPage;

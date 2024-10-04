import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './funcionario.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Navbar from "../Navbar/navbar";

const TabelaFuncionario = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelafuncionario');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (idFuncionario) => {
    try {
      await axios.delete(`http://localhost:3001/deletefunc/${idFuncionario}`);
      fetchData(); // Atualiza a lista após deletar
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.idFuncionario);
    // Preencher o formulário com os dados do funcionário para edição
    setValue("nome", user.nome);
    setValue("descricao", user.descricao);
    setValue("cpf", user.cpf);
    setValue("telefone", user.telefone);
    setValue("email", user.email);
    setValue("senha", user.senha);
  };

  const handleSave = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/editarfunc/${editUserId}`, data);
      if (response.data === "Atualizado") {
        setError("");
        setEditUserId(null); // Sai do modo de edição
        fetchData(); // Atualiza a lista após salvar
      } else if (response.data === "Email") {
        setError("Email já existe");
      } else if (response.data === "Telefone") {
        setError("Telefone já existe");
      } else if (response.data === "CPF") {
        setError("CPF já existe");
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData()]);

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.body}>
        <div className={styles.containerFunc__Table}>
          <div>{error && <p className={styles.error_message}>{error}</p>}</div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>idFuncionario</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Senha</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.idFuncionario} className={styles.row}>
                  {editUserId === user.idFuncionario ? (
                    <>
                      <td>{user.idFuncionario}</td>
                      <td>
                        <input type="text" placeholder="Nome"
                          {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                          className={errors?.nome && styles.input_error}
                        />
                        {errors?.nome && <p className={styles.input_menssage}>Nome inválido</p>}
                      </td>
                      <td>
                        <input type="text" placeholder="Descrição"
                          {...register("descricao", { required: true, maxLength: 100 })}
                          className={errors?.descricao && styles.input_error}
                        />
                        {errors?.descricao && <p className={styles.input_menssage}>Descrição inválida</p>}
                      </td>
                      <td>
                        <input type="text" placeholder="CPF"
                          {...register('cpf', { required: true })}
                          className={errors?.cpf && styles.input_error}
                        />
                        {errors?.cpf && <p className={styles.input_menssage}>CPF inválido</p>}
                      </td>
                      <td>
                        <input type="text" placeholder="Telefone"
                          {...register("telefone", {
                            required: true,
                            validate: (value) => /^[1-9]{2}-?[9]{0,1}[0-9]{4}-?[0-9]{4}$/.test(value)
                          })}
                          className={errors?.telefone && styles.input_error}
                        />
                        {errors?.telefone && <p className={styles.input_menssage}>Telefone inválido</p>}
                      </td>
                      <td>
                        <input type="text" placeholder="Email"
                          {...register('email', {
                            required: true,
                            minLength: 6,
                            maxLength: 50,
                            validate: (value) => validator.isEmail(value)
                          })}
                          className={errors?.email && styles.input_error}
                        />
                        {errors?.email && <p className={styles.input_menssage}>Email inválido</p>}
                      </td>
                      <td>
                        <input type="password" placeholder="Senha"
                          {...register("senha", { required: true, maxLength: 30, minLength: 8 })}
                          className={errors?.senha && styles.input_error}
                        />
                        {errors?.senha && <p className={styles.input_menssage}>Senha inválida</p>}
                      </td>
                      <td>
                        <button onClick={handleSubmit(handleSave)}>Salvar</button>
                        <button onClick={() => setEditUserId(null)}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.idFuncionario}</td>
                      <td>{user.nome}</td>
                      <td>{user.descricao}</td>
                      <td>{user.cpfFunc}</td>
                      <td>{user.telefone}</td>
                      <td>{user.email}</td>
                      <td>{user.senha}</td>
                      <td>
                        <button onClick={() => handleEdit(user)}>Editar</button>
                        <button onClick={() => handleDelete(user.idFuncionario)}>Deletar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Link to="/homefunc" className={styles.return}>Voltar</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabelaFuncionario;

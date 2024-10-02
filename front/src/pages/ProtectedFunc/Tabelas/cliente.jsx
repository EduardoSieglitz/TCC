import React, { useEffect, useState } from 'react';
import styles from './cliente.module.css'; 
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import validator from 'validator';

const TabelaCliente = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await Axios.post('http://localhost:3001/tabelacliente');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (idCliente) => {
    try {
      await Axios.delete(`http://localhost:3001/delete/${idCliente}`);
      fetchData(); // Atualiza a lista após deletar
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.idCliente);
    // Preenche os valores no formulário para edição
    setValue("nome", user.nome);
    setValue("endereco", user.endereco);
    setValue("cpf", user.cpfclien);
    setValue("telefone", user.telefone);
    setValue("email", user.email);
    setValue("senha", user.senha);
  };

  const handleSave = async (data) => {
    try {
      const response = await Axios.put(`http://localhost:3001/editar/${editUserId}`, data);
      if (response.data === "Cadastrado") {
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
    <div className={styles.bodyClien__Table}>
      <div className={styles.containerClien__Table}>
        {error && <p className={styles.error_message}>{error}</p>}
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>idCliente</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Senha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.idCliente}>
                {editUserId === user.idCliente ? (
                  <>
                    <td>{user.idCliente}</td>
                    <td>
                      <input type="text" placeholder="Nome"
                        {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                        className={errors?.nome && styles.input_error}
                      />
                      {errors?.nome && <p className={styles.input_menssage}>Nome inválido</p>}
                    </td>
                    <td>
                      <input type="text" placeholder="Endereço"
                        {...register("endereco", { required: true, maxLength: 100 })}
                        className={errors?.endereco && styles.input_error}
                      />
                      {errors?.endereco && <p className={styles.input_menssage}>Endereço inválido</p>}
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
                    <td>{user.idCliente}</td>
                    <td>{user.nome}</td>
                    <td>{user.endereco}</td>
                    <td>{user.cpfClien}</td>
                    <td>{user.telefone}</td>
                    <td>{user.email}</td>
                    <td>{user.senha}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Editar</button>
                      <button onClick={() => handleDelete(user.idCliente)}>Deletar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.line}></div>
        <Link to="/homefunc" className={styles.return}>Voltar</Link>
      </div>
    </div>
  );
};

export default TabelaCliente;

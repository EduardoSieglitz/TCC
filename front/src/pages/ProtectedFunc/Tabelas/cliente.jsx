import React, { useEffect, useState } from 'react';
import styles from './cliente.module.css';
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Navbar from "../Navbar/navbar";

const TabelaCliente = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Função para formatar o endereço completo
  const formatAddress = (user) => {
    return `${user.rua}, ${user.numero} - ${user.bairro}, ${user.cidade} - ${user.estado}, CEP: ${user.cep}`;
  };

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
      await Axios.delete(`http://localhost:3001/delete/${idCliente.idCliente}/${idCliente.idUsuario}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleEdit = (user) => {
    console.log(user)
    setEditUserId(user.idCliente);
    setValue("nome", user.nome);
    setValue("rua", user.rua);
    setValue("numero", user.numero);
    setValue("bairro", user.bairro);
    setValue("cidade", user.cidade);
    setValue("estado", user.estado);
    setValue("cep", user.cep);
    setValue("cpf", user.cpfClien);
    setValue("telefone", user.telefone);
    setValue("email", user.email);
    setValue("senha", user.senha);
  };

  const handleSave = async (data) => {
    try {
      const response = await Axios.put(`http://localhost:3001/editar/${editUserId}`, data);
      if (response.data === "Atualizado") {
        setError("");
        setEditUserId(null);
        fetchData();
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
  }, []);

  const filteredUsers = users.filter((user) => {
    if (searchField === 'Nome') {
      return user.nome.toUpperCase().includes(searchValue.toUpperCase());
    } else if (searchField === 'CPF Cliente') {
      return user.cpfClien.includes(searchValue);
    } else if (searchField === 'Telefone') {
      return user.telefone?.includes(searchValue);
    } else if (searchField === 'Email') {
      return user.email?.includes(searchValue);
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <div className={styles.bodyClien__Table}>
        <div className={styles.containerClien__Table}>
          <div className={styles.filter_section}>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className={styles.select_filter}
            >
              <option value="">Selecione</option>
              <option value="Nome">Nome</option>
              <option value="CPF Cliente">CPF Cliente</option>
              <option value="Telefone">Telefone</option>
              <option value="Email">Email</option>
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
              {filteredUsers.map((user) => (
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
                        <input type="text" placeholder="Rua"
                          {...register('rua', { required: true })}
                          className={errors?.rua && styles.input_error}
                        />
                        <input type="text" placeholder="Número"
                          {...register('numero', { required: true })}
                          className={errors?.numero && styles.input_error}
                        />
                        <input type="text" placeholder="Bairro"
                          {...register('bairro', { required: true })}
                          className={errors?.bairro && styles.input_error}
                        />
                        <input type="text" placeholder="Cidade"
                          {...register('cidade', { required: true })}
                          className={errors?.cidade && styles.input_error}
                        />
                        <input type="text" placeholder="Estado"
                          {...register('estado', { required: true })}
                          className={errors?.estado && styles.input_error}
                        />
                        <input type="text" placeholder="CEP"
                          {...register('cep', { required: true })}
                          className={errors?.cep && styles.input_error}
                        />
                        {errors?.cep && <p className={styles.input_menssage}>CEP inválido</p>}
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
                          {...register('telefone', {
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
                            maxLength: 50
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
                        <input type="hidden" {...register("idUsurio")} />
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
                      <td>{formatAddress(user)}</td>
                      <td>{user.cpfClien}</td>
                      <td>{user.telefone}</td>
                      <td>{user.email}</td>
                      <td>{user.senha}</td>
                      <td>
                        <button onClick={() => handleEdit(user)}>Editar</button>
                        <button onClick={() => handleDelete(user)}>Deletar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p className={styles.error_message}>{error}</p>}
          <div className={styles.line}></div>
        </div>
      </div>
    </>
  );
};

export default TabelaCliente;

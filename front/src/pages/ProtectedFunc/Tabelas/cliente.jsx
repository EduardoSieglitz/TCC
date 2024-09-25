import React, { useEffect, useState } from 'react';
import styles from './cliente.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TabelaCliente = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    nome: '',
    endereco: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: ''
  });
  //Pegar Dados
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelacliente');
      setUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };
  
  //Deletar
  const handleDelete = async (idCliente) => {
    try {
      await axios.delete(`http://localhost:3001/clientes/${idCliente}`);
      fetchData(); 
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };
  //Tabela e Editar
  const handleEdit = (user) => {
    setEditUserId(user.idCliente);
    setEditedUser(user);
  };

  //Editar
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/clientes/${editUserId}`, editedUser);
      setEditUserId(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
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
            <tr key={user.idCliente} className={styles.row}>
              {editUserId === user.idCliente ? (
                <>
                  <td>{user.idCliente}</td>
                  <td><input type="text" name="nome" value={editedUser.nome} onChange={handleChange} /></td>
                  <td><input type="text" name="endereco" value={editedUser.endereco} onChange={handleChange} /></td>
                  <td><input type="text" name="cpf" value={editedUser.cpf} onChange={handleChange} /></td>
                  <td><input type="text" name="telefone" value={editedUser.telefone} onChange={handleChange} /></td>
                  <td><input type="text" name="email" value={editedUser.email} onChange={handleChange} /></td>
                  <td><input type="text" name="senha" value={editedUser.senha} onChange={handleChange} /></td>
                  <td>
                    <button onClick={handleSave}>Salvar</button>
                    <button onClick={() => setEditUserId(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.idCliente}</td>
                  <td>{user.nome}</td>
                  <td>{user.endereco}</td>
                  <td>{user.cpf}</td>
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
      <div>
        <Link to="/homefunc" className={styles.return}>Voltar</Link>
      </div>
    </div>
  );
};

export default TabelaCliente;

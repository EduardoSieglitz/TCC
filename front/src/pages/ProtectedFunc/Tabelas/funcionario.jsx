import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './funcionario.module.css';

const TabelaFuncionario = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelafuncionario');
      setUsers(response.data); 
    } catch (error) {
      console.error('Erro ao buscar dados do back-end:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.idFuncionario} className={styles.row}>
              <td>{user.idFuncionario}</td>
              <td>{user.nome}</td>
              <td>{user.descricao}</td>
              <td>{user.cpf}</td>
              <td>{user.telefone}</td>
              <td>{user.email}</td>
              <td>{user.senha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaFuncionario;

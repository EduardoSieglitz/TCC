import React, { useEffect, useState } from 'react';
import styles from './cliente.module.css';
import axios from 'axios';

const TabelaCliente = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelacliente');
      setUsers(response.data);
      console.log(response.data)
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
            <th>idCliente</th>
            <th>Nome</th>
            <th>endereço</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Senha</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.idCliente} className={styles.row}>
              <td>{user.idCliente}</td>
              <td>{user.nome}</td>
              <td>{user.endereco}</td>
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

export default TabelaCliente;

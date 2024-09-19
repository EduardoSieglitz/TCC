import React from 'react';
import styles from './cliente.module.css';

const users = [
  {
    idcliente: 1,
    nome: 'João Silva',
    endereço: 'Rua Ria do são Joao',
    cpf: '123.456.789-00',
    telefone: '(41) 11765-4321',
    email: 'pedro.silva@email.com',
    senha: '*******',
  },
  {
    idcliente: 2,
    nome: 'Maria Oliveira',
    descricao: 'Rua via maina',
    cpf: '987.654.321-00',
    telefone: '(71) 99876-5432',
    email: 'eduardo.oliveira@email.com',
    senha: '*******',
  },
];

const TabelaCliente = () => {
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
            <tr key={user.idFuncionario} className={styles.row}>
              <td>{user.idFuncionario}</td>
              <td>{user.nome}</td>
              <td>{user.endereço}</td>
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

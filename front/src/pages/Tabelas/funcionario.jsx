import React from 'react';
import styles from './funcionario.module.css';

const users = [
  {
    idFuncionario: 1,
    nome: 'João Silva',
    descricao: 'Gerente',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    senha: '*******',
  },
  {
    idFuncionario: 2,
    nome: 'Maria Oliveira',
    descricao: 'Desenvolvedora',
    cpf: '987.654.321-00',
    telefone: '(21) 99876-5432',
    email: 'maria.oliveira@email.com',
    senha: '*******',
  },
];

const TabelaUsuarios = () => {
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

export default TabelaUsuarios;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './agendamento.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from "../Navbar/navbar";

const TabelaAgendamento = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [editAgendamentoId, setEditAgendamentoId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("nome");  // Campo de filtro selecionado
  const [searchValue, setSearchValue] = useState("");      // Valor do input de pesquisa

  // Buscar os agendamentos no backend
  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelaagendamentos');
      setAgendamentos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Deletar um agendamento
  const handleDelete = async (idAgendamento) => {
    try {
      await axios.delete(`http://localhost:3001/deleteagendamento/${idAgendamento}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  // Preparar os valores para edição
  const handleEdit = (agendamento) => {
    setEditAgendamentoId(agendamento.idAgendamento);
    
    // Preparar o campo de data e hora no formato ISO para `datetime-local`
    const solicitacao = new Date(agendamento.solicitacao).toISOString().slice(0, 16); // Inclui data e hora
    const dataAgendada = new Date(agendamento.dataAgendada).toISOString().slice(0, 16);
    
    // Definir os valores nos campos de edição
    setValue("solicitacao", solicitacao);
    setValue("dataAgendada", dataAgendada);
    setValue("descricao", agendamento.descricao);
    setValue("status", agendamento.status);
    setValue("valor", agendamento.valor);
    setValue("servico", agendamento.servico);
    setValue("cpfclien", agendamento.cpfClien);
    setValue("cpffunc", agendamento.cpfFunc);
  };

  // Salvar as alterações de edição
  const handleSave = async (data) => {
    try {
      console.log(data)
      const response = await axios.put(`http://localhost:3001/editaragendamento/${editAgendamentoId}`, data);
      if (response.data === "Atualizado") {
        setError("");
        setEditAgendamentoId(null); // Sai do modo de edição
        fetchData(); // Atualiza a lista após salvar
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrando agendamentos com base no valor de pesquisa e campo selecionado
  const filteredAgendamentos = agendamentos.filter((agendamento) => {
    if (searchField === 'CPF Funcionario') {
      return agendamento.cpfFunc?.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchField === 'CPF Cliente') {
      return agendamento.cpfClien?.includes(searchValue);
    } else if (searchField === 'Serviço') {
      return agendamento.servico?.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true; // Caso padrão, retorna todos
  });
  
  return (
    <>
      <Navbar></Navbar>
      <div className={styles.body_agendamento}>
        <div className={styles.containerAgendamento__Table}>
          <div>{error && <p className={styles.error_message}>{error}</p>}</div>
          <div className={styles.filter_section}>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className={styles.select_filter}
            >
              <option value="CPF Cliente">CPF Cliente</option>
              <option value="CPF Funcionario">CPF Funcionário</option>
              <option value="Serviço">Serviço</option>
            </select>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Buscar por ${searchField}`}
              className={styles.input_filter}
            />
          </div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>ID</th>
                <th>Solicitação</th>
                <th>Data Agendada</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Serviço</th>
                <th>Cliente</th>
                <th>Funcionário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgendamentos.map((agendamento) => (
                <tr key={agendamento.idAgendamento} className={styles.row}>
                  {editAgendamentoId === agendamento.idAgendamento ? (
                    <>
                      <td>{agendamento.idAgendamento}</td>
                      <td>{new Date(agendamento.solicitacao).toLocaleString()}</td>
                      <td>
                        <input 
                          type="datetime-local"
                          {...register('dataAgendada', { required: true })}
                          className={errors?.dataAgendada && styles.input_error}
                        />
                        {errors?.dataAgendada && <p className={styles.input_message}>Data inválida</p>}
                      </td>
                      <td>
                        <input 
                          type="text"
                          {...register('descricao')}
                          className={errors?.descricao && styles.input_error}
                        />
                      </td>
                      <td>
                        <select {...register('status', { required: true })}>
                          <option value="E">Em andamento</option>
                          <option value="A">Agendado</option>
                          <option value="C">Concluído</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="text"
                          {...register('valor', { required: true })}
                          className={errors?.valor && styles.input_error}
                        />
                      </td>
                      <td>
                        <input 
                          type="text"
                          {...register('servico', { required: true })}
                          className={errors?.servico && styles.input_error}
                        />
                      </td>
                      <td>{agendamento.cpfClien}</td>
                      <td>{agendamento.cpfFunc}</td>
                      <td>
                        <button onClick={handleSubmit(handleSave)}>Salvar</button>
                        <button onClick={() => setEditAgendamentoId(null)}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{agendamento.idAgendamento}</td>
                      <td>{new Date(agendamento.solicitacao).toLocaleString()}</td>
                      <td>{new Date(agendamento.dataAgendada).toLocaleString()}</td>
                      <td>{agendamento.descricao}</td>
                      <td>{agendamento.status}</td>
                      <td>{agendamento.valor}</td>
                      <td>{agendamento.servico}</td>
                      <td>{agendamento.cpfClien}</td>
                      <td>{agendamento.cpfFunc}</td>
                      <td>
                        <button onClick={() => handleEdit(agendamento)}>Editar</button>
                        <button onClick={() => handleDelete(agendamento.idAgendamento)}>Deletar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TabelaAgendamento;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './agendamento.module.css';
import { useForm } from 'react-hook-form';
import Navbar from "../Navbar/navbar";

const TabelaAgendamento = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [editAgendamentoId, setEditAgendamentoId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tabelaagendamentos');
      setAgendamentos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (idAgendamento) => {
    try {
      await axios.delete(`http://localhost:3001/deleteagendamento/${idAgendamento}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };
  const handleEdit = (agendamento) => {
    setEditAgendamentoId(agendamento.idAgendamento);
    const solicitacao = new Date(agendamento.solicitacao).toISOString().slice(0, 16);
    const dataAgendada = new Date(agendamento.dataAgendada).toISOString().slice(0, 16);

    setValue("solicitacao", solicitacao);
    setValue("dataAgendada", dataAgendada);
    setValue("descricao", agendamento.descricao);
    setValue("status", agendamento.status);
    setValue("valor", agendamento.valor);
    setValue("servico", agendamento.servico);
    setValue("cpfclien", agendamento.cpfClien);
    setValue("cpffunc", agendamento.cpfFunc);
  };

  const handleSave = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/editaragendamento/${editAgendamentoId}`, data);
      if (response.data === "Atualizado") {
        setError("");
        setEditAgendamentoId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAgendamentos = agendamentos.filter((agendamento) => {
    console.log(searchField);
    if (searchField === 'CPF Funcionario') {
      return agendamento.cpfFunc?.includes(searchValue);
    } else if (searchField === 'CPF Cliente') {
      return agendamento.cpfClien?.includes(searchValue);
    } else if (searchField === 'Valor') {
      return agendamento.valor?.includes(searchValue);
    } else if (searchField === 'Solicitação') {
      return agendamento.solicitacao?.includes(searchValue);
    } else if (searchField === 'Data Agendada') {
      return agendamento.dataAgendada?.includes(searchValue);
    }
    return true;
  });
  function Serviço(servico) {
    if (servico == "P") {
      return "Personalizar";
    } else if (servico == "L") {
      return "Lavagem";
    } else {
      return "Reforma";
    }
  }
  function Status(status) {
    if (status == "E") {
      return "Em andamento";
    } else if (status == "A") {
      return "Agendado";
    } else {
      return "Concluído";
    }
  }
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
              <option value="">Selecione</option>
              <option value="CPF Cliente">CPF Cliente</option>
              <option value="CPF Funcionario">CPF Funcionário</option>
              <option value="Valor">Valor</option>
              <option value="Solicitação">Solicitação</option>
              <option value="Data Agendada">Data Agendada</option>
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
                        <select {...register('servico', { required: true })}>
                          <option value="L">Lavagem</option>
                          <option value="R">Reforma</option>
                          <option value="P">Cortina</option>
                        </select>
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
                      <td>{Status(agendamento.status)}</td>
                      <td>{agendamento.valor}</td>
                      <td>{Serviço(agendamento.servico)}</td>
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

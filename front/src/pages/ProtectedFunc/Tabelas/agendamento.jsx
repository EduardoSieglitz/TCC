import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './agendamento.module.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const TabelaAgendamento = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [editAgendamentoId, setEditAgendamentoId] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [error, setError] = useState("");

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
    setValue("solicitacao", new Date(agendamento.solicitacao).toISOString().slice(0, 10));
    setValue("dataAgendada", new Date(agendamento.dataAgendada).toISOString().slice(0, 10));
    setValue("descricao", agendamento.descricao);
    setValue("status", agendamento.status);
    setValue("servico", agendamento.serviço);
    setValue("valor", agendamento.valor);
    setValue("cpf", agendamento.clientecpf);
  };

  const handleSave = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/editaragendamento/${editAgendamentoId}`, data);
      if (response.data === "Atualizado") {
        setError("");
        setEditAgendamentoId(null); // Sai do modo de edição
        fetchData(); // Atualiza a lista após salvar
      } else {
        setError("Erro ao salvar os dados do agendamento");
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.body_agendamento}>
      <div className={styles.containerAgendamento__Table}>
        <div>{error && <p className={styles.error_message}>{error}</p>}</div>
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
            {agendamentos.map((agendamento) => (
              <tr key={agendamento.idAgendamento} className={styles.row}>
                {editAgendamentoId === agendamento.idAgendamento ? (
                  <>
                    <td>{agendamento.idAgendamento}</td>
                    <td>
                      <input type="date"
                        {...register('solicitacao', { required: true })}
                        className={errors?.solicitacao && styles.input_error}
                      />
                      {errors?.solicitacao && <p className={styles.input_message}>Data inválida</p>}
                    </td>
                    <td>
                      <input type="date"
                        {...register('dataAgendada', { required: true })}
                        className={errors?.dataAgendada && styles.input_error}
                      />
                      {errors?.dataAgendada && <p className={styles.input_message}>Data inválida</p>}
                    </td>
                    <td>
                      <input type="text" placeholder="Descrição"
                        {...register("descricao")}
                        className={errors?.descricao && styles.input_error}
                      />
                    </td>
                    <td>
                      <select {...register("status", { required: true })}
                        className={errors?.status && styles.input_error}>
                        <option value="E">Em andamento</option>
                        <option value="A">Agendado</option>
                        <option value="C">Concluído</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" placeholder="Serviço"
                        {...register('servico', { required: true })}
                        className={errors?.idServico && styles.input_error}
                      />
                    </td>
                    <td>
                      <input type="text" placeholder="Valor"
                        {...register('valor', { required: true })}
                        className={errors?.idFuncionario && styles.input_error}
                      />
                    </td>
                    <td>
                      <input type="text" placeholder="CPF"
                        {...register('cpf', { required: true })}
                        className={errors?.idCliente && styles.input_error}
                      />
                    </td>
                    <td>
                      <button onClick={handleSubmit(handleSave)}>Salvar</button>
                      <button onClick={() => setEditAgendamentoId(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{agendamento.idAgendamento}</td>
                    <td>{new Date(agendamento.solicitacao).toLocaleDateString()}</td>
                    <td>{new Date(agendamento.dataAgendada).toLocaleDateString()}</td>
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
        <div>
          <Link to="/homefunc" className={styles.return}>Voltar</Link>
        </div>
      </div>
    </div>
  );
};

export default TabelaAgendamento;

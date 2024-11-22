import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './servico.module.css';
import { useForm } from 'react-hook-form';
import NavbarCliente from '../../../components/navbar';
import { NavLink } from 'react-router-dom';

const TabelaServico = () => {
    const [servico, setServico] = useState([]);
    const [editServicoId, setEditServicoId] = useState(null);
    const [showDescModal, setShowDescModal] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");

    // Pegando dados serviço
    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:3001/tabelaservico');
            const servicosFiltrados = response.data.filter((Servico) => Servico.alternar === 'A');
            setServico(servicosFiltrados);
        } catch (error) {
            console.error(error);
        }
    };
    //

    // Escondendo Servico
    const handleDelete = async (idServico) => {
        try {
            await axios.put(`http://localhost:3001/deleteservico/${idServico}`);
            fetchData();
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    const handleEdit = (Servico) => {
        setEditServicoId(Servico.idServico);
        setValue("servico", Servico.servico);
        setValue("descricao", Servico.descricao);
        setSelectedServico(Servico);
    };

    // Editar Serviço
    const handleSave = async (data) => {
        try {
            const response = await axios.put(`http://localhost:3001/editarservico/${editServicoId}`, data);
            if (response.data === "Atualizado") {
                setError("");
                setEditServicoId(null);
                setSelectedServico(null);
                fetchData();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const openDescModal = (Servico) => {
        setSelectedServico(Servico);
        setShowDescModal(true);
    };

    const closeDescModal = () => {
        setSelectedServico(null);
        setShowDescModal(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredServico = servico.filter((Servico) => {
        if (searchField === 'servico') {
            return Servico.servico?.includes(searchValue);
        } else if (searchField === 'descricao') {
            return Servico.descricao?.includes(searchValue);
        }
        return true;
    });

    return (
        <>
            <NavbarCliente />
            <br /><br />
            <br /><br />
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
                    <NavLink to="/registro-servico" className={styles.register_button}>
                        Registrar Serviço
                    </NavLink>
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
                            <th>Serviço</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServico.map((servico) => (
                            <tr key={servico.idservico} className={styles.row}>
                                <td>{servico.servico}</td>
                                <td onClick={() => openDescModal(servico)}>Ver Descrição</td>
                                <td>
                                    <button className={styles.edit_button} onClick={() => handleEdit(servico)}>Editar</button>
                                    <button className={styles.delete_button} onClick={() => handleDelete(servico.idServico)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showDescModal && selectedServico && (
                <div className={styles.modalAgendamento}>
                    <div className={styles.modalContent}>
                        <h2>Descrição do Serviço</h2>
                        <p><strong>Descrição:</strong> {selectedServico.descricao}</p>
                        <button onClick={closeDescModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}
            {editServicoId && selectedServico && (
                <>
                    <div className={styles.modalAgendamento}>
                        <div className={styles.modalContent}>
                            <td>
                                <input
                                    type="text"
                                    {...register('servico', { required: true })}
                                    className={errors?.dataAgendada && styles.input_error}
                                />
                                {errors?.dataAgendada && <p className={styles.input_message}>Data inválida</p>}
                            </td>
                            <td>
                                <textarea
                                    type="text"
                                    placeholder="Descrição"
                                    {...register('descricao', { maxLength: 200 })}
                                    className={errors?.descricao && styles.input_error}
                                />
                                {errors?.descricao?.type === 'maxLength' && <p className={styles.input_message}>Máximo de 200 caracteres</p>}
                            </td>
                            <td>
                                <button onClick={handleSubmit(handleSave)}>Salvar</button>
                                <button onClick={() => setEditServicoId(null)}>Cancelar</button>
                            </td>
                        </div>
                    </div>
                </>
            )}

        </>
    );
};

export default TabelaServico;

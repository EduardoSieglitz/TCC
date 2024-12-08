import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './agendamento.module.css';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import Navbar from '../../../../components/navbar';
import Footer from '../../../../components/Footer/footer';
import { FaTrash, FaPen, FaEye, FaXmark, FaCheck } from 'react-icons/fa6';

export default function TabelaAgendamento() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [selectedAgendamento, setSelectedAgendamento] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const [error, setError] = useState("");
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filteredServicos, setFilteredServicos] = useState([]);
    const [showInfoAgendamento, setShowInfoAgendamento] = useState(false);
    const [showEditAgendamento, setShowEditAgendamento] = useState(false);
    const [showDeleteAgendamento, setShowDeleteAgendamento] = useState(false);
    const [showRegAgendamento, setShowRegAgendamento] = useState(false);
    const [showConfirmAlteracaoAgendamento, setShowConfirmAlteracaoAgendamento] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmCad, setShowConfirmCad] = useState(false);

    // Fetch agendamentos data
    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:3001/tabelaagendamentos');
            setAgendamentos(response.data);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        }
    };

    const fetchDataServico = async () => {
        try {
            const response = await axios.post('http://localhost:3001/tabelaservico');
            const servicosFiltrados = response.data.filter((Servico) => Servico.alternar === 'A');
            setFilteredServicos(servicosFiltrados);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (Agendamento) => {
        try {
            const response = await axios.post(`http://localhost:3001/deleteagendamento/${agendamentos[0].idAgendamento}`, Agendamento);
            console.log(response.data)
            if (response.data == 'Deletado com sucesso.') {
                handleAcaoConcluida();
            } else {
                setError(response.data);
            }
        }
        catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    async function dados(formData) {
        setIsLoading(true);
        try {
            const response = await Axios.post('http://localhost:3001/registraragendamento', {
                emailc: formData.emailCliente,
                emailf: formData.emailFuncionario,
                servico: formData.servico,
                valor: formData.valor,
                status: formData.status,
                solicitacao: formData.solicitacao,
                dataAgendada: formData.dataAgendada,
                descricao: formData.descricao,
            });

            if (response.data === "Cadastrado") {
                handleAcaoConcluida();
            } else {
                setError(response.data);
            }
        } catch (err) {
            console.error("Erro no cadastro:", err);
        } finally {
            setIsLoading(false);
        }
    }

    // Save edited agendamento data
    const handleSave = async (data) => {
        try {
            console.log(data)
            const response = await axios.put(`http://localhost:3001/editaragendamento/${showEditAgendamento}`, data);
            if (response.data === "Atualizado") {
                handleAcaoConcluida();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const handleClose = () => {
        setSelectedAgendamento(null);
        setShowConfirmCad(false);
        setShowInfoAgendamento(false);
        setShowEditAgendamento(false);
        setShowDeleteAgendamento(false);
        setShowRegAgendamento(false);
        setShowConfirmAlteracaoAgendamento(false);
        setValue("dataAgendada", "");
        setValue("status", "");
        setValue("servico", "");
        setValue("valor", "");
        setValue("descricao", "");
        setValue("email", "");
        setValue("senha", "");
        setError("");
    };

    const openInfoAgendamento = (agendamento) => {
        setSelectedAgendamento(agendamento);
        setShowInfoAgendamento(true);
    }

    const openEditAgendamento = (agendamento) => {
        const dataAgendada = new Date(agendamento.dataAgendada);
        const dataFormatada = `${dataAgendada.getFullYear()}-${String(dataAgendada.getMonth() + 1).padStart(2, '0')}-${String(dataAgendada.getDate()).padStart(2, '0')}T${String(dataAgendada.getHours()).padStart(2, '0')}:${String(dataAgendada.getMinutes()).padStart(2, '0')}`;
        setValue("dataAgendada", dataFormatada);
        setShowEditAgendamento(agendamento.idAgendamento);
        setValue("status", agendamento.status);
        setValue("servico", agendamento.servico);
        setValue("valor", agendamento.valor);
        setValue("descricao", agendamento.descricao);
        setSelectedAgendamento(agendamento);
    }

    const openConfirmDeleteAgendamento = (agendamento) => {
        setSelectedAgendamento(agendamento);
        setShowDeleteAgendamento(true);
    }

    const openRegAgendamento = () => {
        setShowRegAgendamento(true);
    }

    useEffect(() => {
        fetchData();
        fetchDataServico();
    }, []);

    const handleAcaoConcluida = () => {
        handleClose();
        setShowConfirmCad(true);
        fetchData();
    }

    const filteredAgendamentos = agendamentos.filter((agendamento) => {
        if (searchField === 'Email') {
            return agendamento.emailc?.includes(searchValue);
        } else if (searchField === 'Valor') {
            return agendamento.valor?.includes(searchValue);
        } else if (searchField === 'Solicitação') {
            return new Date(agendamento.solicitacao).toLocaleString()?.includes(searchValue);
        } else if (searchField === 'Data Agendada') {
            return new Date(agendamento.dataAgendada).toLocaleString()?.includes(searchValue);
        }
        return true;
    });

    function Status(status) {
        if (status === "EA") {
            return "Andamento";
        } if (status === "EE") {
            return "Esperando";
        } if (status === "A") {
            return "Atrasado";
        } if (status === "C") {
            return "Concluído";
        }
    }

    function ClasseStatus(status) {
        if (status === "EA") {
            return "ea";
        } if (status === "EE") {
            return "ee";
        } if (status === "A") {
            return "a";
        } if (status === "C") {
            return "c";
        }
    }

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                {/* Barra de pesquisa */}
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={`Buscar ${searchField}`}
                        className={styles.searchInput}
                    />
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Filtrar</option>
                        <option value="Email">Email Cliente</option>
                        <option value="Valor">Valor</option>
                        <option value="Solicitação">Data Solicitada</option>
                        <option value="Data Agendada">Data Agendada</option>
                    </select>
                </div>
                <div className={styles.regUser}>
                    <button className={styles.action_btn} onClick={openRegAgendamento}>Registrar Agendamento</button>
                </div>

                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr className={styles.tableRow}>
                            <th className={`${styles.tableHead} ${styles.padding}`}>Status</th>
                            <th className={styles.tableHead}>Email do Solicitante</th>
                            <th className={styles.tableHead}>Serviço</th>
                            <th className={styles.tableHead}>Valor</th>
                            <th className={styles.tableHead}>Informações</th>
                            <th className={styles.tableHead}>Ações</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {filteredAgendamentos.map((agendamento) => (
                            <tr key={agendamento.idAgendamento} className={styles.tableRow}>
                                <td className={`${styles.status} ${styles.padding}`}>
                                    {/* Adicionar o className do seu respectivo valor de status na div abaixo. Essa className 'a' é apenas para teste, pode tirar */}
                                    <div className={`${styles.borderStatus} ${styles[ClasseStatus(agendamento.status)]}`}> {/* Classes para adicionar: className={`${styles.ea} ${styles.ee} ${styles.a} ${styles.c}`}> */}
                                        {Status(agendamento.status)}
                                    </div>
                                </td>
                                <td className={styles.solicitante}>{agendamento.emailc}</td>
                                <td className={styles.servico}>{agendamento.servico}</td>
                                <td className={styles.valor}>R${agendamento.valor}</td>
                                <td className={styles.info_agendamento}>
                                    <div className={styles.center_info} onClick={() => openInfoAgendamento(agendamento)}>
                                        <FaEye className={styles.icon} />
                                        Ver Informações
                                    </div>
                                </td>
                                <td className={styles.actions}>
                                    <div className={styles.center_actions}>
                                        <FaPen className={styles.icon} onClick={() => openEditAgendamento(agendamento)} />
                                        <FaTrash className={`${styles.icon} ${styles.icon_trash}`} onClick={() => openConfirmDeleteAgendamento(agendamento.idAgendamento)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.overlay}
                style={{ display: showInfoAgendamento || selectedAgendamento || showEditAgendamento || showDeleteAgendamento || showRegAgendamento || showConfirmAlteracaoAgendamento || showConfirmCad ? 'block' : 'none' }}
            />

            <div className={`${styles.popup_container} ${showRegAgendamento || showInfoAgendamento ? styles.popup_container_large : ""}`}
                style={{ display: showInfoAgendamento || selectedAgendamento || showEditAgendamento || showDeleteAgendamento || showRegAgendamento || showConfirmAlteracaoAgendamento || showConfirmCad ? 'block' : 'none' }}
            >

                {showInfoAgendamento && selectedAgendamento && (
                    <div className={styles.container_infoAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Informações</div>
                        </div>

                        <div className={styles.content}>
                            <div className={styles.columns_container}>
                                <div className={styles.column}>

                                    <label className={`${styles.label} ${styles.label_popup}`}>Solicitante</label>
                                    <input
                                        type="text"
                                        name='solicitante'
                                        className={styles.input_info} value={selectedAgendamento.emailc}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Cadastro por</label>
                                    <input
                                        type="text"
                                        name='cadFunc'
                                        className={styles.input_info} value={selectedAgendamento.emailf}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Serviço</label>
                                    <input
                                        type="text"
                                        name='servico'
                                        className={styles.input_info} value={selectedAgendamento.servico}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Status</label>
                                    <input
                                        type="text"
                                        name='status'
                                        className={styles.input_info} value={Status(selectedAgendamento.status)}
                                        disabled
                                    />
                                </div>
                                <div className={styles.column}>
                                    <label className={`${styles.label} ${styles.label_popup}`}>Valor</label>
                                    <input
                                        type="text"
                                        name='valor'
                                        className={styles.input_info} value={`R$${selectedAgendamento.valor}`}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Data agendada</label>
                                    <input
                                        type="text"
                                        name='dateAgendada'
                                        className={styles.input_info} value={new Date(selectedAgendamento.dataAgendada).toLocaleString()}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Data solicitada</label>
                                    <input
                                        type="text"
                                        name='dateSolicitada'
                                        className={styles.input_info}value={new Date(selectedAgendamento.solicitacao).toLocaleDateString()}
                                        disabled
                                    />

                                    <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                                    <textarea
                                        type="text"
                                        name='dateSolicitada'
                                        className={`${styles.input_info} ${styles.textarea}`} value={selectedAgendamento.descricao}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className={styles.center_btn}>
                                <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditAgendamento && selectedAgendamento && (
                    <div className={styles.container_editAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Editando Informações</div>
                        </div>

                        <div className={styles.content}>
                            <label className={`${styles.label} ${styles.label_popup}`}>Data agendada</label>
                            <input
                                type="datetime-local"
                                {...register('dataAgendada', { required: true })}
                                className={`${styles.input_info} ${errors?.dataAgendada && styles.input_error}`}
                            />
                            {errors?.dataAgendada && <p className={styles.input_message}>Data inválida</p>}

                            <label className={`${styles.label} ${styles.label_popup}`}>Status</label>
                            <select
                                {...register('status', { required: true })}
                                className={styles.filterSelect}
                            >
                                <option value="EE">Esperando</option>
                                <option value="EA">Andamento</option>
                                <option value="C">Concluído</option>
                                <option value="A">Atrasado</option>
                            </select>

                            <label className={`${styles.label} ${styles.label_popup}`}>Serviço</label>
                            <select
                                {...register('servico', { required: true })}
                                className={styles.filterSelect}
                            >
                                {filteredServicos.map((servico) => (
                                    <option key={servico.idServico} value={servico.servico}>
                                        {servico.servico}
                                    </option>
                                ))}
                            </select>

                            <label className={`${styles.label} ${styles.label_popup}`}>Valor</label>
                            <input
                                type="text"
                                placeholder="Valor"
                                {...register('valor', { required: true })}
                                className={`${styles.input_info} ${errors?.cpfFuncionario && styles.input_error}`}
                            />
                            {errors?.valor?.type === 'required' && <p className={styles.input_message}>required</p>}

                            <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                            <textarea
                                type="text"
                                placeholder="Descrição"
                                {...register('descricao', { maxLength: 200 })}
                                className={`${styles.input_info} ${styles.textarea} ${errors?.descricao && styles.input_error}`}
                            />
                            {errors?.descricao?.type === 'maxLength' && <p className={styles.input_message}>Máximo de 200 caracteres</p>}
                        </div>

                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.register_btn} `} onClick={handleSubmit(handleSave)}>Alterar</button>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {showDeleteAgendamento && selectedAgendamento && (
                    <div className={styles.container_deleteAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Excluir</div>
                            <center>{<p className={styles.input_message}>{error}</p>}</center>
                        </div>

                        <form>
                            <p className={styles.info}>
                                Digite o nome do solicitante e o código de administrador para poder exclui-la.
                            </p>

                            <label className={`${styles.label} ${styles.label_popup}`}>Digite o email do usuário</label>
                            <input
                                type="email"
                                placeholder='Email'
                                {...register('email', {
                                    required: true,
                                    maxLength: 255
                                })}
                                className={`${styles.input_info} ${errors?.email && styles.input_error}`}
                            />
                            {errors?.email?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                            {errors?.email?.type == 'maxLength' && <p className={styles.input_message}>Email muito grande</p>}


                            <label className={`${styles.label} ${styles.label_popup}`}>Digite o código de adm</label>
                            <input
                                type="password"
                                {...register("senha", { required: true, minLength: 8, maxLength: 50 })}
                                placeholder="Senha"
                                className={`${styles.input_info} ${errors?.senha && styles.input_error}`}
                            />
                            {errors?.senha?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                            {errors?.senha?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 8 caracteres</p>}
                            {errors?.senha?.type == 'maxLength' && <p className={styles.input_message}>Senha muito grande</p>}

                            <div className={styles.checkbox_confirmDelete}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox_accountDelete}
                                    {...register("checkbox", {
                                        required: true
                                    })}
                                />
                                <p className={styles.info}>Estou ciente que ao deletar a conta, todas as informações serão perdidas permanentemente.</p>
                                {errors?.checkbox?.type == 'required' && <p className={styles.input_message}>Tem que confirma para proceguir</p>}
                            </div>

                            <button type="button" onClick={() => { handleSubmit(handleDelete)() }} className={`${styles.action_btn} ${styles.register_btn}`} >Excluir</button>
                        </form>

                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {showConfirmAlteracaoAgendamento && (
                    <div className={styles.container_infoSaved}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <FaCheck className={styles.icon_infoSaved} />
                        <p className={styles.info}>
                            Alteração relizada com sucesso!
                        </p>

                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {/* Popup de confirmação de cadastro de Usuário */}
                {showConfirmCad && (
                    <div className={styles.container_infoSaved}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <FaCheck className={styles.icon_infoSaved} />
                        <p className={styles.info}>
                            Ação realizada com sucesso!
                        </p>

                        <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                    </div>
                )}

                {showRegAgendamento && (
                    <div className={styles.container_deleteAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Registrar</div>
                        </div>
                        <center>{<p className={styles.input_message}>{error}</p>}</center>
                        <div className={styles.content}>
                            <div className={styles.columns_container}>
                                <div className={styles.column}>
                                    <label className={`${styles.label} ${styles.label_popup}`}>Email do cliente</label>
                                    <input
                                        type="text"
                                        placeholder="Email do Cliente"
                                        {...register('emailCliente', {
                                            required: "Email do cliente é obrigatório",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Email inválido",
                                            },
                                        })}
                                        className={`${styles.input_info} ${errors?.emailCliente && styles.input_error}`}
                                    />
                                    {errors?.emailCliente && <p className={styles.input_message}>{errors.emailCliente.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Email do funcionário</label>
                                    <input
                                        type="text"
                                        placeholder="Email do Funcionario"
                                        {...register('emailFuncionario', {
                                            required: "Email do funcionário é obrigatório",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Email inválido",
                                            },
                                        })}
                                        className={`${styles.input_info} ${errors?.emailFuncionario && styles.input_error}`}
                                    />
                                    {errors?.emailFuncionario && <p className={styles.input_message}>{errors.emailFuncionario.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Serviço</label>
                                    <select
                                        {...register('servico', { required: "Serviço é obrigatório" })}
                                        className={`${styles.filterSelect} ${errors?.servico && styles.input_error}`}
                                    >
                                        <option value="">Selecione o Serviço</option>
                                        {filteredServicos.map((servico) => (
                                            <option key={servico.idServico} value={servico.servico}>
                                                {servico.servico}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.servico && <p className={styles.input_message}>{errors.servico.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Valor</label>
                                    <input
                                        type="text"
                                        placeholder="Valor"
                                        {...register('valor', {
                                            required: "Valor é obrigatório",
                                            pattern: {
                                                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                                message: "Valor inválido",
                                            },
                                        })}
                                        className={`${styles.input_info} ${errors?.valor && styles.input_error}`}
                                    />
                                    {errors?.valor && <p className={styles.input_message}>{errors.valor.message}</p>}
                                </div>

                                <div className={styles.column}>
                                    <label className={`${styles.label} ${styles.label_popup}`}>Status</label>
                                    <select
                                        {...register('status', { required: "Status é obrigatório" })}
                                        className={`${styles.filterSelect} ${errors?.status && styles.input_error}`}
                                    >
                                        <option value="">Selecione o status</option>
                                        <option value="EE">Esperando</option>
                                        <option value="EA">Andamento</option>
                                        <option value="C">Concluído</option>
                                        <option value="A">Atrasado</option>
                                    </select>
                                    {errors?.status && <p className={styles.input_message}>{errors.status.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Data solicitada</label>
                                    <input
                                        type="date"
                                        {...register('solicitacao', { required: "Data de solicitação é obrigatória" })}
                                        className={`${styles.input_info} ${errors?.solicitacao && styles.input_error}`}
                                    />
                                    {errors?.solicitacao && <p className={styles.input_message}>{errors.solicitacao.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Data agendada</label>
                                    <input
                                        type="datetime-local"
                                        {...register('dataAgendada', { required: "Data agendada é obrigatória" })}
                                        className={`${styles.input_info} ${errors?.dataAgendada && styles.input_error}`}
                                    />
                                    {errors?.dataAgendada && <p className={styles.input_message}>{errors.dataAgendada.message}</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                                    <input
                                        type="text"
                                        placeholder="Descrição"
                                        {...register('descricao', { maxLength: { value: 200, message: "Máximo de 200 caracteres" } })}
                                        className={`${styles.input_info} ${errors?.descricao && styles.input_error}`}
                                    />
                                    {errors?.descricao && <p className={styles.input_message}>{errors.descricao.message}</p>}
                                </div>
                            </div>

                            <div className={styles.center_btn}>
                                <button
                                    className={`${styles.action_btn} ${styles.register_btn}`}
                                    onClick={handleSubmit(dados)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                                </button>
                                <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Cancelar</button>
                            </div>
                        </div>
                    </div>

                )}
            </div>

            <Footer />
        </>
    );
};
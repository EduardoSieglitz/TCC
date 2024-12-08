import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './servico.module.css';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import Navbar from '../../../../components/navbar';
import Footer from '../../../../components/Footer/footer';
import { FaTrash, FaPen, FaEye, FaXmark, FaCheck } from 'react-icons/fa6';

export default function TabelaServico() {
    const [servico, setServico] = useState([]);
    const [selectedServico, setSelectedServico] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [showInfoServico, setShowInfoServico] = useState(false);
    const [showEditServico, setShowEditServico] = useState(false);
    const [showRegServico, setShowRegServico] = useState(false);
    const [showDeleteServico, setShowDeleteServico] = useState(false);
    const [showConfirmAlteracaoServico, setShowConfirmAlteracaoServico] = useState(false);
    const [showConfirmCad, setShowConfirmCad] = useState(false);

    async function dados(event) {
        try {
            const request = await axios.post("http://localhost:3001/registrarservico", {
                descricao: event.descricao,
                servico: event.servico,
            });
            if (request.data === "Cadastrado") {
                handleAcaoConcluida();
                fetchData();
            }
        } catch (error) {
            setError("");
        }
    }

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

    const handleClose = () => {
        setSelectedServico(null);
        setShowInfoServico(false);
        setShowEditServico(false);
        setShowDeleteServico(false);
        setShowConfirmCad(false);
        setShowRegServico(false);
        setShowConfirmAlteracaoServico(false);
        setValue("servico", "");
        setValue("descricao", "");
        setError("");
    };

    const handleAcaoConcluida = () => {
        handleClose();
        setShowConfirmCad(true);
        fetchData();
    }

    // Escondendo Servico
    const handleDelete = async (Servico) => {
        try {
            const response = await axios.post(`http://localhost:3001/deleteservico/${selectedServico}`, Servico);
            if (response.data == "Deletado com sucesso.") {
                handleAcaoConcluida();
            } else {
                setError(response.data);
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    const openRegServico = () => {
        setShowRegServico(true);
        setValue("servico", "");
        setValue("descricao", "");
    }

    const openInfoServico = (servico) => {
        setSelectedServico(servico);
        setShowInfoServico(true);
    }

    const openEditServico = (servico) => {
        setShowEditServico(servico.idServico);
        setValue("servico", servico.servico);
        setValue("descricao", servico.descricao);
        setSelectedServico(servico);
    }

    const openConfirmAlteracaoServico = () => {
        setShowConfirmAlteracaoServico(true);
    }

    const openConfirmDeleteServico = (servico) => {
        setSelectedServico(servico);
        setValue("servico", "");
        setValue("senha", "");
        setShowDeleteServico(true);
    }

    // Editar Serviço
    const handleSave = async (data) => {
        try {
            const response = await axios.put(`http://localhost:3001/editarservico/${showEditServico}`, data);
            if (response.data === "Atualizado") {
                fetchData();
                handleAcaoConcluida();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredServico = servico.filter((Servico) => {
        if (searchField === 'servico') {
            return Servico.servico?.includes(searchValue.toUpperCase());
        } else if (searchField === 'descricao') {
            return Servico.descricao?.includes(searchValue);
        }
        return true;
    });

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.searchBar}>
                    {/* Vai filtrar pelo nome do serviço */}
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
                        <option value="descricao">Descriçao</option>
                        <option value="servico">Serviço</option>
                    </select>
                </div>
                <div className={styles.regUser}>
                    <button className={styles.action_btn} onClick={openRegServico}>Registrar Serviço</button>
                </div>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr className={styles.tableRow}>
                            <th className={`${styles.tableHead} ${styles.padding}`}>Serviço</th>
                            <th className={styles.tableHead}>Descrição</th>
                            <th className={styles.tableHead}>Ações</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {filteredServico.map((servico) => (
                            <tr key={servico.idservico} className={styles.tableRow}>
                                <td className={`${styles.status} ${styles.padding}`}>{servico.servico}</td>
                                <td className={styles.info_servico}>
                                    <div className={styles.center_info} onClick={() => openInfoServico(servico)}>
                                        <FaEye className={styles.icon} />
                                        Ver Descrição
                                    </div>
                                </td>
                                <td className={styles.actions}>
                                    <div className={styles.center_actions}>
                                        <FaPen className={styles.icon} onClick={() => openEditServico(servico)} />
                                        <FaTrash className={`${styles.icon} ${styles.icon_trash}`} onClick={() => openConfirmDeleteServico(servico.idServico)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.overlay}
                style={{ display: showInfoServico || selectedServico || showEditServico || showDeleteServico || showRegServico || showConfirmAlteracaoServico || showConfirmCad ? 'block' : 'none' }}
            />

            <div className={`${styles.popup_container} ${showRegServico ? styles.popup_container_large : ""}`}
                style={{ display: showInfoServico || selectedServico || showEditServico || showDeleteServico || showRegServico || showConfirmAlteracaoServico || showConfirmCad ? 'block' : 'none' }}
            >

                {showInfoServico && selectedServico && (
                    <div className={styles.container_infoServico}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Descrição</div>
                        </div>

                        <div className={styles.content}>
                            <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                            <textarea
                                type="text"
                                name='descricao'
                                className={`${styles.input_info} ${styles.textarea}`} value={selectedServico.descricao}
                                disabled
                            />
                        </div>

                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {showEditServico && selectedServico && (
                    <div className={styles.container_infoServico}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Editar Serviço</div>
                        </div>
                        <div className={styles.content}>
                            <label className={`${styles.label} ${styles.label_popup}`}>Nome do serviço</label>
                            <input
                                type="text"
                                {...register("servico", {
                                    required: "Esse campo é obrigatório",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]+$/, // Aceita letras (incluindo acentuação) e espaços
                                        message: "Números não são permitidos"
                                    }
                                })}
                                placeholder="Nome do serviço"
                                className={styles.input_info}
                            />
                            {/* Exibição das mensagens de erro */}
                            {errors?.servico?.type === 'required' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}
                            {errors?.servico?.type === 'pattern' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}


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
                            <button className={`${styles.action_btn} ${styles.register_btn} `} onClick={() => { handleSubmit(handleSave)() }} >Alterar</button>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {showConfirmAlteracaoServico && (
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

                {showDeleteServico && selectedServico && (
                    <div className={styles.container_infoServico}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Excluir Serviço</div>
                        </div>
                        <center><p className={styles.input_message}>{error}</p></center>
                        <form onSubmit={(e) => {
                            e.preventDefault(); // Previne o comportamento padrão
                            handleDelete(selectedServico.idServico);
                        }}>
                            <p className={styles.info}>
                                Digite o nome do serviço e o código de administrador para poder exclui-lo.
                            </p>

                            <label className={`${styles.label} ${styles.label_popup}`}>
                                Digite o nome do serviço
                            </label>
                            <input
                                type="text"
                                {...register("servico", {
                                    required: "Esse campo é obrigatório",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]+$/, // Aceita letras (incluindo acentuação) e espaços
                                        message: "Números não são permitidos"
                                    }
                                })}
                                placeholder="Nome do serviço"
                                className={styles.input_info}
                            />
                            {/* Exibição das mensagens de erro */}
                            {errors?.servico?.type === 'required' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}
                            {errors?.servico?.type === 'pattern' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}
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
                            </div >

                            <button type="button" onClick={() => { handleSubmit(handleDelete)() }} className={`${styles.action_btn}   ${styles.register_btn}`} >
                                Excluir
                            </button>
                        </form>


                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                        </div>
                    </div>
                )}

                {showRegServico && (
                    <div className={styles.container_deleteAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Registrar Serviço</div>
                        </div>
                        <div className={styles.content}>
                            <label className={`${styles.label} ${styles.label_popup}`}>Nome do serviço</label>
                            <input
                                type="text"
                                {...register("servico", {
                                    required: "Esse campo é obrigatório",
                                    pattern: {
                                        value: /^[a-zA-ZÀ-ÿ\s]+$/, // Aceita letras (incluindo acentuação) e espaços
                                        message: "Números não são permitidos"
                                    }
                                })}
                                placeholder="Nome do serviço"
                                className={styles.input_info}
                            />
                            {/* Exibição das mensagens de erro */}
                            {errors?.servico?.type === 'required' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}
                            {errors?.servico?.type === 'pattern' && (
                                <p className={styles.input_message}>{errors.servico.message}</p>
                            )}


                            <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                            <input
                                type="text"
                                placeholder="Descrição"
                                {...register('descricao', { maxLength: 200 })}
                                className={`${styles.input_info} ${errors?.descricao && styles.input_error}`}
                            />
                            {errors?.descricao?.type === 'maxLength' && <p className={styles.input_message}>Máximo de 200 caracteres</p>}
                        </div>

                        <div className={styles.center_btn}>
                            <button className={`${styles.action_btn} ${styles.register_btn}`} onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>

            {/* {showDescModal && selectedServico && (
                <div className={styles.modalServico}>
                    <div className={styles.modalContent}>
                        <h2>Descrição do Serviço</h2>
                        <p><strong>Descrição:</strong> {selectedServico.descricao}</p>
                        <button onClick={closeDescModal} className={styles.closeButton}>Fechar</button>
                    </div>
                </div>
            )}
            {editServicoId && selectedServico && (
                <>
                    <div className={styles.modalServico}>
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
            )} */}

            < Footer />
        </>
    );
};
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './cortina.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Navbar from "../../../../components/navbar";
import Footer from "../../../../components/Footer/footer";
import { FaXmark, FaCheck } from 'react-icons/fa6';

export default function TabelaCortina() {
    const [cortinas, setCortinas] = useState([]);
    const [selectedCortina, setSelectedCortina] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filterOpções, setFilterOpções] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [showInfoCortina, setShowInfoCortina] = useState(false);
    const [showDeleteCortina, setShowDeleteCortina] = useState(false);
    const [showRegCortina, setShowRegCortina] = useState(false);
    const [showConfirmAlteracaoCortina, setShowConfirmAlteracaoCortina] = useState(false);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [SelectedImage, setSelectedImage] = useState();
    const navigate = useNavigate();

    async function dados(event) {
        const formData = new FormData();
        formData.append('nome', event.nome);
        formData.append('descricao', event.descricao);
        formData.append('image', SelectedImage);
        formData.append('modelo', event.modelo);
        formData.append('material', event.material);

        try {
            const request = await axios.post("http://localhost:3001/registrarcortina", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (request.data === "Cadastrado") {
                setError("");
                fetchData();
                handleClose()
            } else {
                console.log(request.data);
                setError("Só é aceito png, jpg e jpeg");
            }
        } catch (error) {
            console.log("Erro: " + error);
            setError("Ocorreu um erro ao registrar a cortina.");
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.post("http://localhost:3001/tabelacortinas");
            setCortinas(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file); // Salva o arquivo no estado
            const previewUrl = URL.createObjectURL(file); // Gera uma URL para a pré-visualização
            setSelectedImagePreview(previewUrl); // Atualiza a pré-visualização
        }
    };


    const handleSave = async (data) => {
        console.log(data)
        const formData = new FormData();
        formData.append('nome', data.nome);
        formData.append('descricao', data.descricao);
        formData.append('modelo', data.modelo);
        formData.append('material', data.material);
        formData.append('image', SelectedImage);
        console.log(SelectedImage)
        console.log(data)
        try {
            const response = await axios.put(`http://localhost:3001/editarcortina/${selectedCortina.idCortina}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data === "Atualizado") {
                fetchData(); // Atualiza a lista de cortinas
                setSelectedCortina(null); // Fecha o modal
                handleClose();
                openConfirmAlteracaoCortina();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deletecortina/${id}`);
            fetchData(); // Atualiza a lista de cortinas
            handleClose();
            openConfirmAlteracaoCortina();
        } catch (error) {
            console.error("Erro ao excluir cortina:", error);
        }
    };

    const handleClose = () => {
        setSelectedCortina(null);
        setSelectedImagePreview(null);
        setShowInfoCortina(false);
        setShowRegCortina(false);
        setShowConfirmAlteracaoCortina(false);
        setIsEditable(false);
    };

    const openInfoCortina = (cortina) => {
        setShowInfoCortina(cortina.idCortina);
        setValue("nome", cortina.nome);
        setValue("descricao", cortina.descricao);
        setValue("material", cortina.material);
        setValue("modelo", cortina.modelo);
        setSelectedCortina(cortina);
    }

    const editCortina = (cortina) => {
        setIsEditable(true);
    }

    const stopEditCortina = (cortina) => {
        setIsEditable(false);
    }

    const openConfirmAlteracaoCortina = () => {
        setShowConfirmAlteracaoCortina(true);
    }

    const openRegCortina = () => {
        setShowRegCortina(true);
        setValue("nome", "");
        setValue("descricao", "");
        setValue("material", "");
        setValue("modelo", "");
    }

    const filteredCortinas = cortinas.filter((cortina) => {
        if (filterOpções == "material") {
            return cortina.material.toLowerCase().includes(searchValue.toLowerCase());
        } else if (filterOpções == "modelo") {
            return cortina.modelo.toLowerCase().includes(searchValue.toLowerCase())
        } else if (filterOpções == "nome") {
            return cortina.nome.toLowerCase().includes(searchValue.toLowerCase())
        }
        return true;
    });

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={`Buscar ${filterOpções}`}
                        className={styles.searchInput}
                    />
                    <select
                        value={filterOpções}
                        onChange={(e) => setFilterOpções(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Opções</option>
                        <option value="nome">Nome</option>
                        <option value="material">Material</option>
                        <option value="modelo">Modelo</option>
                    </select>
                </div>
                <div className={styles.regUser}>
                    <button className={styles.action_btn} onClick={openRegCortina}>Registrar Cortina</button>
                </div>

                <div className={styles.productGrid}>
                    {filteredCortinas.map((cortina) => (
                        <div key={cortina.idCortina} className={styles.productContainer}>
                            <img
                                src={`http://localhost:3001/img/${cortina.imagem}`}
                                alt={cortina.nome}
                                className={styles.productImage}
                            />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productTitle}>{cortina.nome}</h3>
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => openInfoCortina(cortina)}
                                        className={styles.action_btn_prod}
                                    >
                                        Informações
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cortina.idCortina)}
                                        className={`${styles.action_btn_prod} ${styles.btnDelete}`}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >

            <div className={styles.overlay}
                style={{ display: showInfoCortina || selectedCortina || showDeleteCortina || showRegCortina || showConfirmAlteracaoCortina ? 'block' : 'none' }}
            />

            <div className={`${styles.popup_container} ${showRegCortina || showInfoCortina ? styles.popup_container_large : ""}`}
                style={{ display: showInfoCortina || selectedCortina || showDeleteCortina || showRegCortina || showConfirmAlteracaoCortina ? 'block' : 'none' }}
            >

                {showInfoCortina && selectedCortina && (
                    <div className={styles.container_infoCortina}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Informações - {selectedCortina.nome}</div>
                        </div>

                        <form className={styles.content}>
                            <div className={styles.columns_container}>
                                <div className={styles.column}>
                                    <label className={`${styles.label} ${styles.label_popup}`}>Nome</label>
                                    <input
                                        type="text"
                                        {...register('nome', { required: true, maxLength: 50, minLength: 3 })}
                                        className={`${styles.input_info} ${errors?.nome && styles.inputError}`}
                                        readOnly={!isEditable}
                                    />
                                    {errors?.nome?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                                    <input
                                        type="text"
                                        {...register('descricao', { required: false, maxLength: 200 })}
                                        className={`${styles.input_info} ${errors?.descricao && styles.inputError}`}
                                        readOnly={!isEditable}
                                    />
                                    {errors?.descricao?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 200 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Material</label>
                                    <input
                                        type="text"
                                        {...register("material", { required: true, maxLength: 50, minLength: 1 })}
                                        className={`${styles.input_info} ${errors?.material && styles.inputError}`}
                                        readOnly={!isEditable}
                                    />

                                    {errors?.material?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.material?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.material?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Modelo</label>
                                    <input
                                        type="text"
                                        {...register("modelo", { required: true, maxLength: 50, minLength: 3 })}
                                        className={`${styles.input_info} ${errors?.modelo && styles.inputError}`}
                                        readOnly={!isEditable}
                                    />
                                    {errors?.modelo?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.modelo?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.modelo?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}
                                </div>
                                <div className={styles.column}>
                                    <label className={styles.label}>Imagem</label>
                                    <label className={styles.profileImageLabel}>
                                        <div className={styles.profileImageWrapper}>
                                            {selectedImagePreview ? (
                                                // Exibe a pré-visualização se o usuário selecionou uma nova imagem
                                                <img
                                                    src={selectedImagePreview}
                                                    alt="Preview"
                                                    className={styles.previewImage}
                                                />
                                            ) : selectedCortina?.imagem ? (
                                                // Exibe a imagem cadastrada, caso não haja pré-visualização e selectedCortina esteja definido
                                                <img
                                                    src={`http://localhost:3001/img/${selectedCortina.imagem}`}
                                                    alt="Imagem cadastrada"
                                                    className={styles.previewImage}
                                                />

                                            ) : (
                                                // Exibe o ícone como fallback, se não houver imagem selecionada ou cadastrada
                                                <div className={styles.icon} />
                                            )}

                                            <div className={styles.imageOverlay}>
                                                Clique para escolher uma imagem
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            {...register('image', { required: true })}
                                            className={`${styles.input_info} ${styles.input_image}`}
                                            onChange={handleImageChange}
                                            readOnly={!isEditable}
                                        />
                                    </label>
                                </div>
                            </div>
                        </form>

                        {isEditable
                            ?
                            <div className={styles.center_btn}>
                                <button type="button" onClick={() => { handleSubmit(handleSave)() }} className={`${styles.action_btn} ${styles.register_btn}`}>Salvar</button>
                                <button className={`${styles.action_btn} ${styles.close}`} onClick={stopEditCortina}>Cancelar</button>
                            </div>
                            :
                            <div className={styles.center_btn}>
                                <button className={styles.action_btn} onClick={editCortina}>Editar</button>
                                <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                            </div>
                        }
                    </div>
                )}

                {showConfirmAlteracaoCortina && (
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

                {showRegCortina && (
                    <div className={styles.container_infoCortina}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Registrar Cortina</div>
                        </div>

                        <div className={styles.content}>
                            <div className={styles.columns_container}>
                                <div className={styles.column}>

                                    <label className={`${styles.label} ${styles.label_popup}`}>Nome</label>
                                    <input
                                        type="text"
                                        {...register('nome', { required: true, maxLength: 50, minLength: 3 })}
                                        className={`${styles.input_info} ${errors?.nome && styles.inputError}`}
                                    />
                                    {errors?.nome?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                                    <input
                                        type="text"
                                        {...register('descricao', { required: false, maxLength: 200 })}
                                        className={`${styles.input_info} ${errors?.descricao && styles.inputError}`}
                                    />
                                    {errors?.descricao?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 200 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Material</label>
                                    <input
                                        type="text"
                                        {...register("material", { required: true, maxLength: 50, minLength: 1 })}
                                        className={`${styles.input_info} ${errors?.material && styles.inputError}`}
                                    />

                                    {errors?.material?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.material?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.material?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}

                                    <label className={`${styles.label} ${styles.label_popup}`}>Modelo</label>
                                    <input
                                        type="text"
                                        {...register("modelo", { required: true, maxLength: 50, minLength: 3 })}
                                        className={`${styles.input_info} ${errors?.modelo && styles.inputError}`}
                                    />
                                    {errors?.modelo?.type == 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    {errors?.modelo?.type === 'minLength' && <p className={styles.input_menssage}>Mínimo de 3 caracteres</p>}
                                    {errors?.modelo?.type === 'maxLength' && <p className={styles.input_menssage}>Máximo de 50 caracteres</p>}

                                </div>
                                <div className={styles.column}>
                                    <label className={styles.label}>Imagem</label>
                                    <label className={styles.profileImageLabel}>
                                        <div className={styles.profileImageWrapper}>
                                            {selectedImagePreview ? (
                                                // Exibe a pré-visualização se o usuário selecionou uma nova imagem
                                                <img
                                                    src={selectedImagePreview}
                                                    alt="Preview"
                                                    className={styles.previewImage}
                                                />
                                            ) : selectedCortina?.imagem ? (
                                                // Exibe a imagem cadastrada, caso não haja pré-visualização e selectedCortina esteja definido
                                                <img
                                                    src={`http://localhost:3001/img/${selectedCortina.imagem}`}
                                                    alt="Imagem cadastrada"
                                                    className={styles.previewImage}
                                                />
                                            ) : (
                                                // Exibe o ícone como fallback, se não houver imagem selecionada ou cadastrada
                                                <div className={styles.icon} />
                                            )}

                                            <div className={styles.imageOverlay}>
                                                Clique para escolher uma imagem
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            {...register('image', { required: true })}
                                            className={`${styles.input_info} ${styles.input_image}`}
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors?.image?.type === 'required' && <p className={styles.input_menssage}>Esse campo é obrigatório</p>}
                                    </label>

                                </div>
                            </div>
                            <div className={styles.center_btn}>
                                <button className={styles.action_btn} onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                                <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
                            </div>
                        </div>

                    </div>
                )}
            </div >

            <Footer />
        </>
    );
};
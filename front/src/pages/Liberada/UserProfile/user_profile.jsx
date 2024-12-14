import React, { useState, useEffect } from "react";
import { FaXmark, FaCheck, FaRegCircleUser } from 'react-icons/fa6';
import styles from "./user_profile.module.css";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/Footer/footer";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Axios from "axios";
import { useAuth } from "../../../context/AuthProvider/useAuth";

export default function UserProfile() {
    const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm();
    const [isEditable, setIsEditable] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [showInfoSaved, setShowInfoSaved] = useState(false);
    const [showConfirmAccountDelete, setShowConfirmAccountDelete] = useState(false);
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState("");
    const [usuarioData, setUsuarioData] = useState(null);
    const [selected, setSelected] = useState();
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClose = () => {
        setShowPasswordPopup(false);
        setShowInfoSaved(false);
        setShowConfirmAccountDelete(false);
        clearErrors("telefone", "");
        clearErrors("cep", "");
        clearErrors("rua", "");
        clearErrors("bairro", "");
        clearErrors("cpf", "");
        clearErrors("numero", "");
        clearErrors("cidade", "");
        clearErrors("estado", "");
        clearErrors("email", "");
        clearErrors("nome", "");
        clearErrors("senha", "");
        setValue("senha", "");
        setValue("emailDelete", "");
        setValue("senhaAlterar", "");
        setValue("senhaDelete", "");
        setError("")
        setConfirm("")
    }

    // Exibir tela para inserção de senha para liberar edição
    const passwordPopup = () => {
        setShowPasswordPopup(true);
    }

    const DeletarConta = async (senha) => {
        console.log(senha)
        const response = auth.dados === "Clien"
            ? await Axios.post(`http://localhost:3001/deleteconta`, { senha: senha.senhaDelete, email: senha.emailDelete, id: auth.id, nivel: auth.dados, idUsuario: auth.idUsuario })
            : await Axios.post(`http://localhost:3001/deleteconta`, { senha: senha.senhaDelete, email: senha.emailDelete, id: auth.idFunc, nivel: auth.dados, idUsuario: auth.idUsuario });
        if (response.data == "Deletado") {
            Sair();
        } else {
            setConfirm(response.data);
        }
    }

    // Confirmar senha inserida pelo usuário
    const confirmPassword = async (senha) => {
        console.log(senha)
        const response = auth.dados === "Clien"
            ? await Axios.post(`http://localhost:3001/confirmarsenha`, { senha: senha.senhaAlterar, id: auth.id, nivel: auth.dados })
            : await Axios.post(`http://localhost:3001/confirmarsenha`, { senha: senha.senhaAlterar, id: auth.idFunc, nivel: auth.dados });
        if (response.data == "Liberado") {
            setShowPasswordPopup(false);
            setValue("senha", senha.senhaAlterar)
            setIsEditable(true);
        } else {
            setConfirm(response.data);
        }
    }

    const confirmAccountDeletePopup = () => {
        setShowConfirmAccountDelete(true);
    }

    const handleSaveClick = async (data) => {
        const formData = new FormData();

        // Verifica se a imagem está definida e é válida
        if (selectedImageFile) {
            console.log("Arquivo de imagem encontrado:", selectedImageFile);
            formData.append("image", selectedImageFile);
        } else {
            console.error("Nenhum arquivo de imagem foi selecionado!");
        }

        // Adiciona os demais campos ao FormData
        formData.append("telefone", data.telefone);
        formData.append("nome", data.nome);
        formData.append("email", data.email);
        formData.append("cpf", data.cpf);
        formData.append("senha", data.senha);
        formData.append("idUsuario", data.idUsuario);

        // Adiciona campos específicos para 'Clien'
        if (auth.dados === "Clien") {
            formData.append("estado", data.estado);
            formData.append("cidade", data.cidade);
            formData.append("rua", data.rua);
            formData.append("numero", data.numero);
            formData.append("bairro", data.bairro);
            formData.append("cep", data.cep);
        } else {
            formData.append("descricao", data.descricao);
        }
        try {
            console.log("FormData enviado:", formData);

            // Envio dos dados ao backend
            const response = auth.dados === "Clien"
                ? await Axios.put(`http://localhost:3001/editar/${auth.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                : await Axios.put(`http://localhost:3001/editarfuncionario/${auth.idFunc}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            // Tratamento de possíveis erros no backend
            if (response.data === "Email") {
                setError("Email já existe");
            } else if (response.data === "Telefone") {
                setError("Telefone já existe");
            } else if (response.data === "CPF") {
                setError("CPF já existe");
            } else {
                setShowInfoSaved(true);
                setError("");
                setIsEditable(false);
                fetchData(); // Recarrega os dados
            }
        } catch (error) {
            console.error("Erro ao atualizar os dados:", error);
            setError("Erro ao salvar os dados.");
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImagePreview(URL.createObjectURL(file));
            setSelectedImageFile(file); // Armazena o arquivo para envio posterior
        }
    };

    const handleCancelClick = () => {
        setError("");
        setIsEditable(false);
        fetchData(); // Reverte as alterações no formulário
    };

    const Sair = () => {
        auth.logout();
        navigate("/");
    };

    const fetchData = async () => {
        try {
            const response = await Axios.post("http://localhost:3001/userprofile",
                auth.dados == "Func" ?
                    {
                        id: auth.idFunc,
                        niveluser: auth.dados,
                    }
                    :
                    {
                        id: auth.id,
                        niveluser: auth.dados,
                    }
            );
            const cliente = response.data[0];
            setUsuarioData(cliente);
            setSelected(cliente.imagem);
            if (cliente) {
                Object.keys(cliente).forEach((key) => setValue(key, cliente[key]));
                setValue("senha", "")

            }
        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
            setError("Erro ao carregar os dados.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className={styles.overlay} style={{ display: showPasswordPopup || showInfoSaved || showConfirmAccountDelete ? 'block' : 'none' }} />

            <div className={styles.popup_container} style={{ display: showPasswordPopup || showInfoSaved || showConfirmAccountDelete ? 'block' : 'none' }}>
                {/* Popup para inserir SENHA para editar informações */}
                {showPasswordPopup && (
                    <div className={styles.container_password}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Confirmação</div>
                        </div>
                        <center><p className={styles.error_message}>{confirm}</p></center>
                        <form onSubmit={handleSubmit(confirmPassword)}>
                            <p className={styles.info}>
                                Digite a senha da sua conta para poder editar suas informações.
                            </p>

                            <label className={`${styles.label} ${styles.label_popup}`}>Digite sua senha</label>
                            <input
                                {...register("senhaAlterar", { required: true, minLength: 8, maxLength: 50 })}
                                type="password"
                                placeholder="Senha"
                                className={`${styles.input_info} ${errors?.senhaAlterar && styles.input_error}`}
                            />
                            {errors?.senhaAlterar?.type == 'required' && <p className={styles.error_message}>Esse campo é obrigatório</p>}
                            {errors?.senhaAlterar?.type == 'minLength' && <p className={styles.error_message}>Deve conter no mínimo 8 caracteres</p>}
                            {errors?.senhaAlterar?.type == 'maxLength' && <p className={styles.error_message}>Senha muito grande</p>}
                            <button type="submit" className={styles.action_btn}>Confirmar</button>
                        </form>

                        <button className={`${styles.action_btn} ${styles.close} ${styles.espacamentoTop}`} onClick={handleClose}>Cancelar</button>
                    </div>
                )}

                {/* Popup de informações salvar */}
                {showInfoSaved && (
                    <div className={styles.container_infoSaved}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <FaCheck className={styles.icon_infoSaved} />
                        <p className={styles.info}>
                            As suas informações foram salvas com sucesso!
                        </p>

                        <button className={`${styles.action_btn} ${styles.close} ${styles.espacamentoTop}`} onClick={handleClose}>Fechar</button>
                    </div>
                )}

                {/* Popup de EXCLUSÃO DE CONTA */}
                {showConfirmAccountDelete && (
                    <div className={styles.container_accountDelete}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Excluir Conta</div>
                        </div>
                        <center><p className={styles.error_message}>{confirm}</p></center>
                        <form onSubmit={handleSubmit(DeletarConta)}>
                            <p className={styles.info}>
                                Digite o email e a senha da sua conta para poder exclui-la.
                            </p>

                            <label className={`${styles.label} ${styles.label_popup}`}>Digite seu email</label>
                            <input
                                type='email'
                                placeholder="Email"
                                {...register('emailDelete', {
                                    required: true,
                                    maxLength: 255
                                })}
                                className={`${styles.input_info} ${errors?.emailDelete && styles.input_error}`}
                            />
                            {errors?.emailDelete?.type == 'required' && <p className={styles.error_message}>Esse campo é obrigatório</p>}
                            {errors?.emailDelete?.type == 'maxLength' && <p className={styles.error_message}>Email muito grande</p>}

                            <label className={`${styles.label} ${styles.label_popup}`}>Digite sua senha</label>
                            <input
                                {...register("senhaDelete", { required: true, minLength: 8, maxLength: 300 })}
                                type="password"
                                placeholder="Senha"
                                className={`${styles.input_info} ${errors?.senhaDelete && styles.input_error}`}
                            />
                            {errors?.senhaDelete?.type == 'required' && <p className={styles.error_message}>Esse campo é obrigatório</p>}
                            {errors?.senhaDelete?.type == 'minLength' && <p className={styles.error_message}>Deve conter no mínimo 8 caracteres</p>}
                            {errors?.senhaDelete?.type == 'maxLength' && <p className={styles.error_message}>Senha muito grande</p>}
                            <div className={styles.checkbox_confirmDelete}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox_accountDelete}
                                    {...register("checkbox", {
                                        required: true
                                    })}
                                />
                                <p className={styles.info}>Estou ciente que ao deletar a conta, todas as informações serão perdidas permanentemente.</p>
                                {errors?.checkbox?.type == 'required' && <p className={styles.error_message}>Tem que confirma para proceguir</p>}
                            </div>
                            <button type="submit" className={styles.action_btn}>Excluir</button>
                        </form>

                        <button className={`${styles.action_btn} ${styles.close} ${styles.espacamentoTop}`} onClick={handleClose}>Cancelar</button>
                    </div>
                )}
            </div>

            <div className={styles.container}>
                {/* Header de perfil do usuário */}
                <div className={styles.header}>
                    <div className={styles.profileSection}>
                        <label className={styles.profileImageLabel}>
                            {selected == null ?
                                <div className={styles.profileImageWrapper}>
                                    <FaRegCircleUser className={styles.icon} />
                                </div>
                                :
                                <img
                                    src={`http://localhost:3001/img/${selected}`}
                                    alt="Imagem cadastrada"
                                    className={`${styles.previewImage} ${styles.imageHeader}`}

                                />
                            }
                        </label>
                        <div className={styles.userInfo}>
                            <h2 className={styles.username}>{usuarioData?.nome || "Usuário"}</h2>
                        </div>
                    </div>

                    <div className={styles.actionBtn}>
                        <button className={styles.deleteButton} onClick={confirmAccountDeletePopup}>Excluir conta</button>
                        <button className={styles.logoutButton} onClick={Sair}>Sair da conta</button>
                    </div>
                </div>

                {/* Container de informações do usuário */}
                <form className={styles.infoSection}>
                    <h3 className={styles.infoSection_title}>Informações</h3>
                    <center><p className={styles.error_message}>{error}</p></center>
                    <div className={styles.formContainer}>
                        <div className={styles.displayColumn}>
                            <div className={styles.column}>
                                <label className={`${styles.label} ${styles.label_popup}`}>Nome</label>
                                <input type="hidden" {...register("idUsuario")} />
                                <input
                                    type="text"
                                    name="nome"
                                    {...register("nome", {
                                        required: true,
                                        minLength: 3,
                                        maxLength: 255,
                                    })}
                                    disabled={!isEditable}
                                    className={`${styles.input_info} ${errors?.nome && styles.input_error}`}
                                />
                                {errors?.nome?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                                {errors?.nome?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                                {errors?.nome?.type == 'maxLength' && <p className={styles.input_message}>Nome muito grande</p>}

                                <label className={`${styles.label} ${styles.label_popup}`}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    {...register("email", { required: true })}
                                    disabled={!isEditable}
                                    className={`${styles.input_info} ${errors?.email && styles.input_error}`}
                                />
                                {errors.email && <p className={styles.error_message}>Email é obrigatório</p>}

                                <label className={`${styles.label} ${styles.label_popup}`}>Telefone</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    {...register("telefone", {
                                        validate: value => {
                                            if (!isEditable) return true;
                                            if (!value) return "Telefone é obrigatório";
                                            const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
                                            return phoneRegex.test(value) || "Formatação inválida para telefone";
                                        },
                                    })}
                                    disabled={!isEditable}
                                    className={styles.input_info}
                                />
                                {errors.telefone && <p className={styles.error_message}>{errors.telefone.message}</p>}

                                <label className={`${styles.label} ${styles.label_popup}`}>CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    {...register("cpf", {
                                        validate: value => {
                                            if (!isEditable) return true;
                                            if (!value) return "CPF é obrigatório";
                                            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                                            return cpfRegex.test(value) || "Formatação inválida para CPF";
                                        },
                                    })}
                                    disabled={!isEditable}
                                    className={styles.input_info}
                                />
                                {errors.cpf && <p className={styles.error_message}>{errors.cpf.message}</p>}

                                <label className={`${styles.label} ${styles.label_popup}`}>Senha</label>
                                <input
                                    type="text"
                                    name="senha"
                                    placeholder="Senha Criptografada"
                                    {...register("senha", {
                                        validate: value => {
                                            if (!isEditable) return true;
                                            if (!value) return "Senha é obrigatório";
                                        },
                                    })}
                                    disabled={!isEditable}
                                    className={styles.input_info}
                                />
                                {errors.senha && <p className={styles.error_message}>{errors.senha.message}</p>}

                            </div>
                            <div className={styles.column}>
                                {auth.dados === "Clien" ? (
                                    <>
                                        <label className={`${styles.label} ${styles.label_popup}`}>Estado</label>
                                        <input
                                            type="text"
                                            name="estado"
                                            {...register("estado", {
                                                validate: value => isEditable ? !!value : true, // Valida apenas se o campo for editável
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.estado && <p className={styles.error_message}>Campo é obrigatório</p>}

                                        <label className={`${styles.label} ${styles.label_popup}`}>Cidade</label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            {...register("cidade", {
                                                validate: value => isEditable ? !!value : true,
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.cidade && <p className={styles.error_message}>Campo é obrigatório</p>}

                                        <label className={`${styles.label} ${styles.label_popup}`}>Rua</label>
                                        <input
                                            type="text"
                                            name="rua"
                                            {...register("rua", {
                                                validate: value => isEditable ? !!value : true,
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.rua && <p className={styles.error_message}>Campo é obrigatório</p>}

                                        <label className={`${styles.label} ${styles.label_popup}`}>Bairro</label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            {...register("bairro", {
                                                validate: value => isEditable ? !!value : true,
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.bairro && <p className={styles.error_message}>Campo é obrigatório</p>}

                                        <label className={`${styles.label} ${styles.label_popup}`}>CEP</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            {...register("cep", {
                                                validate: value => {
                                                    if (!isEditable) return true;
                                                    if (!value) return "CEP é obrigatório";
                                                    const cepRegex = /^\d{5}-?\d{3}$/;
                                                    return cepRegex.test(value) || "Formatação inválida para CEP";
                                                },
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.cep && <p className={styles.error_message}>{errors.cep.message}</p>}



                                        <label className={`${styles.label} ${styles.label_popup}`}>Número</label>
                                        <input
                                            type="text"
                                            name="numero"
                                            {...register("numero", {
                                                validate: value => isEditable ? !!value : true,
                                            })}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />
                                        {errors.numero && <p className={styles.error_message}>Campo é obrigatório</p>}
                                    </>
                                ) : (
                                    <>
                                        <label className={`${styles.label} ${styles.label_popup}`}>Descrição</label>
                                        <textarea
                                            type="text"
                                            name="descricao"
                                            {...register("descricao")}
                                            disabled={!isEditable}
                                            className={styles.input_info}
                                        />

                                        <label className={styles.label}>Imagem</label>
                                        <label className={styles.profileImageLabel}>
                                            <div className={styles.profileImageWrapper}>
                                                {selectedImagePreview ? (
                                                    <img
                                                        src={`${selectedImagePreview ? selectedImagePreview : `http://localhost:3001/img/${selected}`}`}
                                                        alt="Preview"
                                                        className={styles.previewImage}
                                                    />
                                                ) : selected != null ? (
                                                    <img
                                                        src={`http://localhost:3001/img/${selected}`}
                                                        alt="Imagem cadastrada"
                                                        className={styles.previewImage}
                                                    />
                                                ) : (
                                                    <FaRegCircleUser className={styles.icon} />
                                                )}
                                                {isEditable && (
                                                    <div className={styles.imageOverlay}>
                                                        Clique para escolher outra imagem
                                                    </div>
                                                )}
                                                <input
                                                    {...register("image")}
                                                    type="file"
                                                    id="profileImage"
                                                    disabled={!isEditable}
                                                    className={`${styles.input_info} ${styles.input_image}`}
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                        </label>
                                    </>
                                )}
                            </div>
                            {/* DISPLAY COLUMN */}
                        </div>
                        {/* FORM CONTAINER */}
                        {auth.dados == "Clien" && (
                            <>
                                <label className={styles.label}>Imagem</label>
                                <label className={styles.profileImageLabel}>
                                    <div className={styles.profileImageWrapper}>
                                        {selectedImagePreview ? (
                                            <img
                                                src={`${selectedImagePreview ? selectedImagePreview : `http://localhost:3001/img/${selected}`}`}
                                                alt="Preview"
                                                className={styles.previewImage}
                                            />
                                        ) : selected != null ? (
                                            <img
                                                src={`http://localhost:3001/img/${selected}`}
                                                alt="Imagem cadastrada"
                                                className={styles.previewImage}
                                            />
                                        ) : (
                                            <FaRegCircleUser className={styles.icon} />
                                        )}
                                        <div className={styles.imageOverlay}>
                                            Clique para escolher uma imagem
                                        </div>
                                        <input
                                            {...register("image")}
                                            type="file"
                                            id="profileImage"
                                            disabled={!isEditable}
                                            className={`${styles.input_info} ${styles.input_image}`}
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </label>
                            </>
                        )}
                    </div>

                    <div className={styles.buttonContainer}>
                        {isEditable ? (
                            <>
                                <button
                                    type="button"
                                    className={`${styles.action_btn} ${styles.saveButton}`}
                                    onClick={() => { handleSubmit(handleSaveClick)() }}
                                >
                                    Salvar
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.action_btn} ${styles.cancelButton}`}
                                    onClick={() => { handleCancelClick() }}
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className={`${styles.action_btn} ${styles.editButton}`}
                                onClick={passwordPopup}
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <Footer />
        </>
    );
}
import React, { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import Axios from 'axios';
import styles from "./chataovivo.module.css";
import NavbarFunc from '../../../components/navbar';
import { useReactMediaRecorder } from "react-media-recorder";
import { FaPaperclip, FaMicrophone, FaRegCircleUser, FaPen, FaTrash, FaXmark } from "react-icons/fa6";
import { useAuth } from '../../../context/AuthProvider/useAuth';

export default function ChatAovivo() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [conversas, setConversas] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [mode, setMode] = useState("text");
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const [showEditMensagem, setShowEditMensagem] = useState(false);
    const [showDeleteMensagem, setShowDeleteMensagem] = useState(false);
    const [showImagem, setShowImagem] = useState(null);
    const [showPreviewImagem, setShowPreviewImagem] = useState(null);
    const [selectedImageURL, setSelectedImageURL] = useState(null);
    const [Mens, setMens] = useState([]);
    const [selected, setSelected] = useState();
    const auth = useAuth();

    const fetchData = async () => {
        try {
            const response = await Axios.post("http://localhost:3001/userprofile",
                {
                    id: auth.idFunc,
                    niveluser: auth.dados,
                }
            );
            const cliente = response.data[0];
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


    const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
        audio: true,
        onStop: (blobUrl) => setMediaBlobUrl(blobUrl),
    });

    const fetchMessages = async (idChat) => {
        setLoading(true);
        try {
            const response = await Axios.get(`http://localhost:3001/mensagensfunc/${idChat}`);
            setMessages(response.data || []);
        } catch (err) {
            setError(`Erro ao buscar mensagens: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            console.log(data)
            const response = await Axios.post(`http://localhost:3001/editarmensagem`, { conteudo: data, id: Mens });
            if (response.data === "Atualizado") {
                setError("");
                fetchMessages(selectedChatId);
                handleClose();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const deleteMensagem = async () => {
        console.log()
        try {
            const response = await Axios.delete(`http://localhost:3001/deletemessagem/${Mens}`);

            if (response.status === 200 && response.data === "Deletado") {
                setError(""); // Limpa qualquer erro anterior
                fetchMessages(selectedChatId); // Atualiza as mensagens da conversa atual
                handleClose(); // Fecha qualquer popup relacionado
            } else {
                console.error("Resposta inesperada:", response.data);
                setError("Erro ao deletar a mensagem. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao deletar mensagem:", error);
            setError("Não foi possível excluir a mensagem. Verifique sua conexão ou tente novamente.");
        }
    };

    const sendMessage = async (data) => {
        if (!selectedChatId) {
            setError("Selecione uma conversa antes de enviar uma mensagem.");
            return;
        }

        const formData = new FormData();

        // Adiciona o campo correto com base no modo
        if (mode === "text") {
            formData.append("text", inputValue);
        } else if (mode === "image" && showPreviewImagem && selectedImageURL) {
            const response = await fetch(selectedImageURL);
            const blob = await response.blob();
            formData.append("image", blob, "image.jpg");
        } else if (mode === "audio" && mediaBlobUrl) {
            const response = await fetch(mediaBlobUrl);
            const blob = await response.blob();
            formData.append("audio", blob, "audio.mp3");
        }

        // Outros campos
        formData.append("visualizada", "NL");
        formData.append("idChat", selectedChatId);

        try {
            const response = await Axios.post("http://localhost:3001/enviarmensagemfunc", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                reset();
                fetchMessages(selectedChatId);
                setInputValue("");
                setMediaBlobUrl(null);
                setMode("text");
                setShowPreviewImagem(null);
                setSelectedImageURL(null);
            }
        } catch (err) {
            setError(`Erro ao enviar mensagem: ${err.message}`);
        }
    };

    const fetchConversas = async () => {
        try {
            const response = await Axios.get('http://localhost:3001/conversas');
            setConversas(response.data || []);
        } catch (error) {
            setError('Erro ao carregar as conversas.');
        }
    };

    useEffect(() => {
        fetchData();
        fetchConversas();
    }, []);

    const handleAudioButtonClick = () => {
        if (isRecording) {
            handleStopRecording();
            setMode("audio");
        } else {
            handleStartRecording();
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        startRecording();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        stopRecording();
    };

    const handleCancel = () => {
        if (mode === "audio") {
            setIsRecording(false);
            setMediaBlobUrl(null);
            clearBlobUrl?.();
        } else if (mode === "image") {
            setInputValue("");
            setSelectedImageURL(null);
        }
        setMode("text");
    };

    const filteredMessages = messages.filter((msg) => {
        if (searchField === 'conteudo') {
            return msg.conteudo?.includes(searchValue);
        } else if (searchField === 'Data') {
            return new Date(msg.dataHora).toLocaleDateString().includes(searchValue);
        }
        return true;
    });

    const handleChatClick = (idChat) => {
        setSelectedChatId(idChat);
        fetchMessages(idChat);
    };

    const openPreviewImage = (url) => {
        setShowPreviewImagem(true);
        setSelectedImageURL(url);
    };

    const renderInput = () => {
        switch (mode) {
            case "text":
                return (
                    <div className={styles.inputContainer}>
                        <div className={styles.sendImage}>
                            <FaPaperclip className={styles.icon} />
                            <input
                                type="file"
                                {...register("image")}
                                className={styles.hiddenFileInput}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setMode("image");
                                        openPreviewImage(URL.createObjectURL(e.target.files[0]));
                                    }
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Digite sua mensagem"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            {...register('mensagem', { required: true })}
                            className={`${styles.input_info} ${errors?.servico && styles.input_error}`}
                        />
                        <button type='button' onClick={() => { handleSubmit(sendMessage)() }} className={styles.sendButton}>Enviar</button>
                        <button className={`${styles.recordAudio} ${isRecording ? styles.recording : ""}`}>
                            <FaMicrophone className={styles.icon} onClick={handleAudioButtonClick} />
                        </button>
                    </div>
                );
            case "audio":
                return (
                    <div className={styles.inputContainer}>
                        {mediaBlobUrl && (
                            <>
                                <audio controls src={mediaBlobUrl} className={styles.audioControl}></audio>
                                <button className={styles.sendButton} onClick={() => handleSubmit(sendMessage)()}>Enviar</button>
                                <button className={`${styles.sendButton} ${styles.close} ${styles.recordAgainButton}`} onClick={handleCancel}>Cancelar</button>
                            </>
                        )}
                    </div>
                );
            case "image":
                return (
                    <>
                        {showPreviewImagem && (
                            <div className={styles.container_previewImage}>
                                <div className={styles.imageSelected}>
                                    <img src={selectedImageURL} className={styles.imageSelected_preview} alt="Imagem selecionada" />
                                </div>
                                <div className={styles.action_previewImage}>
                                    <button className={`${styles.sendButton} ${styles.close} ${styles.recordAgainButton}`} onClick={handleCancel}>Cancelar</button>
                                    <button onClick={() => { handleSubmit(sendMessage)() }} className={styles.sendButton}>Enviar</button>
                                </div>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };


    const handleClose = () => {
        setShowDeleteMensagem(false);
        setShowEditMensagem(false);
        setShowImagem(null);
    }

    const openPopupEditMessage = (data) => {
        setMens(data.id)
        setValue("mensagem", data.conteudo);
        setShowEditMensagem(true);
    }

    const openPopupDeleteMessage = (data) => {
        setMens(data.id)
        setShowDeleteMensagem(true);
    }

    const openImage = (imageUrl) => {
        setShowImagem(imageUrl); // Armazena apenas a URL da imagem
    };

    return (
        <>
            <NavbarFunc />
            <div className={styles.chatContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.searchbar}>
                        <select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            className={styles.selectFilter}
                        >
                            <option value="">Selecione o campo de busca</option>
                            <option value="conteudo">Conteúdo</option>
                            <option value="Data">Data</option>
                        </select>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={`Buscar ${searchField}`}
                            className={styles.inputFilter}
                        />
                    </div>
                    <div className={styles.conversationList}>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        {conversas.length > 0 ? (
                            conversas.map((conversa) => (
                                <div key={conversa.idChat} onClick={() => handleChatClick(conversa.idChat)} className={styles.conversationItem}>
                                    <label className={styles.profileImageLabel}>
                                        <div className={styles.profileImageWrapper}>
                                            <FaRegCircleUser className={styles.icon} />
                                        </div>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            style={{ display: "none" }}
                                            className={styles.input_info}
                                            accept="image/*"
                                        />
                                    </label>
                                    <span>{conversa.nome}</span>
                                </div>
                            ))
                        ) : (
                            !error && <p>Nenhuma conversa disponível.</p>
                        )}
                    </div>
                </div>
                <div className={styles.chatUser}>
                    <div className={styles.chatSection}>

                        {loading ? (
                            <p>Carregando mensagens...</p>
                        ) : (
                            filteredMessages
                                .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)) // Ordenação por data e hora
                                .map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.message} ${msg.remetente === "F" ? styles.messageRight : styles.messageLeft}`}
                                    >

                                        <label className={styles.profileImageLabel}>
                                            {
                                                msg.remetente == "C" ?
                                                    <div className={styles.profileImageWrapper}>
                                                        <FaRegCircleUser className={styles.icon} />
                                                    </div>
                                                    :
                                                    <div className={styles.profileImageWrapper}>
                                                        {
                                                            selected != null ?
                                                                <img
                                                                    src={`http://localhost:3001/img/${selected}`}
                                                                    alt="Imagem cadastrada"
                                                                    className={styles.messageImage}
                                                                />
                                                                :
                                                                <div className={styles.profileImageWrapper}>
                                                                    <FaRegCircleUser className={styles.icon} />
                                                                </div>
                                                        }
                                                    </div>
                                            }
                                        </label>


                                        {/* Conteúdo da mensagem */}
                                        <div className={styles.messageContent}>
                                            <h4 className={styles.userName}>
                                                {msg.remetente === "F" ? "Dream Curtains" : msg.nome || "Usuário Anônimo"}
                                            </h4>

                                            {/* Container para Texto */}
                                            {msg.conteudo && (
                                                <div className={styles.textContainer}>
                                                    <p className={styles.conteudo}>{msg.conteudo}</p>
                                                </div>
                                            )}

                                            {/* Container para Imagem */}
                                            {msg.imagem && (
                                                <div className={styles.imageContainer}>
                                                    <img
                                                        src={`http://localhost:3001/img/${msg.imagem}`}
                                                        alt="Imagem da mensagem"
                                                        className={styles.messageImage}
                                                        onClick={() => openImage(`http://localhost:3001/img/${msg.imagem}`)}
                                                    />
                                                </div>
                                            )}

                                            {/* Container para Áudio */}
                                            {msg.audio && (
                                                <div className={styles.audioContainer}>
                                                    <audio
                                                        controls
                                                        src={`http://localhost:3001/audio/${msg.audio}`}
                                                        className={styles.audioControl}
                                                    ></audio>
                                                </div>
                                            )}

                                            {msg.remetente === "F" ? (
                                                <>
                                                    {/* Ações e timestamp */}
                                                    <div className={styles.actions_time}>
                                                        {msg.conteudo ? (
                                                            <div className={styles.actions_message}>
                                                                <FaTrash
                                                                    className={`${styles.icon} ${styles.icon_message} ${styles.icon_delete}`}
                                                                    onClick={() => { openPopupDeleteMessage(msg) }}
                                                                />
                                                                <FaPen
                                                                    className={`${styles.icon} ${styles.icon_message}`}
                                                                    onClick={() => { openPopupEditMessage(msg) }}
                                                                />
                                                            </div>

                                                        ) : (
                                                            <div className={styles.actions_message}>
                                                                <FaTrash
                                                                    className={`${styles.icon} ${styles.icon_message} ${styles.icon_delete}`}
                                                                    onClick={() => { openPopupDeleteMessage(msg) }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className={styles.messageTimestamp}>
                                                            {new Date(msg.dataHora).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Ações e timestamp */}
                                                    <div className={styles.actions_time}>
                                                        <div className={styles.actions_message}>
                                                        </div>
                                                        <div className={styles.messageTimestamp}>
                                                            {new Date(msg.dataHora).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                        )}

                    </div>
                    <div className={styles.inputSection}>
                        {renderInput()}
                    </div>
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            <div className={styles.overlay}
                style={{ display: showDeleteMensagem || showEditMensagem ? 'block' : 'none' }}
            />

            <div className={styles.popup_container}
                style={{ display: showDeleteMensagem || showEditMensagem ? 'block' : 'none' }}
            >
                {showEditMensagem && (
                    <div className={styles.container_deleteAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Editar Mensagem</div>
                        </div>

                        <div className={styles.content}>
                            <label className={`${styles.label} ${styles.label_popup}`}>Mensagem</label>
                            <input
                                type="text"
                                placeholder='Mensagem'
                                {...register('mensagem', { required: true })}
                                className={`${styles.input_info} ${errors?.servico && styles.input_error}`}
                            />
                        </div>

                        <div className={styles.center_btn}>
                            <button type='button' className={styles.action_btn} onClick={() => { handleSubmit(handleSave)() }} >Salvar</button>
                            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Cancelar</button>
                        </div>
                    </div>
                )}

                {showDeleteMensagem && (
                    <div className={styles.container_deleteAgendamento}>
                        <FaXmark className={styles.close_icon} onClick={handleClose} />
                        <div className={styles.title}>
                            <div className={styles.title_text}>Excluir</div>
                        </div>

                        <div className={styles.container}>
                            <p className={styles.info}>
                                Ao deletar a mensagem, ela será perdida permanentemente.
                            </p>
                        </div>

                        <div className={styles.center_btn}>
                            <button className={styles.action_btn} onClick={() => { deleteMensagem() }}>
                                Excluir
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showImagem && (
                <div className={styles.modal} onClick={handleClose}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar na imagem
                    >
                        <FaXmark className={styles.closeIcon} onClick={handleClose} />
                        <img src={showImagem} alt="Imagem ampliada" className={styles.modalImage} />
                        <button className={`${styles.sendButton}  ${styles.close} ${styles.recordAgainButton}`} onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

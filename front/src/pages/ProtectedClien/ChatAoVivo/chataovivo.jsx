import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import styles from "./chataovivo.module.css";
import NavbarFunc from '../../../components/navbar';

export default function App() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [conversas, setConversas] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null); // ID do chat selecionado

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

    const sendMessage = async (data) => {
        if (!selectedChatId) {
            setError("Selecione uma conversa antes de enviar uma mensagem.");
            return;
        }
        try {
            const response = await Axios.post('http://localhost:3001/enviarmensagemfunc', {
                conteudo: data.message,
                imagem: null,
                audio: null,
                visualizada: 'NL',
                idChat: selectedChatId
            });
            if (response.status === 200) {
                reset();
                fetchMessages(selectedChatId); // Atualiza mensagens do chat selecionado
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
        fetchConversas();
    }, []);

    const filteredMessages = messages.filter((msg) => {
        if (searchField === 'conteudo') {
            return msg.conteudo?.includes(searchValue);
        } else if (searchField === 'Data') {
            return new Date(msg.dataHora).toLocaleDateString().includes(searchValue);
        }
        return true;
    });

    const handleChatClick = (idChat) => {
        setSelectedChatId(idChat); // Define o chat selecionado
        fetchMessages(idChat); // Busca as mensagens do chat
    };

    return (
        <>
            <NavbarFunc />
            <div className={styles.chatfunc}>
                <div className={styles.searchbar}>
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className={styles.select_filter}
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
                        className={`${styles.input_info} ${styles.input_filter}`}
                    />
                </div>

                <div className={styles.control}>
                    <div className={styles.conversas}>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        {conversas.length > 0 ? (
                            <table className={styles.table}>
                                <tbody>
                                    {conversas.map((conversa) => (
                                        <tr key={conversa.idChat} onClick={() => handleChatClick(conversa.idChat)}>
                                            <td>{conversa.nome}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            !error && <p>Nenhuma conversa disponível.</p>
                        )}
                    </div>

                    <div className={styles.chatmessage}>
                        {loading ? (
                            <p>Carregando mensagens...</p>
                        ) : (
                            filteredMessages
                                .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
                                .map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.messagecontent} ${msg.remetente === "F"
                                            ? styles.messageLeft
                                            : styles.messageRight}`}
                                    >
                                        <div className={styles.useravatar}></div>
                                        <h4>{msg.remetente === "F" ? "Dream Curtains" : msg.nome || 'Usuário Anônimo'}</h4>
                                        <p>{msg.conteudo}</p>
                                        {msg.imagem && <img src={msg.imagem} alt="imagem" className={styles.messageImage} />}
                                        {msg.audio && (
                                            <audio controls>
                                                <source src={msg.audio} type="audio/mpeg" />
                                                Seu navegador não suporta o elemento de áudio.
                                            </audio>
                                        )}
                                        <div className={styles.messageTimestamp}>
                                            {new Date(msg.dataHora).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
                <form onSubmit={handleSubmit(sendMessage)} className={styles.messageinputchatfunc}>
                    <input
                        type="text"
                        placeholder="Digite sua mensagem"
                        {...register("message", { required: true })}
                    />
                    <button type="submit">Enviar</button>
                    {errors.message && <p className={styles.error}>A mensagem é obrigatória</p>}
                </form>

                {error && <p className={styles.error}>{error}</p>}
            </div>
        </>
    );
}

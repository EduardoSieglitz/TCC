import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import styles from "./chataovivo.module.css";
import Navbar from "../Navbar/navbar";
import { useAuth } from '../../../context/AuthProvider/useAuth';

export default function App() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");

    async function fetchMessages() {
        setLoading(true);
        try {
            const response = await Axios.get(`http://localhost:3001/mensagens`);
            if (Array.isArray(response.data)) {
                setMessages(response.data);
            } else {
                setMessages([]);
            }
        } catch (err) {
            setError(`Erro ao buscar mensagens: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage(data) {
        try {
            const response = await Axios.post(`http://localhost:3001/enviarmensagem`, {
                conteudo: data.message,
                imagem: null,
                audio: null,
                visualizada: 'NL',
                id: auth.id
            });
            if (response.status === 200) {
                reset();
                fetchMessages();
            }
        } catch (err) {
            setError(`Erro ao enviar mensagem: ${err.message}`);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter((msg) => {
        if (searchField === 'Conteúdo') {
            return msg.conteudo?.includes(searchValue);
        } else if (searchField === 'Data') {
            return new Date(msg.dataHora).toLocaleDateString().includes(searchValue);
        }
        return true;
    });

    return (
        <>
            <Navbar />
            <div className={styles.app}>
                <div className={styles.content}>
                    <SearchBar
                        searchField={searchField}
                        setSearchField={setSearchField}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                    {loading ? (
                        <p>Carregando mensagens...</p>
                    ) : (
                        <ChatMessageList messages={filteredMessages} />
                    )}
                    <MessageInput
                        sendMessage={handleSubmit(sendMessage)}
                        register={register}
                        errors={errors}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            </div>
        </>
    );
}

function SearchBar({ searchField, setSearchField, searchValue, setSearchValue }) {
    return (
        <div className={styles.searchbar}>
            <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className={styles.select_filter}
            >
                <option value="">Selecione o campo de busca</option>
                <option value="Conteúdo">Conteúdo</option>
                <option value="Data">Data</option>
            </select>
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Buscar ${searchField}`}
                className={styles.input_filter}
            />
        </div>
    );
}

function ChatMessageList({ messages }) {
    return (
        <div className={styles.chatmessage}>
            {(Array.isArray(messages) ? messages : []).map((msg, index) => (
                <div key={index} className={styles.message}>
                    <div className={styles.useravatar}></div>
                    <div className={styles.messagecontent}>
                        <h4>{msg.user || 'Usuário Anônimo'}</h4>
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
                </div>
            ))}
        </div>
    );
}

function MessageInput({ sendMessage, register, errors }) {
    return (
        <form onSubmit={sendMessage} className={styles.messageinput}>
            <input
                type="text"
                placeholder="Digite sua mensagem"
                {...register("message", { required: true })}
            />
            <button type="submit">Enviar</button>
            {errors.message && <p className={styles.error}>A mensagem é obrigatória</p>}
        </form>
    );
}

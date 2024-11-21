import styles from './servico.module.css';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarCliente from '../../../components/navbar';

export default function CadastroAgendamento() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function dados(event) {
        try {
            const request = await Axios.post("http://localhost:3001/registrarservico", {
                descricao: event.descricao,
                servico: event.servico,
            });

            if (request.data === "Cadastrado") {
                setError("");
                //navigate("/tabela-agendamento");
                console.log(request.data);
            }
        } catch (error) {
            console.log(error);
            setError("");
        }
    }

    return (
        <>
            <NavbarCliente />
            <div className={styles.body}>
                <div className={styles.containerServico}>
                    {error && <p className={styles.error_message}>{error}</p>}
                    <div className={styles.title}>
                        <label htmlFor="title">Registrar Serviço</label>
                    </div>

                    <input
                        type="text"
                        placeholder="Nome Serviço"
                        {...register('servico', { required: true })}
                        className={errors?.servico && styles.input_error}
                    />
                    {errors?.servico?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <input
                        type="text"
                        placeholder="Descrição"
                        {...register('descricao', { maxLength: 200 })}
                        className={errors?.descricao && styles.input_error}
                    />
                    {errors?.descricao?.type === 'maxLength' && <p className={styles.input_message}>Máximo de 200 caracteres</p>}

                    <button onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                    <Link to="/homefunc" className={styles.return}>Voltar</Link>
                </div>
            </div>
        </>
    );
}

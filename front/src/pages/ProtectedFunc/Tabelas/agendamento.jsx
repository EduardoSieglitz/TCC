import styles from './agendamento.module.css';
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
            const request = await Axios.post("http://localhost:3001/registraragendamento", {
                solicitacao: event.solicitacao,
                dataAgendada: event.dataAgendada,
                descricao: event.descricao,
                status: event.status,
                servico: event.servico,
                valor: event.valor,
                cpfFunc: event.cpfFuncionario,
                cpfClien: event.cpfCliente,
            });

            if (request.data === "Cadastrado") {
                setError("");
                navigate("/tabela-agendamento");
                console.log(request.data);
            }
        } catch (error) {
            console.log(error);
            setError("Alguns dos CPFs está errado");
        }
    }

    return (
        <>
            <NavbarCliente />
            <div className={styles.body}>
                <div className={styles.containerAgendamento}>
                    {error && <p className={styles.error_message}>{error}</p>}
                    <div className={styles.title}>
                        <label htmlFor="title">Registrar Agendamento</label>
                    </div>

                    <input
                        type="date"
                        placeholder="Data de Solicitação"
                        {...register('solicitacao', { required: true })}
                        className={errors?.solicitacao && styles.input_error}
                    />
                    {errors?.solicitacao?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <input
                        type="datetime-local"
                        placeholder="Data e Hora Agendada"
                        {...register('dataAgendada', { required: true })}
                        className={errors?.dataAgendada && styles.input_error}
                    />
                    {errors?.dataAgendada?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <input
                        type="text"
                        placeholder="Descrição"
                        {...register('descricao', { maxLength: 200 })}
                        className={errors?.descricao && styles.input_error}
                    />
                    {errors?.descricao?.type === 'maxLength' && <p className={styles.input_message}>Máximo de 200 caracteres</p>}

                    <select
                        {...register('status', { required: true })}
                        className={errors?.status && styles.input_error}>
                        <option value="">Selecione o status</option>
                        <option value="E">Em andamento</option>
                        <option value="A">Agendado</option>
                        <option value="C">Concluído</option>
                    </select>
                    {errors?.status?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <select
                        {...register('servico', { required: true })}
                        className={errors?.servico && styles.input_error}>
                        <option value="">Selecione o Serviço</option>
                        <option value="P">Cortina Personalizada</option>
                        <option value="R">Reforma</option>
                        <option value="L">Limpeza</option>
                    </select>
                    {errors?.servico?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <input
                        type="text"
                        placeholder="Valor"
                        {...register('valor', { required: true })}
                        className={errors?.cpfFuncionario && styles.input_error}
                    />
                    {errors?.valor?.type === 'required' && <p className={styles.input_message}>required</p>}

                    <input
                        type="text"
                        placeholder="CPF do Funcionario"
                        {...register('cpfFuncionario', {
                            required: true,
                            validate: value => /^\d{11}$/.test(value),
                        })}
                        className={errors?.cpfFuncionario && styles.input_error}
                    />
                    {errors?.cpfFuncionario?.type === 'required' && <p className={styles.input_message}>required</p>}
                    {errors?.cpfFuncionario?.type === 'validate' && <p className={styles.input_message}>CPF inválido (deve ter 11 dígitos)</p>}

                    <input
                        type="text"
                        placeholder="CPF do Cliente"
                        {...register('cpfCliente', {
                            required: true,
                            validate: value => /^\d{11}$/.test(value),
                        })}
                        className={errors?.cpfCliente && styles.input_error}
                    />
                    {errors?.cpfCliente?.type === 'required' && <p className={styles.input_message}>required</p>}
                    {errors?.cpfCliente?.type === 'validate' && <p className={styles.input_message}>CPF inválido (deve ter 11 dígitos)</p>}

                    <button onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                    <Link to="/homefunc" className={styles.return}>Voltar</Link>
                </div>
            </div>
        </>
    );
}

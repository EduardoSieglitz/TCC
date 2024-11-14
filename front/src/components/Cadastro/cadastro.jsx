import styles from './cadastro.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import axios from 'axios';
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';

export default function Cadastro({ toggleLogin, closeScreens }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const senha = watch("senha");

    async function dados(data) {
        try {
            const request = await axios.post("http://localhost:3001/registrar", data);
            if (request.data === "Cadastrado") {
                setError("Cadastrado");
            } else if (request.data === "Email") {
                setError("Email já existe");
            } else if (request.data === "Telefone") {
                setError("Telefone já existe");
            } else if (request.data === "CPF") {
                setError("CPF já existe");
            } else {
                setError("");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <FaXmark className={styles.close_icon} onClick={closeScreens} />
                {error && <p className={styles.error_message}>{error}</p>}
                <div className={styles.title}>
                    <h2 className={styles.title_text}>Cadastro</h2>
                </div>
                <div className={styles.content}>
                    <input
                        type='text'
                        placeholder='Nome'
                        {...register('nome', { required: true, minLength: 6, maxLength: 50 })}
                        className={`${styles.input_info} ${errors.nome && styles.input_error}`}
                    />
                    {errors.nome && <p className={styles.input_message}>Nome é obrigatório</p>}

                    <input
                        type='text'
                        placeholder='Email'
                        {...register('email', {
                            required: true,
                            minLength: 6,
                            maxLength: 50,
                            validate: (value) => validator.isEmail(value) || "Email inválido"
                        })}
                        className={`${styles.input_info} ${errors.email && styles.input_error}`}
                    />
                    {errors.email && <p className={styles.input_message}>{errors.email.message || "Email inválido"}</p>}

                    <div className={styles.input_group}>
                        <input
                            type="password"
                            placeholder="Senha"
                            {...register('senha', { required: true, minLength: 8 })}
                            className={`${styles.input_info} ${errors.senha && styles.input_error}`}
                        />
                        {errors.senha && <p className={styles.input_message}>Senha é obrigatória, mínimo de 8 caracteres</p>}

                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            {...register('confirmarSenha', {
                                validate: (value) => value === senha || "As senhas não correspondem"
                            })}
                            className={`${styles.input_info} ${errors.confirmarSenha && styles.input_error}`}
                        />
                        {errors.confirmarSenha && <p className={styles.input_message}>{errors.confirmarSenha.message}</p>}
                    </div>

                    <input
                        type='text'
                        placeholder='CPF'
                        {...register('cpf', { required: true, minLength: 11, maxLength: 14 })}
                        className={`${styles.input_info} ${errors.cpf && styles.input_error}`}
                    />
                    {errors?.cpf?.type == 'required' && <p className={styles.input_message}>CPF é obrigatório</p>}
                    {errors?.cpf?.type == 'minLength' && <p className={styles.input_message}>CPF invalido</p>}
                    {errors?.cpf?.type == 'maxLength' && <p className={styles.input_message}>CPF invalido</p>}

                    <input
                        type="text"
                        placeholder="Telefone"
                        {...register('telefone', { required: true, minLength: 10, maxLength: 15 })}
                        className={`${styles.input_info} ${errors.telefone && styles.input_error}`}
                    />
                    {errors?.telefone?.type == 'required'&& <p className={styles.input_message}>Telefone é obrigatório</p>}
                    {errors?.telefone?.type == 'minLength' && <p className={styles.input_message}>Telefone Invalido</p>}
                    {errors?.telefone?.type == 'maxLength' && <p className={styles.input_message}>Telefone Invalido</p>}

                    <div className={styles.input_group}>
                        <input
                            type='text'
                            placeholder='Estado'
                            {...register('estado', { required: true })}
                            className={`${styles.input_info} ${errors.estado && styles.input_error}`}
                        />
                        <input
                            type="text"
                            placeholder='Cidade'
                            {...register('cidade', { required: true })}
                            className={`${styles.input_info} ${errors.cidade && styles.input_error}`}
                        />
                    </div>
                    {errors.estado && <p className={styles.input_message}>Estado é obrigatório</p>}
                    {errors.cidade && <p className={styles.input_message}>Cidade é obrigatória</p>}

                    <input
                        type="text"
                        placeholder="Rua"
                        {...register('rua', { required: true })}
                        className={`${styles.input_info} ${errors.rua && styles.input_error}`}
                    />
                    {errors.rua && <p className={styles.input_message}>Rua é obrigatória</p>}

                    <input
                        type="text"
                        placeholder="Bairro"
                        {...register('bairro', { required: true })}
                        className={`${styles.input_info} ${errors.bairro && styles.input_error}`}
                    />
                    {errors.bairro && <p className={styles.input_message}>Bairro é obrigatório</p>}

                    <input
                        type="text"
                        placeholder="CEP"
                        {...register('cep', { required: true, minLength: 8, maxLength: 9 })}
                        className={`${styles.input_info} ${errors.cep && styles.input_error}`}
                    />
                    {errors?.cep?.type == 'required' && <p className={styles.input_message}>CEP é obrigatório</p>}
                    {errors?.cep?.type == 'minLength' && <p className={styles.input_message}>CEP Invalido</p>}
                    {errors?.cep?.type == 'maxLength' && <p className={styles.input_message}>CEP Invalido</p>}

                    <input
                        type="text"
                        placeholder="Número"
                        {...register('numero', { required: true })}
                        className={`${styles.input_info} ${errors.numero && styles.input_error}`}
                    />
                    {errors.numero && <p className={styles.input_message}>Número é obrigatório</p>}

                    <button className={`${styles.action_btn} ${styles.register_btn}`} onClick={handleSubmit(dados)}>Cadastrar</button>

                    <div className={styles.line}></div>

                    <button onClick={toggleLogin} className={`${styles.action_btn} ${styles.login_btn}`}>Já tenho uma conta</button>
                </div>
            </div>
        </>
    );
}

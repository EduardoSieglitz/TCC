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
            const request = await axios.post("http://localhost:3001/registrarprimeira", data);
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
                        {...register('nome', { required: true})}
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

                    <button className={`${styles.action_btn} ${styles.register_btn}`} onClick={handleSubmit(dados)}>Cadastrar</button>

                    <div className={styles.line}></div>

                    <button onClick={toggleLogin} className={`${styles.action_btn} ${styles.login_btn}`}>Já tenho uma conta</button>
                </div>
            </div>
        </>
    );
}

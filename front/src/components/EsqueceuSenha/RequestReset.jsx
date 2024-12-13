import styles from './RequestReset.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { useState } from 'react';
import Axios from 'axios';
import { FaXmark } from 'react-icons/fa6';
import { useAuth } from '../../context/AuthProvider/useAuth';

export default function PasswordReset({ toggleLogin, closeScreens }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [step, setStep] = useState("email"); // "email" | "verifyCode" | "setPassword" | "passwordChanged"
    const [message, setMessage] = useState('');
    const auth = useAuth();
    const senha = watch("senha");

    // Envia o email para receber o código
    async function request(data) {
        try {
            setMessage("Enviando código para seu email...");
            await auth.requestReset(data.email);
            setMessage(auth.senha || "Código enviado com sucesso!");
            setStep("verifyCode");
        } catch (error) {
            setMessage('Erro ao enviar o código de recuperação. Tente novamente.');
        }
    }

    // Valida o código enviado por email
    async function confirmToken(data) {
        try {
            // Simula a validação do token no backend
            setStep("setPassword");
        } catch (error) {
            setMessage("Token inválido ou expirado.");
        }
    }

    // Reseta a senha com base no token
    async function resetPassword(data) {
        try {
            const response = await Axios.post('http://localhost:3001/resetpassword', {
                token: data.token,
                newPassword: data.senha,
            });
            setMessage(response.data || "Senha alterada com sucesso!");
            setStep("passwordChanged");
        } catch (error) {
            setMessage("Erro ao redefinir a senha. Tente novamente.");
        }
    }

    const handleClose = () => {
        setStep("email");
        setMessage('');
    };

    return (
        <>
            {/* Background escurecido */}
            <div className={styles.overlay} />

            {/* Etapa 1: Inserção do email */}
            {step === "email" && (
                <div className={styles.container}>
                    <FaXmark className={styles.close_icon} onClick={closeScreens} />
                    <div className={styles.title}>
                        <h2 className={styles.title_text}>Recuperar Senha</h2>
                    </div>
                    <div className={styles.content}>
                        <p className={styles.info}>
                            Insira o seu e-mail para enviarmos um código de recuperação.
                        </p>
                        <form onSubmit={handleSubmit(request)}>
                            <input
                                type="text"
                                placeholder="Email"
                                {...register('email', {
                                    required: true,
                                    maxLength: 255,
                                    validate: (value) => validator.isEmail(value),
                                })}
                                className={`${styles.input_info} ${errors?.email && styles.input_error}`}
                            />
                            {errors?.email?.type === 'required' && <p className={styles.input_message}>Esse campo é obrigatório.</p>}
                            {errors?.email?.type === 'maxLength' && <p className={styles.input_message}>Email muito grande.</p>}
                            {errors?.email?.type === 'validate' && <p className={styles.input_message}>Email inválido.</p>}

                            <button type="submit" className={styles.action_btn}>Enviar</button>
                        </form>
                        {message && <p className={styles.input_message}>{message}</p>}

                        <div className={styles.line} />
                        <button className={`${styles.action_btn} ${styles.close}`} onClick={toggleLogin}>Fazer login</button>
                    </div>
                </div>
            )}

            {/* Etapa 2: Inserção do código */}
            {step === "verifyCode" && (
                <div className={styles.token_container}>
                    <FaXmark className={styles.close_icon} onClick={handleClose} />
                    <div className={styles.title}>
                        <div className={styles.title_text}>Verificar Código</div>
                    </div>
                    <form onSubmit={handleSubmit(confirmToken)}>
                        <p className={styles.info}>
                            Um código foi enviado para o seu e-mail. Insira-o abaixo.
                        </p>
                        <input
                            placeholder='Código'
                            type="text"
                            {...register('token', {
                                required: true,
                                minLength: 9,
                                maxLength: 300,
                            })}
                            className={`${styles.input_info} ${errors.token && styles.input_error}`}
                        />
                        {errors?.token?.type === 'required' && <p className={styles.input_message}>Código é obrigatório.</p>}
                        {errors?.token?.type === 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 9 caracteres.</p>}
                        {errors?.token?.type === 'maxLength' && <p className={styles.input_message}>Deve conter no máximo 9 caracteres.</p>}
                        <button type="submit" className={styles.action_btn}>Confirmar</button>
                    </form>
                    {message && <p className={styles.input_message}>{message}</p>}
                </div>
            )}

            {/* Etapa 3: Definir nova senha */}
            {step === "setPassword" && (
                <div className={styles.newPassword_container}>
                    <FaXmark className={styles.close_icon} onClick={handleClose} />
                    <div className={styles.title}>
                        <div className={styles.title_text}>Nova Senha</div>
                    </div>
                    <form onSubmit={handleSubmit(resetPassword)}>
                        <p className={styles.info}>
                            Digite uma nova senha para sua conta.
                        </p>
                        <input
                            type="password"
                            placeholder="Senha"
                            {...register('senha', {
                                required: true,
                                minLength: 8,
                                maxLength: 50,
                            })}
                            className={`${styles.input_info} ${errors.senha && styles.input_error}`}
                        />
                        {errors?.senha?.type === 'required' && <p className={styles.input_message}>Esse campo é obrigatório.</p>}
                        {errors?.senha?.type === 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 8 caracteres.</p>}
                        {errors?.senha?.type === 'maxLength' && <p className={styles.input_message}>Senha muito grande.</p>}
                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            {...register('confirmarSenha', {
                                validate: (value) => value === senha || "As senhas não correspondem."
                            })}
                            className={`${styles.input_info} ${errors.confirmarSenha && styles.input_error}`}
                        />
                        {errors.confirmarSenha && <p className={styles.input_message}>{errors.confirmarSenha.message}</p>}
                        <button type="submit" className={styles.action_btn}>Confirmar</button>
                    </form>
                </div>
            )}

            {/* Etapa 4: Senha alterada */}
            {step === "passwordChanged" && (
                <div className={styles.passwordChanged_container}>
                    <FaXmark className={styles.close_icon} onClick={toggleLogin} />
                    <div className={styles.title}>
                        <div className={styles.title_text}>Senha Alterada!</div>
                    </div>
                    <p className={styles.info}>
                        Senha alterada com sucesso. Por favor, tente não esquecê-la novamente.
                    </p>
                    <button className={`${styles.action_btn} ${styles.close} ${styles.padding}`} onClick={toggleLogin}>Fazer login</button>
                </div>
            )}
        </>
    );
}

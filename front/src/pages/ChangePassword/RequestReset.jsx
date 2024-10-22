import styles from './RequestReset.module.css';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';

export default function PasswordResetRequest() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();
    if (auth.senha === 'Email enviado com sucesso!') {
        navigate("/ResetPassword");
    }
    async function request(data) {
        try {
            await auth.requestReset(data.email);
            setMessage(auth.senha);
        } catch (error) {
            console.log('Erro ao solicitar recuperação de senha: ' + error);
        }
    }

    return (
        <>
            <div className={styles.bodyRequest}>
                <div className={styles.container}>
                    <h2>Recuperação de Senha</h2>
                    {message && <p>{message}</p>}
                    <form onSubmit={handleSubmit(request)}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className={errors.email && styles.input_error}
                        />
                        {errors.email && <p className={styles.input_message}>Email é obrigatório</p>}
                        <button type="submit">Enviar</button>
                    </form>
                    <div className={styles.menu_link}>
                        <Link to="/login" className={styles.menu_link}>
                            <li>Voltar</li>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

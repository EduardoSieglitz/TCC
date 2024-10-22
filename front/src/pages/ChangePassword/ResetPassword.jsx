import styles from "./ResetPassword.module.css";
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthProvider/useAuth";

export default function PasswordReset() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const auth = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    async function resetPassword(data) {
        try {
            const response = await Axios.post('http://localhost:3001/resetpassword', {
                token: data.token,
                newPassword: data.newPassword,
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('Erro ao redefinir a senha.');
        }
    }
    function Sair() {
        navigate("/")
        auth.logout();
    }
    return (
        <>
            <div className={styles.bodyPassword}>
                <div className={styles.container}>
                    <h2>Redefinir Senha</h2>
                    {message && <p>{message}</p>}
                    <form onSubmit={handleSubmit(resetPassword)}>
                        <label htmlFor="token">Token:</label>
                        <input
                            type="text"
                            {...register('token', { required: true })}
                            className={errors.token && styles.input_error}
                        />
                        {errors.token && <p className={styles.input_message}>Token é obrigatório</p>}

                        <label htmlFor="newPassword">Nova Senha:</label>
                        <input
                            type="password"
                            {...register('newPassword', { required: true })}
                            className={errors.newPassword && styles.input_error}
                        />
                        {errors.newPassword && <p className={styles.input_message}>Nova senha é obrigatória</p>}

                        <button type="submit">Redefinir Senha</button>
                    </form>
                    <div className={styles.menu_link}>
                        <Link to="/login" className={styles.menu_link}>
                            <li><button onClick={() => { Sair() }}>Voltar</button></li>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

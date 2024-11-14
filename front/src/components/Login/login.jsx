import styles from './login.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

function Login({ toggleCadastro, closeScreens }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const auth = useAuth();
    const [error, setError] = useState("");

    async function dados(values) {
        console.log(values);
        try {
            await auth.authenticate(values.email, values.senha);
            if (auth.token == false) {
                setError("Email ou Senha invalido");
            }
        } catch (erro) {
            console.log(erro);
        }
    }

    return (
        <>
            <div className={styles.overlay} />

            <div className={styles.container}>
                <FaXmark className={styles.close_icon} onClick={closeScreens} />
                {error}
                <div className={styles.title}>
                    <h2 className={styles.title_text}>Entrar</h2>
                </div>
                <div className={styles.content}>
                    <input type='email'
                        placeholder="Email"
                        {...register('email', { required: true, minLength: 6, maxLength: 50, validate: (value) => { return validator.isEmail(value) } })}
                        className={`${styles.input_info} ${errors?.email && styles.input_error}`}
                    />
                    {errors?.email?.type == 'required' && <p className={styles.input_menssage}>required</p>}
                    {errors?.email?.type == 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.email?.type == 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}
                    {errors?.email?.type == 'validate' && <p className={styles.input_menssage}>invalid Email</p>}


                    <input type="password"
                        placeholder="Senha"
                        {...register("senha", { required: true, minLength: 8, maxLength: 50 })}
                        className={`${styles.input_info} ${errors?.senha && styles.input_error}`}
                    />
                    {errors?.senha?.type == 'required' && <p className={styles.input_menssage}>required</p>}
                    {errors?.senha?.type == 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.senha?.type == 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                    <button className={`${styles.action_btn} ${styles.login_btn}`} onClick={() => { handleSubmit(dados)() }}>Entrar</button>

                    <NavLink to="/nova-senha" className={styles.action_link}>Esqueceu a senha?</NavLink>

                    <div className={styles.line} />

                    <button onClick={toggleCadastro} className={`${styles.action_btn} ${styles.register_btn}`}>
                        Cadastrar
                    </button>
                </div>

                <div className={styles.cad} />
            </div >
        </>
    );
}

export default Login;
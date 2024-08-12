import styles from './Login.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [context, setContext] = useState(false);
    function dados(event) {
        Axios.post('http://localhost:3001/login/auth', {
            email: event.email,
            senha: event.senha,
        }).then((res) => {
            setContext(res.data.Login);
            navigate("/home")
        }).catch((erro) => {
            setContext(erro.data.Login);
            navigate("/")
        });
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Entrar na conta</label>
                </div>
                <div className={styles.form}>
                    <input type='email'
                        placeholder="Email"
                        {...register('email', { required: true, minLength: 6, maxLength: 50, validate: (value) => { return validator.isEmail(value) } })}
                        className={errors?.email && styles.input_error}
                    />
                    {errors?.email?.type == 'required' && <p className={styles.input_menssage}>required</p>}
                    {errors?.email?.type == 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.email?.type == 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}
                    {errors?.email?.type == 'validate' && <p className={styles.input_menssage}>invalid Email</p>}


                    <input type="text"
                        placeholder="Senha"
                        {...register("senha", { required: true, minLength: 8, maxLength: 50 })}
                        className={errors?.senha && styles.input_error}
                    />
                    {errors?.senha?.type == 'required' && <p className={styles.input_menssage}>required</p>}
                    {errors?.senha?.type == 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.senha?.type == 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                    <button onClick={() => { handleSubmit(dados)() }}>Entrar</button>
                    <a href="#">Esqueceu a senha?</a>
                </div>
                <div className={styles.line}></div>
                <div className={styles.cad}>
                    <a href="/cadastro"><button>Criar nova conta</button></a>
                </div>
            </div>
        </>
    );
}
export default Login;
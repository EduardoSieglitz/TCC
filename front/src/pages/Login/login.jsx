import styles from './Login.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { useAuth } from '../../context/AuthProvider/useAuth';
import { useNavigate } from 'react-router-dom';
function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const auth = useAuth();
    const navigate = useNavigate()
    if (auth.email == auth.emailback && auth.senha == auth.senhaback && auth.token == "v") {
        navigate("/home");
    }
    function Error() {
        if (auth.token == undefined) {
            return <p className={styles.input_menssage}></p>
        }else if (auth.email != auth.emailback || auth.senha != auth.senhaback) {
            return <p className={styles.input_menssage}>Email ou Senha estão errados</p>
        } else {
            return <p className={styles.input_menssage}></p>
        }
    }
    async function dados(values) {
        try {
            await auth.authenticate(values.email, values.senha);
            if (auth.email == auth.emailback && auth.senha == auth.senhaback && auth.token == "v") {
                navigate("/home");
            }
        } catch (erro) {
            console.log(erro);
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <Error></Error>
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
import styles from './Cadastro.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';

export default function Cadastro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    console.log({ errors })
    const dados = (event) => {
       alert(JSON.stringify(event));
    }

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Criar nova conta</label>
                </div>

                <input type="text" placeholder="Nome"
                    {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                    className={errors?.nome && styles.input_error}
                />
                {errors?.nome?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <input type="text" placeholder="Email"
                    {...register('email', { required: true, minLength: 5, maxLength: 50, validate: (value) => { return validator.isEmail(value)} })}
                    className={errors?.email && styles.input_error}
                />
                {errors?.email?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.email?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.email?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}
                {errors?.email?.type === 'validate' && <p className={styles.input_menssage}>Email invalido</p>}

                <input type="password" placeholder="Senha"
                    {...register("senha", { required: true, maxLength: 30, minLength: 8 })}
                    className={errors?.senha && styles.input_error}
                />
                {errors?.senha?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.senha?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.senha?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <div className={styles.datanascimento}>

                    <select
                        {...register("dia", { validate: (value) => { return value != "0" } })}
                        className={errors?.dia && styles.select_error}>
                        <option value={"0"}>Dia</option>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                    </select>

                    <select
                        {...register("mes", { validate: (value) => { return value != "0" }, })}
                        className={errors?.mes && styles.select_error}>
                        <option value="0">Mês</option>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>

                    <select name="ano"
                        {...register("ano", { validate: (value) => { return value != "0" } })}
                        className={errors?.ano && styles.select_error}>
                        <option value={"0"}>Ano</option>
                        <option value={"2024"}>2024</option>
                        <option value={"2023"}>2023</option>
                    </select>
                </div>

                {errors?.dia?.type === 'validate' && <p className={styles.input_menssage}>dia error</p>}
                {errors?.mes?.type === 'validate' && <p className={styles.input_menssage}>mês error</p>}
                {errors?.ano?.type === 'validate' && <p className={styles.input_menssage}>ano error</p>}

                <button onClick={() => { handleSubmit(dados)() }} >Cadastrar</button>
                <div className={styles.line}></div>
                <a href="/" className={styles.return}>Já tem uma conta?</a>
            </div>
        </div >
    )
}
import styles from './funcionario.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Axios from 'axios';
import { useState } from 'react';

export default function Cadastro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    async function dados(event) {
        try {
            const request = await Axios.post("http://localhost:3001/registrar", {
                nome: event.nome,
                email: event.email,
                senha: event.senha,
                cpf: event.cpf,
                telefone: event.telefone,
                endereco: event.endereco
            });
            console.log(request.data)
            if (request.data == "Cadastrado") {
                setError("");
            }
            if (request.data == "Email") {
                setError("Email já existe");
            }
            if (request.data == "Telefone") {
                setError("Telefone já existe");
            }
            if (request.data == "CPF") {
                setError("CPF já existe");
            }
        } catch {
            console.log("Error")
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {error}
                <div className={styles.title}>
                    <label htmlFor="title">Registrar</label>
                </div>

                <input type="text" placeholder="Nome"
                    {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                    className={errors?.nome && styles.input_error}
                />
                {errors?.nome?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <input type="text" placeholder="Descrição"
                    {...register('descricao', { required: true, maxLength: 100 })}
                    className={errors?.descricao && styles.input_error}
                />
                {errors?.descricao?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.descricao?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <input type="text" placeholder="CPF"
                    {...register('cpf', { required: true, validate: (value) => validator.isTaxID(value, 'pt-BR') })}
                    className={errors?.cpf && styles.input_error}
                />
                {errors?.cpf?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.cpf?.type === 'validate' && <p className={styles.input_menssage}>CPF inválido</p>}

                <input type="text" placeholder="Telefone"
                    {...register("telefone", { required: true, validate: (value) => /^[1-9]{2}-?[9]{0,1}[0-9]{4}-?[0-9]{4}$/.test(value) })}
                    className={errors?.telefone && styles.input_error}
                />
                {errors?.telefone?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.telefone?.type === 'validate' && <p className={styles.input_menssage}>Somente números, xx-xxxxx-xxxx</p>}

                <input type="text" placeholder="Email"
                    {...register('email', { required: true, minLength: 6, maxLength: 50, validate: (value) => { return validator.isEmail(value) } })}
                    className={errors?.email && styles.input_error}
                />
                {errors?.email?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.email?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.email?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}
                {errors?.email?.type === 'validate' && <p className={styles.input_menssage}>Email inválido</p>}

                <input type="password" placeholder="Senha"
                    {...register("senha", { required: true, maxLength: 30, minLength: 8 })}
                    className={errors?.senha && styles.input_error}
                />
                {errors?.senha?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.senha?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.senha?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <button onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                <a href="/homefunc" className={styles.return}>Voltar</a>
            </div>
        </div >
    )
}

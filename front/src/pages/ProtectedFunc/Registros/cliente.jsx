import styles from './cliente.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";

export default function Cadastro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
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
            if (request.data == "Cadastrado") {
                setError("");
                navigate("/tabelacliente");
            } else if (request.data == "Email") {
                setError("Email já existe");
            } else if (request.data == "Telefone") {
                setError("Telefone já existe");
            } else if (request.data == "CPF") {
                setError("CPF já existe");
            } else {
                setError("");
            }
        } catch {
            console.log("Error")
        }
    }

    return (
        <>
        <Navbar></Navbar>
        <div className={styles.body}>
            <div className={styles.containerClien}>
                {error}
                <div className={styles.title}>
                    <label htmlFor="title">Registrar Cliente</label>
                </div>

                <input type="text" placeholder="Nome"
                    {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                    className={errors?.nome && styles.input_error}
                />
                {errors?.nome?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                <input type="text" placeholder="CPF"
                    {...register('cpf', { required: true })}
                    className={errors?.cpf && styles.input_error}
                />
                {errors?.cpf?.type === 'required' && <p className={styles.input_menssage}>Required</p>}

                <input type="text" placeholder="Email"
                    {...register('email', {
                        required: true,
                        minLength: 6,
                        maxLength: 50,
                        validate: (value) => validator.isEmail(value)
                    })}
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

                <input type="text" placeholder="Telefone"
                    {...register("telefone", {
                        required: true,
                        validate: (value) => /^[1-9]{2}-?[9]{0,1}[0-9]{4}-?[0-9]{4}$/.test(value)
                    })}
                    className={errors?.telefone && styles.input_error}
                />
                {errors?.telefone?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.telefone?.type === 'validate' && <p className={styles.input_menssage}>Formato inválido, xx-xxxxx-xxxx</p>}

                {/* Campo Endereço */}
                <input type="text" placeholder="Endereço"
                    {...register("endereco", { required: true, maxLength: 100 })}
                    className={errors?.endereco && styles.input_error}
                />
                {errors?.endereco?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                {errors?.endereco?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                <button onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                <Link to="/homefunc" className={styles.return}>Voltar</Link>
            </div>
        </div>
        </>
    );
}
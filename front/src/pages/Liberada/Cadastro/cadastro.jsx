import styles from './Cadastro.module.css';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cadastro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    async function dados(event) {
        console.log(event)
        try {
            const request = await Axios.post("http://localhost:3001/registrar", {
                nome: event.nome,
                email: event.email,
                senha: event.senha,
                cpf: event.cpf,
                telefone: event.telefone,
                rua: event.rua,
                estado: event.estado,
                cidade: event.cidade,
                cep: event.cep,
                numero: event.numero,
                bairro: event.bairro
            });
            if (request.data == "Cadastrado") {
                setError("");
                navigate("/");
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
            <div className={styles.overlay}></div>
            <div className={styles.bodyclien}>
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

                    <button onClick={() => { handleSubmit(dados)() }}>Cadastrar</button>
                </div>
                <div className={styles.containerClien}>
                    <div className={styles.title}>
                        <label htmlFor="title">Registrar Endereço</label>
                    </div>
                    <input type="text" placeholder="Estado"
                        {...register("estado", { required: true, maxLength: 100 })}
                        className={errors?.estado && styles.input_error}
                    />
                    {errors?.estado?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.estado?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                    <input type="text" placeholder="Cidade"
                        {...register("cidade", { required: true, maxLength: 100 })}
                        className={errors?.cidade && styles.input_error}
                    />
                    {errors?.cidade?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.cidade?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                    <input type="text" placeholder="Rua"
                        {...register("rua", { required: true, maxLength: 100 })}
                        className={errors?.rua && styles.input_error}
                    />
                    {errors?.rua?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.rua?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                    <input type="text" placeholder="Bairro"
                        {...register("bairro", { required: true, maxLength: 100 })}
                        className={errors?.bairro && styles.input_error}
                    />
                    {errors?.bairro?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.bairro?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                    <input type="text" placeholder="CEP"
                        {...register("cep", { required: true, maxLength: 100 })}
                        className={errors?.cep && styles.input_error}
                    />
                    {errors?.cep?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.cep?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}

                    <input type="text" placeholder="Numero"
                        {...register("numero", { required: true, maxLength: 100 })}
                        className={errors?.numero && styles.input_error}
                    />
                    {errors?.numero?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.numero?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength: 100 caracteres</p>}
                    <Link to="/" className={styles.return}>Já tem uma conta?</Link>
                </div >
            </div>
        </>
    );
}
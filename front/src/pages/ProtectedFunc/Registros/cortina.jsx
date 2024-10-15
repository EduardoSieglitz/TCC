import styles from './cortina.module.css';
import { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/navbar";
import { useForm } from 'react-hook-form';

export default function CadastroCortina() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    async function dados(event) {
        console.log(event);
        
        const formData = new FormData();
        formData.append('nome', event.nome);
        formData.append('descricao', event.descricao);
        formData.append('image', event.image[0]);  // Acessa o primeiro arquivo selecionado
        formData.append('tipo', event.tipo);
        formData.append('material', event.material);
    
        try {
            const request = await Axios.post("http://localhost:3001/registrarcortina", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (request.data === "Cadastrado") {
                setError("");
                navigate("/tabelacortina");
            } else {
                console.log(request.data);
                setError("Só é aceito png, jpg e jpeg");
            }
        } catch (error) {
            console.log("Erro: " + error);
            setError("Ocorreu um erro ao registrar a cortina.");
        }
    }
    
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.bodycortina}>
                <div className={styles.containerCortina}>
                    {error && <p className={styles.error_message}>{error}</p>}

                    <div className={styles.title}>
                        <label htmlFor="title">Registrar Cortina</label>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Nome"
                        {...register('nome', { required: true, maxLength: 50, minLength: 2 })}
                        className={errors?.nome && styles.input_error}
                    />
                    {errors?.nome?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.nome?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.nome?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                    <input
                        type="text" 
                        placeholder="Descrição da Cortina"
                        {...register('descricao', { required: true, maxLength: 100, minLength: 1 })}
                        className={errors?.descricao && styles.input_error}
                    />
                    {errors?.descricao?.type === 'required' && <p className={styles.input_menssage}>Required</p>}
                    {errors?.descricao?.type === 'minLength' && <p className={styles.input_menssage}>minLength</p>}
                    {errors?.descricao?.type === 'maxLength' && <p className={styles.input_menssage}>maxLength</p>}

                    <input
                        type="file" 
                        {...register('image', { required: true })}
                        className={errors?.image && styles.input_error}
                    />
                    {errors?.image?.type === 'required' && <p className={styles.input_menssage}>Required</p>}

                    <input
                        type="text" 
                        placeholder="Tipo"
                        {...register('tipo', { required: true, maxLength: 50, minLength: 1 })}
                        className={errors?.tipo && styles.input_error}
                    />
                    {errors?.tipo?.type === 'required' && <p className={styles.input_menssage}>Required</p>}

                    <input
                        type="text"
                        placeholder="Material"
                        {...register('material', { required: true, maxLength: 100, minLength: 1 })}
                        className={errors?.material && styles.input_error}
                    />
                    {errors?.material?.type === 'required' && <p className={styles.input_menssage}>Required</p>}

                    <button onClick={handleSubmit(dados)}>Cadastrar</button>  {/* Mudança aqui */}
                </div>
            </div>
        </>
    );
}

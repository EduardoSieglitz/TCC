import styles from './Login.module.css';
import { useState } from 'react';
import Axios from 'axios';
import React from 'react';

function Login() {
    const [dados, setDados] = useState();
    function pegarDados(dado) {
        setDados((event) => ({
            ...event,
            [dado.target.name]: dado.target.value,
        }));
    }

    function EnviarDados() {
        Axios.post("http://localhost:3001/login", {
            email : dados.email,
            senha : dados.senha,
        }).then((response)=>{
            console.log(response)
        });
        console.log(dados);
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Entrar na conta</label>
                </div>
                <form>
                    <input type="email" name="email" id="email" placeholder="Nome ou Email" onChange={pegarDados} />
                    <input type="text" name="senha" id="senha" placeholder="Senha" onChange={pegarDados} />
                    <button onClick={() => { EnviarDados() }}>Entrar</button>
                    <a href="#">Esqueceu a senha?</a>
                </form>
                <div className={styles.line}></div>
                <div className={styles.cad}>
                    <a href="/cadastro"><button>Criar nova conta</button></a>
                </div>
            </div>
        </>
    );
}
export default Login;
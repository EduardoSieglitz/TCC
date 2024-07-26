import styles from './Login.module.css';
import { useState } from 'react';
//import Axios from 'axios';
import React from 'react';
import { isEmail } from "validator";

function Login() {

    /*Pegando dados
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
    */
    //Validação
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const senha = e.target.value;
        setSenha(senha);
    };

    const required = (value) => {
        if (!value) {
            return (
                <div>
                    
                </div>
            );
        }
    };

    const validSenha = (value) => {
        if (value.length < 8 || value.length > 50) {
            return (
                <div>
                   
                </div>
            );
        }
    };

    const validEmail = (value) => {
        if (!isEmail(value)) {
            return (
                <div>
                    
                </div>
            );
        }
    };
    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Entrar na conta</label>
                </div>
                <form>
                    <input type="email"
                        name="email" id="email"
                        placeholder="Nome ou Email"
                        onChange={onChangeEmail}
                        validations={[required, validEmail]}
                        value={email}
                    />
                    <input type="text"
                        name="senha" id="senha"
                        placeholder="Senha"
                        onChange={onChangePassword}
                        validations={[required, validSenha]}
                        value={senha}
                    />
                    <button >Entrar</button>
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
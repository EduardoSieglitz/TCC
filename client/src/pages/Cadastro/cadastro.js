import styles from './Cadastro.module.css';
import { useState } from 'react';
import Axios from 'axios';
import React from 'react';
export default function Cadastro() {
    const [dados, setDados] = useState();
    function Dados(dado) {
        setDados((event) => ({
            ...event,
            [dado.target.name]: dado.target.value,
        }))
    }
    function EnviaDados() {
        Axios.post("http://localhost:3001/registrar", {
            nome: dados.name,
            email: dados.email,
            senha: dados.senha,
            dia: dados.dia,
            mes: dados.mes,
            ano: dados.ano,
        }).then((response) => {
            console.log(response);
        });
    }

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Criar nova conta</label>
                </div>
                <input type="text" name="name" placeholder="Nome" onChange={Dados} />
                <input type="text" name="email" id="email" placeholder="Email" onChange={Dados} />
                <input type="text" name="senha" id="senha" placeholder="Senha" onChange={Dados} />

                <div className={styles.datanascimento}>
                    <select name="dia" onChange={Dados}>
                        <option value={null}>Dia</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                    </select>
                    <select name="mes" onChange={Dados}>
                        <option value={null}>Mês</option>
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
                    <select name="ano" onChange={Dados}>
                        <option value={null}>Ano</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                    </select>
                </div>

                <button onClick={() => { EnviaDados() }}>Cadastrar</button>
                <a href="/">Já tem uma conta?</a>
                <div className={styles.line}></div>
                <a href="/" className={styles.return}>Voltar</a>
            </div>
        </div>
    )
}
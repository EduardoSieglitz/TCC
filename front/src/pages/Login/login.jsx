import styles from './Login.module.css';
import React from 'react';

function Login() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <label htmlFor="title">Entrar na conta</label>
                </div>
                <form>
                    <input type="email" name="email" id="email" placeholder="Nome ou Email" />
                    <input type="text" name="senha" id="senha" placeholder="Senha" />
                    <button>Entrar</button>
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
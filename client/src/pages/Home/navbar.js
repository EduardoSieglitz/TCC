import styles from './navbar.module.css';

export default function Home() {
  return (
    <>
      <nav id="nav">
        <div className={styles.ControlIndex}>
          <div className={styles.ControleMenu}>
            <div className={styles.MenuLeft}>
              <h2>Paginas:</h2>
            </div>
            <div className={styles.MenuRight} id="MenuRight">
              <div className={styles.Menu}></div>
              <div className={styles.Menu}></div>
              <div className={styles.Menu}></div>
            </div>
          </div>
          <div className={styles.flex}>
            <hr />

            <div className={styles.Inicio}><a href="/">Início</a></div>
            <hr />
            <div className={styles.Saudemental}><a href="./Saudemental">Saúde Mental</a></div>
            <hr />
            <div className={styles.Treino}><a href="./Treino">Treino</a></div>
            <hr />
            <div className={styles.Alimentacao}><a href="./Alimentacao">Alimentação</a></div>
            <hr />
            <div className={styles.Outros}><a href="./Outros">Outros</a></div>
            <hr />
          </div>
        </div>
        <center>
          <div className={styles.Linha}><hr /></div>
        </center>
      </nav>
    </>
  )
}



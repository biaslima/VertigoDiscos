import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import styles from "./Admin.module.css";

export default function Admin() {
  const navigate = useNavigate();

  async function sair() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log("Erro ao deslogar", error);
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.caixa}>
        <h1 className={styles.titulo}>PAINEL ADMIN</h1>
        <p className={styles.subtitulo}>Vertigo Discos</p>

        <div className={styles.botoes}>
          <button
            className={`${styles.btn} ${styles.btnPrimario}`}
            onClick={() => navigate("/cadastro")}
          >
            + Cadastrar novo disco
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecundario}`}
            onClick={() => navigate("/")}
          >
            Ver catálogo
          </button>
          <button className={`${styles.btn} ${styles.btnSair}`} onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

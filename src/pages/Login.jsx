import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function fazerLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/admin");
    } catch (e) {
      setErro("Email ou senha incorretos");
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.caixa}>
        <h1 className={styles.titulo}>VERTIGO</h1>
        <p className={styles.subtitulo}>Acesso restrito</p>

        <form className={styles.form} onSubmit={fazerLogin}>
          <div className={styles.campo}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="admin@vertigo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button className={styles.btnEntrar} type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

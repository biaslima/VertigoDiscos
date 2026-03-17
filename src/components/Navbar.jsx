import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });
    return () => unsubscribe();
  }, []);

  async function sair() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Vertigo Discos" className={styles.logoImg} />
      </div>

      <div className={styles.direita}>
        {user ? (
          <div className={styles.adminArea}>
            <span className={styles.badgeAdmin}>⚡Admin</span>
            <button
              className={styles.btnNav}
              onClick={() => navigate("/admin")}
            >
              Painel
            </button>
            <button
              className={`${styles.btnNav} ${styles.btnSair}`}
              onClick={sair}
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            className={styles.btnLogin}
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}

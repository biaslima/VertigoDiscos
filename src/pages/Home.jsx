import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscar() {
      const q = query(collection(db, "produtos"), orderBy("vendido"));
      const snapshot = await getDocs(q);
      const catalogo = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(catalogo);
    }
    buscar();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: "70px" }}>
        <header className={styles.header}>
          <img
            src="/favicon.svg"
            alt="Vertigo Discos"
            className={styles.logoImg}
            width="200"
          />
          <h1 className={styles.titulo}>VERTIGO DISCOS</h1>
          <p className={styles.subtitulo}>Discos novos, usados & raridades</p>
        </header>

        <div className={styles.grid}>
          {produtos.map((produto) => (
            <div
              className={`${styles.card} ${produto.vendido ? styles.cardVendido : ""}`}
              key={produto.id}
              onClick={() => navigate(`/produto/${produto.id}`)}
              role="button"
              tabIndex={0}
            >
              {produto.vendido && (
                <span className={styles.badgeVendido}>Vendido</span>
              )}

              {produto.fotos && produto.fotos.length > 0 ? (
                <img
                  className={styles.foto}
                  src={produto.fotos[0]}
                  alt={produto.titulo}
                />
              ) : (
                <div className={styles.semFoto}>🎵</div>
              )}

              <div className={styles.cardInfo}>
                <p className={styles.cardTitulo}>{produto.titulo}</p>
                <p className={styles.cardArtista}>{produto.artista}</p>
                <p className={styles.cardPreco}>R$ {produto.preco}</p>
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}

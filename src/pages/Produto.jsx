import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./Produto.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WHATSAPP_BRENO = "5575992050092";
const WHATSAPP_FELIPE = "5575923996330";

function IconeWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [user, setUser] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function buscar() {
      try {
        const docRef = doc(db, "produtos", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setProduto({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }
    buscar();
  }, [id]);

  async function apagarDisco() {
    const confirmacao = window.confirm("Tem certeza que deseja apagar este disco?");
    if (confirmacao) {
      try {
        await deleteDoc(doc(db, "produtos", id));
        alert("Disco excluído com sucesso!");
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o disco.");
      }
    }
  }

  async function marcarVendido() {
    const confirmacao = window.confirm("Tem certeza?");
    if (confirmacao) {
      try {
        await updateDoc(doc(db, "produtos", id), { vendido: !produto.vendido });
        setProduto({ ...produto, vendido: !produto.vendido });
      } catch (error) {
        console.error("Erro ao marcar como vendido:", error);
      }
    }
  }

  if (!produto) {
    return (
      <>
        <Navbar />
        <h1 style={{ textAlign: "center", padding: "80px", color: "var(--cor-secundaria)" }}>
          Carregando...
        </h1>
      </>
    );
  }

  const mensagem = `Olá! Tenho interesse no disco "${produto.titulo}" de ${produto.artista}. Prensagem: ${produto.prensagem}`;
  const linkBreno = `https://wa.me/${WHATSAPP_BRENO}?text=${encodeURIComponent(mensagem)}`;
  const linkFelipe = `https://wa.me/${WHATSAPP_FELIPE}?text=${encodeURIComponent(mensagem)}`;

  return (
    <div>
      <Navbar />

      <div style={{ paddingTop: "70px" }}>
        <div className={styles.pagina}>
          <button className={styles.voltar} onClick={() => navigate("/")}>
            ← Voltar ao catálogo
          </button>

          <div className={styles.conteudo}>
            {/* CARROSSEL */}
            <div className={styles.carrossel}>
              <img
                className={styles.fotoGrande}
                src={produto.fotos && produto.fotos[fotoAtual]}
                alt={produto.titulo}
              />
              {produto.fotos && produto.fotos.length > 1 && (
                <div className={styles.miniaturas}>
                  {produto.fotos.map((foto, index) => (
                    <button
                      key={index}
                      className={`${styles.miniatura} ${index === fotoAtual ? styles.miniaturaAtiva : ""}`}
                      onClick={() => setFotoAtual(index)}
                    >
                      <img src={foto} alt={`foto ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INFORMAÇÕES */}
            <div className={styles.info}>
              {produto.vendido && <span className={styles.badgeVendido}>Vendido</span>}

              <h1 className={styles.titulo}>{produto.titulo}</h1>
              <p className={styles.artista}>{produto.artista}</p>
              <p className={styles.preco}>R$ {produto.preco}</p>

              <hr className={styles.divisor} />

              <div className={styles.detalhes}>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Estado do disco</span>
                  <span className={styles.detalheValor}>{produto.estadoDisco}</span>
                </div>
                <div className={styles.detalheItem}>
                  <span className={styles.detalheLabel}>Estado da capa</span>
                  <span className={styles.detalheValor}>{produto.estadoCapa}</span>
                </div>
                {produto.prensagem && (
                  <div className={styles.detalheItem}>
                    <span className={styles.detalheLabel}>Prensagem</span>
                    <span className={styles.detalheValor}>{produto.prensagem}</span>
                  </div>
                )}
              </div>

              {produto.observacoes && (
                <p className={styles.observacoes}>{produto.observacoes}</p>
              )}

              {!produto.vendido && (
                <div className={styles.botoesWhatsapp}>
                  <a className={styles.btnWhatsapp} href={linkBreno} target="_blank" rel="noreferrer">
                    <IconeWhatsApp /> Comprar com Breno
                  </a>
                  <a className={styles.btnWhatsapp} href={linkFelipe} target="_blank" rel="noreferrer">
                    <IconeWhatsApp /> Comprar com Felipe
                  </a>
                </div>
              )}

              {user && (
                <div className={styles.painelAdmin}>
                  <p className={styles.painelAdminTitulo}>⚙ Painel Admin</p>
                  <div className={styles.botoesAdmin}>
                    <button className={`${styles.btnAdmin} ${styles.btnEditar}`} onClick={() => navigate(`/editar/${produto.id}`)}>
                      Editar
                    </button>
                    <button className={`${styles.btnAdmin} ${styles.btnExcluir}`} onClick={apagarDisco}>
                      Excluir
                    </button>
                    <button className={`${styles.btnAdmin} ${styles.btnVendido}`} onClick={marcarVendido}>
                      {produto.vendido ? "Desmarcar Vendido" : "Marcar Vendido"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

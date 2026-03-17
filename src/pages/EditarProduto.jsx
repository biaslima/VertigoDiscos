import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { Classificacao } from "../utils/classificacoes";
import styles from "./Form.module.css";

export default function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [preco, setPreco] = useState("");
  const [prensagem, setPrensagem] = useState("");
  const [estadoDisco, setEstadoDisco] = useState("");
  const [estadoCapa, setEstadoCapa] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [vendido, setVendido] = useState(false); // ← bug corrigido: estava dentro do useEffect
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscar() {
      const docRef = doc(db, "produtos", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const dados = snapshot.data();
        setTitulo(dados.titulo);
        setArtista(dados.artista);
        setPreco(dados.preco);
        setPrensagem(dados.prensagem || "");
        setEstadoDisco(dados.estadoDisco);
        setEstadoCapa(dados.estadoCapa);
        setVendido(dados.vendido || false);
        setObservacoes(dados.observacoes || "");
        setLoading(false);
      }
    }
    buscar();
  }, [id]);

  async function salvarAlteracoes(e) {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "produtos", id), {
        titulo,
        artista,
        preco: Number(preco),
        prensagem,
        estadoDisco,
        estadoCapa,
        vendido,
        observacoes,
      });
      alert("Disco atualizado com sucesso!");
      navigate(`/produto/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar alterações.");
    }
  }

  if (loading)
    return (
      <h1
        style={{
          textAlign: "center",
          padding: "80px",
          color: "var(--cor-secundaria)",
        }}
      >
        Carregando...
      </h1>
    );

  return (
    <div className={styles.pagina}>
      <button className={styles.voltar} onClick={() => navigate(-1)}>
        ← Cancelar
      </button>
      <h1 className={styles.titulo}>Editar Disco</h1>

      <form className={styles.form} onSubmit={salvarAlteracoes}>
        <div className={styles.campo}>
          <label className={styles.label}>Título</label>
          <input
            className={styles.input}
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Artista</label>
          <input
            className={styles.input}
            type="text"
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Preço (R$)</label>
          <input
            className={styles.input}
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Prensagem</label>
          <input
            className={styles.input}
            type="text"
            value={prensagem}
            onChange={(e) => setPrensagem(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Estado do Disco</label>
          <select
            className={styles.select}
            value={estadoDisco}
            onChange={(e) => setEstadoDisco(e.target.value)}
          >
            {Object.values(Classificacao).map((est) => (
              <option key={est} value={est}>
                {est}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Estado da Capa</label>
          <select
            className={styles.select}
            value={estadoCapa}
            onChange={(e) => setEstadoCapa(e.target.value)}
          >
            {Object.values(Classificacao).map((est) => (
              <option key={est} value={est}>
                {est}
              </option>
            ))}
          </select>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={vendido}
            onChange={(e) => setVendido(e.target.checked)}
          />
          Marcar como vendido
        </label>

        <div className={styles.campo}>
          <label className={styles.label}>Observações</label>
          <textarea
            className={styles.textarea}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows="4"
          />
        </div>

        <button className={styles.btnSubmit} type="submit">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

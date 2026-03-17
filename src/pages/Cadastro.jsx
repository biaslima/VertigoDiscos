import { useState } from "react";
import { Classificacao } from "../utils/classificacoes";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import styles from "./Form.module.css";

export default function Cadastro() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [arquivosCapa, setArquivosCapa] = useState([]);
  const [preco, setPreco] = useState("");
  const [prensagem, setPrensagem] = useState("");
  const [estadoDisco, setEstadoDisco] = useState(Classificacao.VERY_GOOD_PLUS);
  const [estadoCapa, setEstadoCapa] = useState(Classificacao.VERY_GOOD_PLUS);
  const [loading, setLoading] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [vendido, setVendido] = useState(false);

  const arquivoParaBase64 = (arquivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(arquivo);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  async function uploadParaImgBB(arquivo) {
    const base64 = await arquivoParaBase64(arquivo);
    const formData = new FormData();
    formData.append("image", base64);
    const chave = import.meta.env.VITE_IMGBB_API;
    const resposta = await fetch(
      `https://api.imgbb.com/1/upload?key=${chave}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const dados = await resposta.json();
    if (dados.success) return dados.data.url;
    throw new Error(dados.error.message);
  }

  async function handleCadastrar(e) {
    e.preventDefault();
    if (!titulo || !artista || !preco) {
      alert("Preencha os campos obrigatórios");
      return;
    }
    if (arquivosCapa.length === 0) {
      alert("Selecione pelo menos uma foto!");
      return;
    }
    try {
      setLoading(true);
      const urls = await Promise.all(arquivosCapa.map(uploadParaImgBB));
      await addDoc(collection(db, "produtos"), {
        titulo,
        artista,
        fotos: urls,
        preco: Number(preco),
        prensagem,
        estadoDisco,
        estadoCapa,
        vendido,
        observacoes,
        createdAt: new Date(),
      });
      alert(`Disco cadastrado com sucesso!`);
      navigate("/admin");
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar disco");
    }
    setLoading(false);
  }

  return (
    <div className={styles.pagina}>
      <button className={styles.voltar} onClick={() => navigate("/admin")}>
        ← Voltar
      </button>
      <h1 className={styles.titulo}>Cadastrar Disco</h1>

      <form className={styles.form} onSubmit={handleCadastrar}>
        <div className={styles.campo}>
          <label className={styles.label}>Título do Álbum *</label>
          <input
            className={styles.input}
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Artista *</label>
          <input
            className={styles.input}
            type="text"
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Fotos *</label>
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setArquivosCapa(Array.from(e.target.files))}
          />
          {arquivosCapa.length > 0 && (
            <div className={styles.previews}>
              {arquivosCapa.map((arquivo, index) => (
                <img
                  key={index}
                  className={styles.preview}
                  src={URL.createObjectURL(arquivo)}
                  alt={`preview-${index}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>Preço (R$) *</label>
          <input
            className={styles.input}
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
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
            {Object.values(Classificacao).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
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
            {Object.values(Classificacao).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
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
            placeholder="Detalhes adicionais..."
          />
        </div>

        <button className={styles.btnSubmit} type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Disco"}
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../../services/api";
import Usuario from "../../../models/Usuario";

function Chatzinho() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [status, setStatus] = useState("Carregando usuários...");

  async function carregarUsuarios() {
    try {
      const resposta = await api.get<Usuario[]>("usuario/listar");
      setUsuarios(resposta.data);
      setStatus("Conectado com a API do chat.");
    } catch (erro) {
      console.error(erro);
      setStatus("Não foi possível carregar os usuários da API.");
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function adicionarUsuario(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.post("usuario/cadastrar", {
        nome,
        email,
        telefone,
      } as Usuario);

      setNome("");
      setEmail("");
      setTelefone("");
      await carregarUsuarios();
      setStatus("Usuário adicionado com sucesso!");
    } catch (erro) {
      console.error(erro);
      setStatus("Erro ao adicionar usuário.");
    }
  }

  return (
    <main className="chat-container">
      <section className="painel painel-escuro">
        <p className="mini-title">LocalNet Chat</p>
        <h1>Chatzinho simples</h1>
        <p className="texto">Tela mínima para ver a API e cadastrar usuários.</p>
        <div className="badge">{status}</div>
      </section>

      <section className="painel">
        <h2>Usuários</h2>
        {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <ul className="lista-usuarios">
            {usuarios.map((usuario) => (
              <li key={usuario.id ?? usuario.email} className="cartao-usuario">
                <strong>{usuario.nome}</strong>
                <span>{usuario.email}</span>
                <small>{usuario.telefone}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="painel">
        <h2>Cadastrar usuário</h2>
        <form onSubmit={adicionarUsuario} className="form-chat">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" required />
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" required />
          <button type="submit">Adicionar</button>
        </form>
      </section>
    </main>
  );
}

export default Chatzinho;

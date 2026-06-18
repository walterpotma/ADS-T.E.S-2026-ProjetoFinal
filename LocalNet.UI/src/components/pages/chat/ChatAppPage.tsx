import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grupo from '../../../models/Grupo';
import Mensagem from '../../../models/Mensagem';
import Usuario from '../../../models/Usuario';
import { cadastrarMensagem, entrarGrupo, listarGrupos, listarMensagens, listarUsuarios, listarUsuariosPorGrupo } from '../../../services/apiService';

function ChatAppPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [membros, setMembros] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const salvo = localStorage.getItem('UsuarioConectado');
    if (!salvo) {
      navigate('/login');
      return;
    }

    setUsuario(JSON.parse(salvo));
  }, [navigate]);

  useEffect(() => {
    listarGrupos().then((res) => setGrupos(res.data)).catch(() => setGrupos([]));
    listarUsuarios().then((res) => setUsuarios(res.data)).catch(() => setUsuarios([]));
  }, []);

  useEffect(() => {
    if (!grupoSelecionado) return;

    listarMensagens(grupoSelecionado)
      .then((res) => setMensagens(Array.isArray(res.data) ? res.data : [res.data]))
      .catch(() => setMensagens([]));
  }, [grupoSelecionado]);

  const usuariosFiltrados = useMemo(() => {
    const termo = filtro.toLowerCase();
    return usuarios.filter((item) =>
      item.nome?.toLowerCase().includes(termo) || item.email?.toLowerCase().includes(termo)
    );
  }, [usuarios, filtro]);

  async function enviarMensagem(event: React.FormEvent) {
    event.preventDefault();
    if (!grupoSelecionado || !usuario?.id || !texto.trim()) return;

    await cadastrarMensagem({ text: texto.trim(), grupoId: grupoSelecionado, usuarioId: usuario.id });
    setTexto('');
    const res = await listarMensagens(grupoSelecionado);
    setMensagens(Array.isArray(res.data) ? res.data : [res.data]);
  }

  async function verMembros(grupoId: string) {
    setGrupoSelecionado(grupoId);
    const res = await listarUsuariosPorGrupo(grupoId);
    setMembros(Array.isArray(res.data) ? res.data : [res.data]);
  }

  async function adicionarAoGrupo(usuarioId: string) {
    if (!grupoSelecionado) return;
    await entrarGrupo({ usuarioId, grupoId: grupoSelecionado });
    alert('Usuário adicionado ao grupo.');
  }

  return (
    <main className="chat-layout">
      <aside className="chat-sidebar painel">
        <div className="painel painel-escuro">
          <p className="mini-title">LocalNet</p>
          <h2>Bem-vindo, {usuario?.nome || 'usuário'}</h2>
          <p className="texto">Escolha um grupo para abrir a conversa.</p>
        </div>

        <section className="chat-block">
          <h3>Grupos</h3>
          <ul className="lista-usuarios compact-list">
            {grupos.map((grupo) => (
              <li key={grupo.id} className="cartao-usuario small-card">
                <button className="topbar-btn" type="button" onClick={() => verMembros(grupo.id || '')}> {grupo.nome}</button>
                <span>{grupo.descricao}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="chat-block">
          <h3>Adicionar pessoas</h3>
          <input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Filtrar usuários" />
          <ul className="lista-usuarios compact-list">
            {usuariosFiltrados.map((item) => (
              <li key={item.id ?? item.email} className="cartao-usuario small-card">
                <strong>{item.nome}</strong>
                <span>{item.email}</span>
                <button type="button" className="topbar-btn" onClick={() => adicionarAoGrupo(item.id || '')}>Adicionar</button>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="chat-main painel">
        <h2>Conversa</h2>
        <p className="texto">Grupo selecionado: {grupoSelecionado || 'Nenhum'}</p>

        <div className="lista-usuarios">
          {mensagens.map((item, index) => (
            <article key={item.id ?? index} className="cartao-usuario">
              <strong>{item.usuarioId || 'Usuário'}</strong>
              <span>{item.text}</span>
            </article>
          ))}
        </div>

        <form onSubmit={enviarMensagem} className="form-chat" style={{ marginTop: 12 }}>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite sua mensagem" required />
          <button type="submit">Enviar</button>
        </form>

        <section className="chat-block" style={{ marginTop: 12 }}>
          <h3>Membros do grupo</h3>
          <ul className="lista-usuarios compact-list">
            {membros.map((membro) => (
              <li key={membro.id ?? membro.email} className="cartao-usuario small-card">
                <strong>{membro.nome}</strong>
                <span>{membro.email}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

export default ChatAppPage;

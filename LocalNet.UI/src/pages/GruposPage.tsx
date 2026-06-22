import React, { useState, useEffect } from 'react';
import { getUsuarioConectado } from '../utils/auth';
import { listarGruposPorUsuario } from '../services/GrupoService';
import GrupoChat from '../components/grupo/GrupoChat';
import GrupoDetails from '../components/grupo/GrupoDetails';
import GrupoCriar from '../components/grupo/GrupoCriar';
import Grupo from '../models/GrupoModel';
import Usuario from '../models/UsuarioModel';
import '../css/GruposPage.css';

const GruposPage: React.FC = () => {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [grupoAtivo, setGrupoAtivo] = useState<Grupo | null>(null);
  const [view, setView] = useState<'chat' | 'details'>('chat');
  const [isModalCriarAberto, setIsModalCriarAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUsuarioConectado();
    setUsuarioLogado(user);
    if (user && user.id) {
      carregarGrupos(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const carregarGrupos = async (userId: string) => {
    setLoading(true);
    try {
      const resposta = await listarGruposPorUsuario(userId);
      setGrupos(resposta.data || []);
    } catch (erro) {
      console.error(erro);
    }
    setLoading(false);
  };

  const atualizarListaEConversa = (grupoAtualizado: Grupo | null) => {
    setGrupoAtivo(grupoAtualizado);
    if (usuarioLogado?.id) carregarGrupos(usuarioLogado.id);
  };

  const gruposFiltrados = grupos.filter((g) =>
    g.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (!usuarioLogado) {
    return <div className="grupos-error-screen">Por favor, faça login para acessar os grupos.</div>;
  }

  return (
    <div className="grupos-layout-container">
      <aside className="grupos-sidebar">
        <div className="sidebar-header">
          <input
            type="text"
            placeholder="Pesquisar grupos..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="sidebar-search-input"
          />
          <button onClick={() => setIsModalCriarAberto(true)} className="btn-add-grupo">
            +
          </button>
        </div>

        <div className="sidebar-list">
          {loading ? (
            <div className="sidebar-status">Carregando...</div>
          ) : gruposFiltrados.length === 0 ? (
            <div className="sidebar-status">Nenhum grupo encontrado</div>
          ) : (
            gruposFiltrados.map((g) => (
              <div
                key={g.id}
                className={`sidebar-item ${grupoAtivo?.id === g.id ? 'active' : ''}`}
                onClick={() => {
                  setGrupoAtivo(g);
                  setView('chat');
                }}
              >
                <div className="group-item-avatar">{g.nome?.substring(0, 2).toUpperCase()}</div>
                <div className="group-item-info">
                  <h4>{g.nome}</h4>
                  <p>{g.descricao}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="grupos-main-content">
        {grupoAtivo ? (
          view === 'chat' ? (
            <GrupoChat
              grupo={grupoAtivo}
              usuarioLogado={usuarioLogado}
              onVerDetalhes={() => setView('details')}
            />
          ) : (
            <GrupoDetails
              grupo={grupoAtivo}
              usuarioLogado={usuarioLogado}
              onVoltarAoChat={() => setView('chat')}
              onGrupoModificado={atualizarListaEConversa}
            />
          )
        ) : (
          <div className="no-chat-selected">
            <h3>Selecione ou crie um grupo para começar a conversar!</h3>
          </div>
        )}
      </main>

      {isModalCriarAberto && (
        <GrupoCriar
          usuarioLogado={usuarioLogado}
          onFechar={() => setIsModalCriarAberto(false)}
          onCriadoSucesso={(novoGrupo) => {
            setIsModalCriarAberto(false);
            atualizarListaEConversa(novoGrupo);
          }}
        />
      )}
    </div>
  );
};

export default GruposPage;
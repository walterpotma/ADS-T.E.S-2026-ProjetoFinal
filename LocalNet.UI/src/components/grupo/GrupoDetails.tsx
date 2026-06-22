import React, { useState, useEffect } from 'react';
import { listarUsuariosPorGrupo, deletarGrupo } from '../../services/GrupoService';
import GrupoEditar from './GrupoEditar';
import Grupo from '../../models/GrupoModel';
import Usuario from '../../models/UsuarioModel';
import { Button } from '../ui/Button';

interface Props {
  grupo: Grupo;
  usuarioLogado: Usuario;
  onVoltarAoChat: () => void;
  onGrupoModificado: (grupo: Grupo | null) => void;
}

const GrupoDetails: React.FC<Props> = ({ grupo, usuarioLogado, onVoltarAoChat, onGrupoModificado }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (grupo.id) carregarUsuariosDoGrupo();
  }, [grupo.id]);

  const carregarUsuariosDoGrupo = async () => {
    if (!grupo.id) return;
    try {
      const resposta = await listarUsuariosPorGrupo(grupo.id);
      setUsuarios(resposta.data || []);
    } catch (erro) {
      console.error(erro);
    }
  };

  const handleExcluirGrupo = async () => {
    if (!grupo.id) return;
    if (window.confirm(`Deseja excluir o grupo "${grupo.nome}"?`)) {
      try {
        await deletarGrupo(grupo.id);
        onGrupoModificado(null);
      } catch (erro) {
        alert('Erro ao deletar grupo.');
      }
    }
  };

  if (isEditMode) {
    return (
      <GrupoEditar
        grupo={grupo}
        onCancelar={() => setIsEditMode(false)}
        onSalvo={(grupoAtualizado) => {
          setIsEditMode(false);
          onGrupoModificado(grupoAtualizado);
        }}
      />
    );
  }

  return (
    <div className="details-area-container">
      <header className="details-header">
        <button onClick={onVoltarAoChat} className="btn-back">← Voltar ao Chat</button>
        <h2>Detalhes do Grupo</h2>
      </header>

      <div className="details-card-body">
        <div className="details-info-section">
          <h3>{grupo.nome}</h3>
          <p className="details-description">{grupo.descricao || 'Sem descrição.'}</p>
        </div>

        <div className="details-users-section">
          <h4>Participantes do Grupo ({usuarios.length})</h4>
          <div className="details-users-list">
            {usuarios.map((u) => (
              <div key={u.id} className="details-user-item">
                <span className="user-dot">●</span>
                <p>{u.nome} <span className="user-email">({u.email})</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="details-actions-footer">
          <Button onClick={() => setIsEditMode(true)}>Editar Grupo</Button>
          <Button variant="cancel" onClick={handleExcluirGrupo}>Excluir Grupo</Button>
        </div>
      </div>
    </div>
  );
};

export default GrupoDetails;
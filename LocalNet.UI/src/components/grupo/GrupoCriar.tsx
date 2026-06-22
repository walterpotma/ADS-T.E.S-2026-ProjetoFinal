import React, { useState, useEffect } from 'react';
import { cadastrarGrupo, entrarGrupo } from '../../services/GrupoService';
import { listarUsuarios } from '../../services/UsuarioService';
import Usuario from '../../models/UsuarioModel';
import Grupo from '../../models/GrupoModel';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Props {
  usuarioLogado: Usuario;
  onFechar: () => void;
  onCriadoSucesso: (novoGrupo: Grupo) => void;
}

const GrupoCriar: React.FC<Props> = ({ usuarioLogado, onFechar, onCriadoSucesso }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<Usuario[]>([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarUsuariosDoSistema();
  }, []);

  const carregarUsuariosDoSistema = async () => {
    try {
      const resposta = await listarUsuarios();
      const lista = (resposta.data || []).filter(u => u.id !== usuarioLogado.id);
      setUsuariosDisponiveis(lista);
    } catch (erro) {
      console.error(erro);
    }
  };

  const toggleUsuarioSelection = (id: string) => {
    if (usuariosSelecionados.includes(id)) {
      setUsuariosSelecionados(usuariosSelecionados.filter(uid => uid !== id));
    } else {
      setUsuariosSelecionados([...usuariosSelecionados, id]);
    }
  };

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !usuarioLogado.id) return;

    setSubmitting(true);
    try {
      const respostaGrupo = await cadastrarGrupo({ nome, descricao });
      const novoGrupo = respostaGrupo.data;

      if (novoGrupo && novoGrupo.id) {
        await entrarGrupo({ usuarioId: usuarioLogado.id, grupoId: novoGrupo.id });

        for (let i = 0; i < usuariosSelecionados.length; i++) {
          await entrarGrupo({ usuarioId: usuariosSelecionados[i], grupoId: novoGrupo.id });
        }

        onCriadoSucesso(novoGrupo);
      }
    } catch (erro) {
      alert('Erro ao criar o grupo.');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Criar Novo Grupo</h3>
        <form onSubmit={handleCriar} className="modal-form-body">
          <div className="form-field">
            <label>Nome do Grupo</label>
            <Input value={nome} onChange={e => setNome(e.target.value)} required />
          </div>

          <div className="form-field">
            <label>Descrição</label>
            <Input value={descricao} onChange={e => setDescricao(e.target.value)} />
          </div>

          <div className="form-field-members">
            <label>Selecione os membros do grupo:</label>
            <div className="modal-checkbox-list">
              {usuariosDisponiveis.map(u => (
                <div key={u.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={u.id}
                    checked={usuariosSelecionados.includes(u.id!)}
                    onChange={() => toggleUsuarioSelection(u.id!)}
                  />
                  <label htmlFor={u.id}>{u.nome}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="cancel" type="button" onClick={onFechar} disabled={submitting}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>Criar Grupo</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrupoCriar;
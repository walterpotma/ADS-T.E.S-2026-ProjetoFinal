import React, { useState } from 'react';
import { atualizarGrupo } from '../../services/GrupoService';
import Grupo from '../../models/GrupoModel';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Props {
  grupo: Grupo;
  onCancelar: () => void;
  onSalvo: (grupoAtualizado: Grupo) => void;
}

const GrupoEditar: React.FC<Props> = ({ grupo, onCancelar, onSalvo }) => {
  const [nome, setNome] = useState(grupo.nome || '');
  const [descricao, setDescricao] = useState(grupo.descricao || '');
  const [saving, setSaving] = useState(false);

  const handleSubmeter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !grupo.id) return;

    setSaving(true);
    try {
      const resposta = await atualizarGrupo(grupo.id, { nome, descricao });
      onSalvo(resposta.data);
    } catch (erro) {
      alert('Erro ao atualizar grupo.');
    }
    setSaving(false);
  };

  return (
    <div className="details-area-container">
      <header className="details-header">
        <h2>Editar Grupo</h2>
      </header>
      <form onSubmit={handleSubmeter} className="edit-group-form">
        <div className="form-field">
          <label>Nome do Grupo</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="form-field">
          <label>Descrição</label>
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>

        <div className="edit-actions-box">
          <Button variant="cancel" onClick={onCancelar} type="button" disabled={saving}>Cancelar</Button>
          <Button type="submit" disabled={saving}>Salvar Alterações</Button>
        </div>
      </form>
    </div>
  );
};

export default GrupoEditar;
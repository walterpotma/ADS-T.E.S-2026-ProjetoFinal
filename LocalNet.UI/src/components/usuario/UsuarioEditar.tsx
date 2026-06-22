import React, { useState } from 'react';
import Usuario from '../../models/UsuarioModel';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { atualizarUsuario } from '../../services/UsuarioService';
import '../../css/UsuarioEditar.css';

interface Props {
  usuario: Usuario;
  aoCancelar: () => void;
  aoSalvar: () => void;
}

const UsuarioEditar: React.FC<Props> = ({ usuario, aoCancelar, aoSalvar }) => {
  const [nome, setNome] = useState(usuario.nome || '');
  const [email, setEmail] = useState(usuario.email || '');
  const [telefone, setTelefone] = useState(usuario.telefone || '');
  const [saving, setSaving] = useState(false);

  const handleSalvar = async () => {
    if (!usuario.id) {
      alert('ID do usuário inválido.');
      return;
    }
    setSaving(true);
    try {
      await atualizarUsuario(usuario.id, { nome, email, telefone });
      aoSalvar();
    } catch (erro) {
      console.error('Erro ao salvar usuário:', erro);
      alert('Erro ao salvar alterações.');
    }
    setSaving(false);
  };

  return (
    <div className="usuario-editar-container">
      <h2 className="usuario-titulo">Editar Perfil</h2>
      <div className="usuario-divisor" />

      <div className="usuario-campo-form">
        <label>Nome</label>
        <Input value={nome} onChange={e => setNome(e.target.value)} />
      </div>

      <div className="usuario-campo-form">
        <label>Email</label>
        <Input value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div className="usuario-campo-form">
        <label>Telefone</label>
        <Input value={telefone} onChange={e => setTelefone(e.target.value)} />
      </div>

      <div className="usuario-botoes-container">
        <Button variant="cancel" onClick={aoCancelar} disabled={saving}>Cancelar</Button>
        <Button variant="confirm" onClick={handleSalvar} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};

export default UsuarioEditar;
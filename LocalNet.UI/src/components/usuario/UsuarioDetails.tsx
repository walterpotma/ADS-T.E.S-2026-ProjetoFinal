import React from 'react';
import Usuario from '../../models/UsuarioModel';
import { Button } from '../ui/Button';

interface Props {
  usuario: Usuario;
  aoClicarEditar: () => void;
}

const UsuarioDetails: React.FC<Props> = ({ usuario, aoClicarEditar }) => {
  return (
    <div>
      <h2 className="usuario-titulo">Perfil</h2>
      <div className="usuario-divisor" />

      <div className="usuario-campo">
        <label>Nome</label>
        <p>{usuario.nome}</p>
      </div>

      <div className="usuario-campo">
        <label>Email</label>
        <p>{usuario.email}</p>
      </div>

      <div className="usuario-campo">
        <label>Telefone</label>
        <p>{usuario.telefone}</p>
      </div>

      <div className="usuario-acoes">
        <Button onClick={aoClicarEditar}>Editar</Button>
      </div>
    </div>
  );
};

export default UsuarioDetails;

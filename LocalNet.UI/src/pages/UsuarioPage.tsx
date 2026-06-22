import React, { useState, useEffect } from 'react';
import UsuarioDetails from '../components/usuario/UsuarioDetails';
import UsuarioEditar from '../components/usuario/UsuarioEditar';
import { buscarUsuario } from '../services/UsuarioService';
import Usuario from '../models/UsuarioModel';
import '../css/UsuarioPage.css';
import { getUsuarioConectado } from '../utils/auth';

const UsuarioPage: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    setLoading(true);
    try {
      const usuarioLogado = getUsuarioConectado();

      if (!usuarioLogado || !usuarioLogado.id) {  
        console.error('Nenhum usuário conectado ou ID ausente.');
        setLoading(false);
        return;
      }

      const resposta = await buscarUsuario(usuarioLogado.id);

      if (resposta && resposta.data) {
        setUsuario(resposta.data);
      } else {
        console.error('Erro ao carregar os dados do usuário.');
      }
    } catch (erro) {
      console.error('Erro ao carregar o usuário:', erro);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="usuario-loading">Carregando dados do perfil...</div>;
  }

  if (!usuario) {
    return <div className="usuario-erro">Usuário não encontrado.</div>;
  }

  return (
    <div className="usuario-page-container">
      <div className="usuario-card">
        {isEditing ? (
          <UsuarioEditar
            usuario={usuario}
            aoCancelar={() => setIsEditing(false)}
            aoSalvar={() => {
              setIsEditing(false);
              carregarDadosUsuario();
            }}
          />
        ) : (
          <UsuarioDetails
            usuario={usuario}
            aoClicarEditar={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default UsuarioPage;
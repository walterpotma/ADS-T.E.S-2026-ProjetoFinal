import React, { useState, useEffect } from 'react';
import UsuarioDetails from '../components/usuario/UsuarioDetails';
import UsuarioEditar from '../components/usuario/UsuarioEditar';
import { buscarUsuario } from '../services/UsuarioService';
import Usuario from '../models/UsuarioModel';
import '../css/UsuarioPage.css';

const UsuarioPage: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ID de teste simulando o usuário que logou no LocalNet Messenger
  const usuarioIdLogado = "5bef63cb-1be6-4b30-b1f2-84a1df4e0fbf"; 

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    setLoading(true);
    try {
      const resposta = await buscarUsuario(usuarioIdLogado);
      if (resposta && resposta.data) {
        setUsuario(resposta.data);
      } else {
        console.error('Erro ao carregar o usuário.');
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
              carregarDadosUsuario(); // Atualiza a tela com os novos dados do banco
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
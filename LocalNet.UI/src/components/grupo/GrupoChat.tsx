import React, { useState, useEffect, useRef } from 'react';
import { listarMensagens, cadastrarMensagem, MensagemComUsuario } from '../../services/MensagemService';
import Grupo from '../../models/GrupoModel';
import Usuario from '../../models/UsuarioModel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  grupo: Grupo;
  usuarioLogado: Usuario;
  onVerDetalhes: () => void;
}

const GrupoChat: React.FC<Props> = ({ grupo, usuarioLogado, onVerDetalhes }) => {
  const [mensagens, setMensagens] = useState<MensagemComUsuario[]>([]);
  const [textoNovaMsg, setTextoNovaMsg] = useState('');
  const [exibirMenu, setExibirMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!grupo.id) return;
    
    carregarMensagens();
    const intervalo = setInterval(carregarMensagens, 3000);

    return () => clearInterval(intervalo);
  }, [grupo.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const carregarMensagens = async () => {
    if (!grupo.id) return;
    try {
      const resposta = await listarMensagens(grupo.id);
      setMensagens(resposta.data || []);
    } catch {
      setMensagens([]);
    }
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoNovaMsg.trim() || !grupo.id || !usuarioLogado.id) return;

    try {
      await cadastrarMensagem({
        text: textoNovaMsg,
        grupoId: grupo.id,
        usuarioId: usuarioLogado.id
      });
      setTextoNovaMsg('');
      carregarMensagens();
    } catch (erro) {
      console.error(erro);
    }
  };

  return (
    <div className="chat-area-container">
      <header className="chat-header">
        <div className="chat-header-info">
          <h3>{grupo.nome}</h3>
          <p>{grupo.descricao}</p>
        </div>
        <div className="chat-header-actions">
          <button onClick={() => setExibirMenu(!exibirMenu)} className="btn-menu-options">⋮</button>
          {exibirMenu && (
            <div className="dropdown-menu">
              <button onClick={() => { onVerDetalhes(); setExibirMenu(false); }}>Detalhes do Grupo</button>
            </div>
          )}
        </div>
      </header>

      <div className="chat-messages-box">
        {mensagens.map((msg) => {
          const eMinha = msg.usuarioId === usuarioLogado.id;
          return (
            <div key={msg.id} className={`message-wrapper ${eMinha ? 'right' : 'left'}`}>
              <div className={`message-bubble ${eMinha ? 'my-bubble' : 'other-bubble'}`}>
                {!eMinha && <span className="message-sender-name">{msg.usuario?.nome || 'Usuário'}</span>}
                <p className="message-text">{msg.text}</p>
                <span className="message-time">
                  {msg.criadoEm ? new Date(msg.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleEnviar} className="chat-footer-form">
        <Input
          value={textoNovaMsg}
          onChange={(e) => setTextoNovaMsg(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
};

export default GrupoChat;
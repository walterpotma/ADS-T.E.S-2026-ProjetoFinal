import api from '../utils/axios';
import Usuario from '../models/UsuarioModel';

export interface MensagemComUsuario {
  id?: string;
  text?: string;
  grupoId?: string;
  usuarioId?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  usuario?: Usuario | null;
}

export async function listarMensagens(grupoId: string) {
  return api.get<MensagemComUsuario[]>(`/mensagem/listar/${grupoId}`);
}

export async function cadastrarMensagem(dados: { text: string; grupoId: string; usuarioId: string }) {
  return api.post('/mensagem/cadastrar', dados);
}
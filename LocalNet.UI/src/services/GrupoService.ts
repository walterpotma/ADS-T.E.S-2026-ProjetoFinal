import api from '../utils/axios';
import Grupo from '../models/GrupoModel';
import Usuario from '../models/UsuarioModel';

export async function listarGrupos() {
  return api.get<Grupo[]>('/grupo');
}

export async function listarGruposPorUsuario(usuarioId: string) {
  return api.get<Grupo[]>(`/grupo/listar-por-usuario/${usuarioId}`);
}

export async function buscarGrupo(grupoId: string) {
  return api.get<Grupo>(`/grupo/buscar/${grupoId}`);
}

export async function cadastrarGrupo(dados: { nome: string; descricao: string }) {
  return api.post<Grupo>('/grupo/cadastrar', dados);
}

export async function atualizarGrupo(id: string, dados: { nome: string; descricao: string }) {
  return api.put<Grupo>(`/grupo/atualizar/${id}`, dados);
}

export async function deletarGrupo(id: string) {
  return api.delete(`/grupo/deletar/${id}`);
}

export async function entrarGrupo(dados: { usuarioId: string; grupoId: string }) {
  return api.post('/usuario/entrar-grupo', dados);
}

export async function listarUsuariosPorGrupo(grupoId: string) {
  return api.get<Usuario[]>(`/usuario/listar-por-grupo/${grupoId}`);
}

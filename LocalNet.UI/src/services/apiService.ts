import api from './api';

export async function listarUsuarios() {
  return api.get('/usuario/listar');
}

export async function buscarUsuario(id: string) {
  return api.get(`/usuario/buscar/${id}`);
}

export async function cadastrarUsuario(dados: { nome: string; email: string; telefone: string }) {
  return api.post('/usuario/cadastrar', dados);
}

export async function listarGrupos() {
  return api.get('/grupo');
}

export async function cadastrarGrupo(dados: { nome: string; descricao: string }) {
  return api.post('/grupo/cadastrar', dados);
}

export async function listarMensagens(grupoId: string) {
  return api.get(`/mensagem/listar/${grupoId}`);
}

export async function cadastrarMensagem(dados: { text: string; grupoId: string; usuarioId: string }) {
  return api.post('/mensagem/cadastrar', dados);
}

export async function entrarGrupo(dados: { usuarioId: string; grupoId: string }) {
  return api.post('/usuario/entrar-grupo', dados);
}

export async function listarUsuariosPorGrupo(grupoId: string) {
  return api.get(`/usuario/listar-por-grupo/${grupoId}`);
}

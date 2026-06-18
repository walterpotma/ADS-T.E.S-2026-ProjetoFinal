import api from '../utils/axios';
import Usuario from '../models/UsuarioModel';

export async function listarUsuarios() {
  return api.get<Usuario[]>('/usuario/listar');
}

export async function buscarUsuario(id: string) {
  return api.get<Usuario>(`/usuario/buscar/${id}`);
}

export async function cadastrarUsuario(dados: { nome: string; email: string; telefone: string }) {
  return api.post<Usuario>('/usuario/cadastrar', dados);
}

export async function atualizarUsuario(id: string, dados: { nome: string; email: string; telefone: string }) {
  return api.put<Usuario>(`/usuario/atualizar/${id}`, dados);
}

export async function deletarUsuario(id: string) {
  return api.delete(`/usuario/deletar/${id}`);
}

export async function ConectarUsuario(email: string): Promise<Usuario> {
  try {
    const resposta = await listarUsuarios();
    const usuarios = resposta.data;
    const usuarioEncontrado = usuarios.find((u) => u.email === email);

    if (usuarioEncontrado) {
      localStorage.setItem('UsuarioConectado', JSON.stringify(usuarioEncontrado));
      return usuarioEncontrado;
    } else {
      throw new Error('E-mail não encontrado no sistema.');
    }
  } catch (error: any) {
    if (error.message === 'E-mail não encontrado no sistema.') {
      throw error;
    }
    throw new Error('Ocorreu um erro ao tentar conectar com o servidor.');
  }
}
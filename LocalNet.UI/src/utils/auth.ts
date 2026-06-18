import Usuario from '../models/UsuarioModel';

const CHAVE = 'UsuarioConectado';

export function getUsuarioConectado(): Usuario | null {
  const salvo = localStorage.getItem(CHAVE);
  if (!salvo) return null;
  try {
    return JSON.parse(salvo) as Usuario;
  } catch {
    return null;
  }
}

export function setUsuarioConectado(usuario: Usuario): void {
  localStorage.setItem(CHAVE, JSON.stringify(usuario));
}

export function logout(): void {
  localStorage.removeItem(CHAVE);
}

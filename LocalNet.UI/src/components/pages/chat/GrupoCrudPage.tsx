import { useEffect, useState } from 'react';
import { cadastrarGrupo, listarGrupos, listarUsuarios } from '../../../services/apiService';
import Grupo from '../../../models/Grupo';
import Usuario from '../../../models/Usuario';

function GrupoCrudPage() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    listarGrupos().then((res) => setGrupos(res.data)).catch(() => setGrupos([]));
    listarUsuarios().then((res) => setUsuarios(res.data)).catch(() => setUsuarios([]));
  }, []);

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    await cadastrarGrupo({ nome, descricao });
    setNome('');
    setDescricao('');
    const res = await listarGrupos();
    setGrupos(res.data);
  }

  return (
    <main className="chat-container">
      <section className="painel painel-escuro">
        <p className="mini-title">LocalNet</p>
        <h1>Gerenciar grupos</h1>
        <p className="texto">Cadastro simples de grupo para o chat.</p>
      </section>

      <section className="painel">
        <h2>Novo grupo</h2>
        <form onSubmit={salvar} className="form-chat">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do grupo" required />
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" />
          <button type="submit">Salvar grupo</button>
        </form>
      </section>

      <section className="painel">
        <h2>Grupos cadastrados</h2>
        <ul className="lista-usuarios">
          {grupos.map((grupo) => {
            const dono = usuarios.find((usuario) => usuario.id === grupo.id) ?? usuarios[0];

            return (
              <li key={grupo.id} className="cartao-usuario">
                <strong>Grupo: {grupo.nome}</strong>
                <span>Descrição: {grupo.descricao || 'Sem descrição'}</span>
                <small>Usuário associado: {dono?.nome || 'Nenhum usuário relacionado'}</small>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default GrupoCrudPage;

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Usuario from '../../../models/Usuario';
import { listarUsuarios } from '../../../services/apiService';
import ListarUsuarios from './ListarUsuarios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarUsuarios()
      .then((res) => setUsuarios(res.data))
      .catch(() => setUsuarios([]));
  }, []);

  const listaMapeada = useMemo(() =>
    usuarios.map((usuario) => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
    })),
    [usuarios]
  );

  function entrar(event: React.FormEvent) {
    event.preventDefault();
    const usuarioEncontrado = usuarios.find((item) => item.email === email);

    if (!usuarioEncontrado) {
      setErro('E-mail não encontrado.');
      return;
    }

    localStorage.setItem('UsuarioConectado', JSON.stringify(usuarioEncontrado));
    setErro('');
    navigate('/chat');
  }

  return (
    <main className="chat-container">
      <section className="painel painel-escuro">
        <p className="mini-title">LocalNet</p>
        <h1>Conectar</h1>
        <p className="texto">Simulação simples de login para entrar no chat.</p>
      </section>

      <section className="painel">
        <h2>Entrar com e-mail</h2>
        <form onSubmit={entrar} className="form-chat">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu e-mail" type="email" required />
          <button type="submit">Entrar</button>
        </form>
        {erro ? <p className="texto">{erro}</p> : null}
      </section>

      <ListarUsuarios/>
    </main>
  );
}

export default LoginPage;

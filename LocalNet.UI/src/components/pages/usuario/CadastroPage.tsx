import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../../../services/apiService';

function CadastroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    try {
      await cadastrarUsuario({ nome, email, telefone });
      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      setErro('Não foi possível criar a conta.');
      console.error(error);
    }
  }

  return (
    <main className="chat-container">
      <section className="painel painel-escuro">
        <p className="mini-title">LocalNet</p>
        <h1>Criar conta</h1>
        <p className="texto">Cadastre-se para entrar no chat e criar conversas.</p>
      </section>

      <section className="painel">
        <h2>Nova conta</h2>
        <form onSubmit={salvar} className="form-chat">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" required />
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" required />
          <button type="submit">Cadastrar</button>
        </form>
        {erro ? <p className="texto">{erro}</p> : null}
      </section>
    </main>
  );
}

export default CadastroPage;

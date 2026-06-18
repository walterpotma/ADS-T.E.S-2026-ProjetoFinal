import { useState } from "react";
import api from "../../../services/api";
import Usuario from "../../../models/Usuario";
import ListarUsuarios from "./ListarUsuarios";

function ConectarUsuario() {
    const [email, setEmail] = useState("");
    
    async function enviarFormulario(e: any) {
        e.preventDefault();
        try {
            // Busca a lista de usuários na API
            const resposta = await api.get<Usuario[]>("usuario/listar");
            const usuarios = resposta.data; // Pega o array de usuários retornado

            // Procura na lista um usuário que tenha o mesmo email digitado no input
            const usuarioEncontrado = usuarios.find(
                (usuario) => usuario.email === email
            );

            if (usuarioEncontrado) {
                // Se o usuário existir, salva no localStorage
                // O localStorage só aceita strings, por isso usamos JSON.stringify
                localStorage.setItem("UsuarioConectado", JSON.stringify(usuarioEncontrado));
                console.log("Usuário conectado com sucesso!", usuarioEncontrado);
                
                // Opcional: Avisar o usuário ou redirecionar para outra página
                alert("Conectado com sucesso!");
            } else {
                // Se não encontrar, avisa que o email não existe
                console.log("Usuário não encontrado.");
                alert("E-mail não encontrado no sistema.");
            }
            
        } catch (erro) {
            console.error("Erro ao conectar:", erro);
            alert("Ocorreu um erro ao tentar buscar os dados.");
        }
    }

    return (
        <main className="chat-container">
            <section className="painel painel-escuro">
                <p className="mini-title">LocalNet</p>
                <h1>Conectar usuário</h1>
                <p className="texto">Informe o e-mail cadastrado para entrar na sua conta e acessar os grupos.</p>
            </section>

            <section className="painel">
                <h2>Entrar</h2>
                <form onSubmit={enviarFormulario} className="form-chat">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Digite seu e-mail"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Conectar</button>
                </form>
            </section>

            <section className="painel">
                <ListarUsuarios />
            </section>
        </main>
    );
}

export default ConectarUsuario;
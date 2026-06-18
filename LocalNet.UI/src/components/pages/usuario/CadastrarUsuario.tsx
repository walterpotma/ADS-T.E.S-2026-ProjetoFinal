import { useState } from "react";
import api from "../../../services/api";
import Usuario from "../../../models/Usuario";

function CadastrarUsuario() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    
    async function enviarFormulario(e: any) {
        e.preventDefault();
        try {
            const usuario : Usuario = {
                nome, email, telefone
            }

            const resposta = await api.post("usuario/cadastrar", usuario);

            console.log(resposta);
        }
        catch (erro) {
            console.log(erro);
        }
    }

    return (
        <div>
            <h1>Cadastrar Usuário</h1>
            <p>Formulário para cadastrar um novo usuário.</p>
            <form onSubmit={enviarFormulario}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="telefone">Telefone:</label>
                    <input type="tel" id="telefone" name="telefone" required onChange={(e) => setTelefone(e.target.value)} />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastrarUsuario;
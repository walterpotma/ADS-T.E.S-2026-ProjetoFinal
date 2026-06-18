import { useEffect, useState } from "react";
// api não está sendo usada neste componente, então você pode removê-la se quiser.
import api from "../../../services/api"; 
import Usuario from "../../../models/Usuario";

function PerfilUsuario() {
    // Variável de estado agora começa com letra minúscula (usuario)
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        const conectado = localStorage.getItem("UsuarioConectado");
        
        // Correção: Se NÃO houver usuário conectado, interrompe a execução.
        if (!conectado) return;

        // Se houver, transforma a string de volta em objeto e salva no estado
        setUsuario(JSON.parse(conectado));
    }, []); // O array vazio garante que isso rode apenas uma vez quando a tela carregar

    return (
        <div>
            {/* Usando a variável com letra minúscula */}
            <span>{usuario?.nome}</span>
            <br />
            <span>{usuario?.email}</span>
        </div>
    );
}

export default PerfilUsuario;
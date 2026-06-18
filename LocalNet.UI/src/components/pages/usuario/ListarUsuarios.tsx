import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import Usuario from "../../../models/Usuario";

function ListarUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        getUsuarios();
    }, []);

    async function getUsuarios() {
        try {
            var response = await api.get<Usuario[]>("usuario/listar");
            console.log(response.data);
            setUsuarios(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const listaMapeada = useMemo(() =>
        usuarios.map((usuario) => ({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
        })),
        [usuarios]
    );

    return (
        <section className="painel">
            <h2>Usuários cadastrados</h2>
            <ul className="lista-usuarios">
                {listaMapeada.map((usuario) => (
                    <li key={usuario.id ?? usuario.email} className="cartao-usuario">
                        <strong>{usuario.nome}</strong>
                        <span>{usuario.email}</span>
                        <small>{usuario.telefone}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default ListarUsuarios;
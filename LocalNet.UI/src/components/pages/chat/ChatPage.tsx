import { useEffect, useState } from "react";
import api from "../../../services/api";
import Grupo from "../../../models/Grupo";
import Usuario from "../../../models/Usuario";

function ChatPage() {
    const [usuarioConectado, setUsuarioConectado] = useState<Usuario | null>(null);
    const [chatName, setChatName] = useState("Conversa com João");
    const [descricaoGrupo, setDescricaoGrupo] = useState("");
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [grupoSelecionado, setGrupoSelecionado] = useState("");
    const [usuarioParaAdicionar, setUsuarioParaAdicionar] = useState("");
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState<{ autor: string; texto: string }[]>([]);

    async function carregarGrupos() {
        try {
            const resposta = await api.get<Grupo[]>("grupo");
            setGrupos(resposta.data);
        } catch (erro: any) {
            // Captura o erro e verifica se é um 404 (Not Found)
            if (erro.response && erro.response.status === 404) {
                // Se for 404, não é um erro crítico, apenas não há grupos.
                // Define a lista como vazia para ativar o fallback do seu JSX.
                setGrupos([]);
            } else {
                // Se for erro 500 (banco caiu) ou outro problema, aí sim mostramos no console.
                console.error("Erro inesperado ao carregar grupos:", erro);
                setGrupos([]);
            }
        }
    }

    async function carregarUsuarios() {
        try {
            const resposta = await api.get<Usuario[]>("usuario/listar");
            setUsuarios(resposta.data);
        } catch (erro: any) {
            if (erro.response && erro.response.status === 404) {
                setUsuarios([]);
            } else {
                console.error("Erro inesperado ao carregar usuários:", erro);
                setUsuarios([]);
            }
        }
    }

    async function criarChat(event: React.FormEvent) {
        event.preventDefault();

        try {
            const usuarioId = usuarioConectado?.id || usuarioSelecionado || usuarios[0]?.id;

            if (!usuarioId) {
                setMensagens((atual) => [
                    ...atual,
                    { autor: "Sistema", texto: "Faça login antes de criar um grupo." },
                ]);
                return;
            }

            const resposta = await api.post<Grupo>("grupo/cadastrar", {
                nome: chatName,
                descricao: descricaoGrupo || "Sem descrição",
            } as Grupo);

            const grupoCriado = resposta.data;

            if (grupoCriado?.id && usuarioId) {
                await api.post("usuario/entrar-grupo", {
                    usuarioId,
                    grupoId: grupoCriado.id,
                });
            }

            setChatName("");
            setDescricaoGrupo("");
            setUsuarioSelecionado("");
            await carregarGrupos();
            setMensagens((atual) => [
                ...atual,
                { autor: "Sistema", texto: `Chat "${grupoCriado?.nome || chatName}" criado com sucesso.` },
            ]);
        } catch (erro) {
            console.error(erro);
            setMensagens((atual) => [
                ...atual,
                { autor: "Sistema", texto: "Não foi possível criar o chat agora." },
            ]);
        }
    }

    async function adicionarPessoaAoGrupo(event: React.FormEvent) {
        event.preventDefault();

        try {
            await api.post("usuario/entrar-grupo", {
                usuarioId: usuarioParaAdicionar,
                grupoId: grupoSelecionado,
            });

            setUsuarioParaAdicionar("");
            setGrupoSelecionado("");
            setMensagens((atual) => [
                ...atual,
                { autor: "Sistema", texto: "Pessoa adicionada ao grupo com sucesso." },
            ]);
        } catch (erro) {
            console.error(erro);
            setMensagens((atual) => [
                ...atual,
                { autor: "Sistema", texto: "Não foi possível adicionar essa pessoa ao grupo." },
            ]);
        }
    }

    useEffect(() => {
        const salvo = localStorage.getItem("UsuarioConectado");
        if (salvo) {
            try {
                setUsuarioConectado(JSON.parse(salvo) as Usuario);
            } catch {
                setUsuarioConectado(null);
            }
        }

        carregarGrupos();
        carregarUsuarios();
    }, []);

    function enviarMensagem(event: React.FormEvent) {
        event.preventDefault();
        if (!mensagem.trim()) return;

        setMensagens((atual) => [
            ...atual,
            { autor: "Você", texto: mensagem.trim() },
        ]);
        setMensagem("");
    }

    return (
        <main className="chat-layout">
            <section className="chat-sidebar painel">
                <div className="painel painel-escuro">
                    <p className="mini-title">LocalNet</p>
                    <h1>Mensagens</h1>
                    <p className="texto">Abra uma conversa e depois adicione pessoas ao grupo.</p>
                    <div className="badge">Ativa: {chatName}</div>
                </div>

                <div className="chat-block">
                    <h2>Abrir conversa</h2>
                    <p className="texto">Crie uma conversa e escolha a pessoa inicial.</p>
                    <form onSubmit={criarChat} className="form-chat">
                        <input
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            placeholder="Ex.: Conversa com Ana"
                            required
                        />
                        <input value={descricaoGrupo} onChange={(e) => setDescricaoGrupo(e.target.value)} placeholder="Descrição do chat" />
                        <select
                            value={usuarioSelecionado}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setUsuarioSelecionado(valor);
                                const pessoa = usuarios.find((item) => (item.id ?? item.email) === valor);
                                if (pessoa?.nome) {
                                    setChatName(`Conversa com ${pessoa.nome}`);
                                }
                            }}
                            required
                        >
                            <option value="">Selecione a pessoa inicial</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id ?? usuario.email} value={usuario.id ?? ""}>{usuario.nome} — {usuario.email}</option>
                            ))}
                        </select>
                        <button type="submit">Abrir conversa</button>
                    </form>
                </div>

                <div className="chat-block">
                    <h3>Pessoas disponíveis</h3>
                    {usuarios.length === 0 ? (
                        <p className="texto">Nenhuma pessoa disponível no momento.</p>
                    ) : (
                        <ul className="lista-usuarios compact-list">
                            {usuarios.map((usuario) => (
                                <li key={usuario.id ?? usuario.email} className="cartao-usuario small-card">
                                    <strong>{usuario.nome}</strong>
                                    <span>{usuario.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="chat-block">
                    <h3>Adicionar pessoas</h3>
                    <form onSubmit={adicionarPessoaAoGrupo} className="form-chat">
                        <select value={grupoSelecionado} onChange={(e) => setGrupoSelecionado(e.target.value)} required>
                            <option value="">Selecione um grupo</option>
                            {grupos.map((grupo) => (
                                <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                            ))}
                        </select>
                        <select value={usuarioParaAdicionar} onChange={(e) => setUsuarioParaAdicionar(e.target.value)} required>
                            <option value="">Selecione a pessoa para adicionar</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id ?? usuario.email} value={usuario.id ?? ""}>{usuario.nome} — {usuario.email}</option>
                            ))}
                        </select>
                        <button type="submit">Adicionar pessoa</button>
                    </form>
                </div>

                <div className="chat-block">
                    <h3>Grupos</h3>
                    {grupos.length === 0 ? (
                        <p className="texto">Nenhum grupo encontrado para esta pessoa.</p>
                    ) : (
                        <ul className="lista-usuarios compact-list">
                            {grupos.map((grupo) => (
                                <li key={grupo.id} className="cartao-usuario small-card">
                                    <strong>{grupo.nome || "Grupo sem nome"}</strong>
                                    <span>{grupo.descricao || "Sem descrição"}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <section className="chat-main painel">
                <h2>Abrir conversa</h2>
                <p className="texto">Primeiro crie a conversa. Depois, use a opção abaixo para adicionar mais pessoas ao grupo.</p>
                <form onSubmit={criarChat} className="form-chat">
                    <input
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        placeholder="Ex.: Conversa com Ana"
                        required
                    />
                    <input value={descricaoGrupo} onChange={(e) => setDescricaoGrupo(e.target.value)} placeholder="Descrição do chat" />
                    <select
                        value={usuarioSelecionado}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setUsuarioSelecionado(valor);
                            const pessoa = usuarios.find((item) => (item.id ?? item.email) === valor);
                            if (pessoa?.nome) {
                                setChatName(`Conversa com ${pessoa.nome}`);
                            }
                        }}
                        required
                    >
                        <option value="">Selecione a pessoa que entra no chat</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id ?? usuario.email} value={usuario.id ?? ""}>{usuario.nome} — {usuario.email}</option>
                        ))}
                    </select>
                    <button type="submit">Abrir conversa</button>
                </form>

                <h3 style={{ marginTop: 12 }}>Pessoas disponíveis</h3>
                {usuarios.length === 0 ? (
                    <p className="texto">Nenhuma pessoa disponível no momento.</p>
                ) : (
                    <ul className="lista-usuarios">
                        {usuarios.map((usuario) => (
                            <li key={usuario.id ?? usuario.email} className="cartao-usuario">
                                <strong>{usuario.nome}</strong>
                                <span>{usuario.email}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <h3 style={{ marginTop: 12 }}>Adicionar pessoas à conversa</h3>
                <form onSubmit={adicionarPessoaAoGrupo} className="form-chat">
                    <select value={grupoSelecionado} onChange={(e) => setGrupoSelecionado(e.target.value)} required>
                        <option value="">Selecione um grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                        ))}
                    </select>
                    <select value={usuarioParaAdicionar} onChange={(e) => setUsuarioParaAdicionar(e.target.value)} required>
                        <option value="">Selecione a pessoa para adicionar</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id ?? usuario.email} value={usuario.id ?? ""}>{usuario.nome} — {usuario.email}</option>
                        ))}
                    </select>
                    <button type="submit">Adicionar pessoa</button>
                </form>

                <h3 style={{ marginTop: 12 }}>Grupos que você está</h3>
                {grupos.length === 0 ? (
                    <p className="texto">Nenhum grupo encontrado para esta pessoa.</p>
                ) : (
                    <ul className="lista-usuarios">
                        {grupos.map((grupo) => (
                            <li key={grupo.id} className="cartao-usuario">
                                <strong>{grupo.nome || "Grupo sem nome"}</strong>
                                <span>{grupo.descricao || "Sem descrição"}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="painel">
                <h2>Conversa</h2>
                <p className="texto">Área principal do chat. Aqui você envia mensagens e acompanha a conversa aberta.</p>
                <div className="lista-usuarios">
                    {mensagens.length === 0 ? (
                        <article className="cartao-usuario">
                            <strong>Sistema</strong>
                            <span>Ainda não há mensagens neste grupo. Envie a primeira mensagem para começar a conversa.</span>
                        </article>
                    ) : (
                        mensagens.map((item, index) => (
                            <article key={index} className="cartao-usuario">
                                <strong>{item.autor}</strong>
                                <span>{item.texto}</span>
                            </article>
                        ))
                    )}
                </div>

                <form onSubmit={enviarMensagem} className="form-chat" style={{ marginTop: 12 }}>
                    <input value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Digite sua mensagem" required />
                    <button type="submit">Enviar</button>
                </form>
            </section>
        </main>
    );
}

export default ChatPage;

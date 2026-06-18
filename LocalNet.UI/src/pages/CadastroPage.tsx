import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrarUsuario } from '../services/UsuarioService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import '../css/CadastroPage.css';

function CadastroPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleCadastro(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            await cadastrarUsuario({ nome, email, telefone });
            alert('Conta criada com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            setErro('Erro ao criar a conta. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">
                <h1 className="cadastro-title">Criar Conta</h1>
                <p className="cadastro-subtitle">Junte-se ao LocalNet Web</p>
                
                <form onSubmit={handleCadastro} className="cadastro-form">
                    {erro && <div className="cadastro-error">{erro}</div>}
                    
                    <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required className="cadastro-input" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" required className="cadastro-input" />
                    <Input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Seu telefone" required className="cadastro-input" />
                    
                    <Button type="submit" disabled={loading} className="cadastro-button">
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                </form>
                <p className="cadastro-footer">Já tem uma conta? <Link to="/login" className="cadastro-link">Faça login</Link></p>
            </div>
        </div>
    );
}

export default CadastroPage;
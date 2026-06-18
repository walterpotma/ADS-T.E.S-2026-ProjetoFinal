import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ConectarUsuario } from '../services/UsuarioService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import '../css/LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e: any) {
        e.preventDefault();
        setErro('');

        try {
            await ConectarUsuario(email);
            navigate('/grupo');
        } catch (error: any) {
            console.error('Erro ao conectar:', error.message);
            setErro(error.message || 'Ocorreu um erro ao tentar conectar com o servidor.');
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">LocalNet Web</h1>
                <p className="login-subtitle">Faça login para acessar suas mensagens</p>
                
                <form onSubmit={handleLogin} className="login-form">
                    {erro && <div className="login-error">{erro}</div>}
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu e-mail" required className="login-input" />
                    <Button type="submit" className="login-button">Conectar</Button>
                </form>
                <p className="login-footer">Ainda não tem uma conta? <Link to="/cadastrar" className="login-link">Cadastre-se</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
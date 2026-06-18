import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
    useEffect(() => {
        const salvo = localStorage.getItem('UsuarioConectado');
        if (salvo) {
            console.log("User Salvo");
        }
    }, []);

    return (
        <div className="home-container">
            <div className="home-card">
                <div className="home-logo">
                    LN
                </div>
                
                <h1 className="home-title">
                    Bem-vindo ao LocalNet
                </h1>
                
                <p className="home-description">
                    Uma plataforma simples, rápida e direta para troca de mensagens. 
                    Crie grupos, adicione seus colegas e comece a conversar imediatamente. 
                    Tudo pensado para melhorar a comunicação da sua equipe no dia a dia.
                </p>

                <div className="home-actions">
                    <Link to="/login" className="btn-primary">
                        Já tenho uma conta
                    </Link>
                    <Link to="/cadastrar" className="btn-secondary">
                        Criar nova conta
                    </Link>
                </div>
            </div>

            <div className="features-container">
                <div className="feature-card">
                    <h3 className="feature-title">Chats Privados</h3>
                    <p className="feature-description">Converse diretamente com seus colegas de forma rápida e segura.</p>
                </div>
                <div className="feature-card">
                    <h3 className="feature-title">Grupos de Equipe</h3>
                    <p className="feature-description">Organize conversas por departamentos, projetos ou assuntos.</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import ChatAppPage from './components/pages/chat/ChatAppPage';
import GrupoCrudPage from './components/pages/chat/GrupoCrudPage';
import LoginPage from './components/pages/usuario/LoginPage';
import CadastroPage from './components/pages/usuario/CadastroPage';

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="app-branding">
          <h1>Local Net</h1>
        </div>
        <nav className="topbar">
          {/* Trocamos Link por NavLink e usamos a propriedade isActive */}
          <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? "topbar-btn active" : "topbar-btn"}
          >
            Login
          </NavLink>
          
          <NavLink 
            to="/cadastro" 
            className={({ isActive }) => isActive ? "topbar-btn active" : "topbar-btn"}
          >
            Cadastro
          </NavLink>
          
          <NavLink 
            to="/chat" 
            className={({ isActive }) => isActive ? "topbar-btn active" : "topbar-btn"}
          >
            Chat
          </NavLink>
          
          <NavLink 
            to="/grupos" 
            className={({ isActive }) => isActive ? "topbar-btn active" : "topbar-btn"}
          >
            Grupos
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/chat" element={<ChatAppPage />} />
        <Route path="/grupos" element={<GrupoCrudPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
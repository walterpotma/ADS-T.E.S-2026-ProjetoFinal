import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import UsuarioPage from './pages/UsuarioPage';
import GruposPage from './pages/GruposPage';

function AppHeader() {

  return (
    <header className="app-header">
      <div className="app-branding">
        <h1>LocalNet</h1>
      </div>
      <nav className="topbar">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'topbar-btn active' : 'topbar-btn')}>
          Pagina Inicial
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'topbar-btn active' : 'topbar-btn')}>
          Login
        </NavLink>
        <NavLink to="/cadastrar" className={({ isActive }) => (isActive ? 'topbar-btn active' : 'topbar-btn')}>
          Cadastrar
        </NavLink>
        <NavLink to="/grupo" className={({ isActive }) => (isActive ? 'topbar-btn active' : 'topbar-btn')}>
          Grupos
        </NavLink>
        <NavLink to="/usuario" className={({ isActive }) => (isActive ? 'topbar-btn active' : 'topbar-btn')}>
          Usuario
        </NavLink>
      </nav>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastrar" element={<CadastroPage />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/grupo" element={<GruposPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

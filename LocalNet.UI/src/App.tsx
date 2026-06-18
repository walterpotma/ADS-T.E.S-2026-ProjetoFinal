import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';

function AppHeader() {
  const location = useLocation();
  const rotasSemHeader = ['/chat', '/grupo'];
  const esconderHeader = rotasSemHeader.some((rota) => location.pathname.startsWith(rota));

  if (esconderHeader) return null;

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

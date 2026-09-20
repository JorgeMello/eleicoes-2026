import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Comparador from './pages/Comparador.jsx';
import Home from './pages/Home.jsx';
import Perfil from './pages/Perfil.jsx';
import Pesquisas from './pages/Pesquisas.jsx';
import Rankings from './pages/Rankings.jsx';
import Manual from './pages/Manual.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/presidente" replace />} />
      <Route path="/pesquisas" element={<Layout><Pesquisas /></Layout>} />
      <Route path="/manual" element={<Layout><Manual /></Layout>} />
      <Route path="/:cargo" element={<Layout><Home /></Layout>} />
      <Route path="/:cargo/comparar" element={<Layout><Comparador /></Layout>} />
      <Route path="/:cargo/rankings" element={<Layout><Rankings /></Layout>} />
      <Route path="/:cargo/:slug" element={<Layout><Perfil /></Layout>} />
    </Routes>
  );
}

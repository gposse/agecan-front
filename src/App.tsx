import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Agendar from './pages/Agendar';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Paquetes from './pages/Paquetes';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';

// Ported from agecan-front/src/app/app.routes.ts

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="agendar"
          element={
            <ProtectedRoute>
              <Agendar />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="paquetes" element={<Paquetes />} />
        <Route path="productos" element={<Productos />} />
        <Route
          path="carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route path="privacidad" element={<Privacidad />} />
        <Route path="terminos" element={<Terminos />} />
      </Route>
    </Routes>
  );
}

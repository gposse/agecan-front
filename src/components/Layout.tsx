import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/images/logo.png';

// Ported from agecan-front/src/app/menu/menu.component.ts / .html

const navLinks = [
  { to: '/paquetes', label: 'Programa tu sesión' },
  { to: '/#about', label: 'Quiénes somos' },
  { to: '/#quehacemos', label: 'Qué hacemos' },
  { to: '/productos', label: 'Productos' },
  { to: '/#contacto', label: 'Contáctanos' },
];

export default function Layout() {
  const { isLoggedIn, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-primary-tint/40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Agenda Canina" className="h-12 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn && (
              <Link
                to="/carrito"
                className="relative rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
                aria-label="Carrito"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {itemCount()}
                  </span>
                )}
              </Link>
            )}
            {!isLoggedIn && (
              <NavLink
                to="/login"
                className="rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                Ingresar
              </NavLink>
            )}
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                Salir
              </button>
            )}
          </nav>

          <button
            type="button"
            className="lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-primary-tint/40 bg-white px-4 py-2 lg:hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn && (
              <Link
                to="/carrito"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                <ShoppingCart className="h-5 w-5" />
                Carrito {itemCount() > 0 && `(${itemCount()})`}
              </Link>
            )}
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded px-3 py-2 text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                Ingresar
              </Link>
            )}
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded px-3 py-2 text-left text-sm font-medium text-secondary hover:bg-tertiary-tint/40"
              >
                Salir
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-primary-tint/40 bg-secondary py-6 text-center text-sm text-white">
        <p>&copy; {new Date().getFullYear()} Agenda Canina. Todos los derechos reservados.</p>
        <p className="mt-1">
          <Link to="/privacidad" className="underline hover:text-tertiary-tint">
            Política de privacidad
          </Link>{' '}
          ·{' '}
          <Link to="/terminos" className="underline hover:text-tertiary-tint">
            Términos y condiciones
          </Link>
        </p>
      </footer>
    </div>
  );
}

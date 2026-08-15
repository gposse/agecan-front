import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { prices as fetchPrices, sessionsUser } from '../services/api';

// Ported from agecan-front/src/app/paquetes/paquetes.page.ts / .html

function formatoPrecio(precio: number) {
  return '$' + precio.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function Paquetes() {
  const { user, isLoggedIn } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [numSesiones, setNumSesiones] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const pricesQuery = useQuery({
    queryKey: ['prices', 'Sesiones'],
    queryFn: async () => {
      const r = await fetchPrices();
      // filtered client-side by type, same as the original ApiService.prices()
      return r.prices.filter((p) => p.type === 'Sesiones');
    },
  });

  const sessionsQuery = useQuery({
    queryKey: ['sessionsUser'],
    queryFn: sessionsUser,
    enabled: isLoggedIn,
  });

  const price1 = pricesQuery.data?.find((p) => p.order === 1)?.price ?? 0;
  const price2 = pricesQuery.data?.find((p) => p.order === 2)?.price ?? 0;
  const price3 = pricesQuery.data?.find((p) => p.order === 3)?.price ?? 0;

  const numSesionesDisponibles = sessionsQuery.data?.sessions.length ?? 0;
  const idSesion = sessionsQuery.data?.sessions[0]?.id;

  const pendingPayment = (sessionsQuery.data?.pendingPayments ?? []).reduce((total, p) => {
    return total + p.cart.reduce((sum, item) => sum + item.price, 0);
  }, 0);

  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    let p = 0;
    if (numSesiones > 0) p += price1;
    if (numSesiones > 1) p += price2;
    if (numSesiones > 2) p += (numSesiones - 2) * price3;
    setPrecio(p);
  }, [numSesiones, price1, price2, price3]);

  function calcularPrecio(value: number) {
    setErrorMessage('');
    let n = value;
    if (n < 0) n = 0;
    if (n > 10) n = 10;
    setNumSesiones(n);
  }

  function agregarACarrito() {
    if (numSesiones < 1) {
      setErrorMessage('Debes seleccionar al menos una sesión');
      return;
    }
    setErrorMessage('');
    cart.addProduct({ type: 'Sesiones', quantity: numSesiones, price: precio });
  }

  function programarSesion() {
    navigate('/agendar', { state: { idSesion } });
  }

  function sesionesDisponiblesLabel() {
    return numSesionesDisponibles === 1 ? '1 sesión disponible' : `${numSesionesDisponibles} sesiones disponibles`;
  }

  function numeroSesionesLabel() {
    const n = cart.sessions();
    return n === 1 ? '1 sesión' : `${n} sesiones`;
  }

  if (pricesQuery.isLoading) {
    return <div className="px-4 py-16 text-center text-secondary">Cargando...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {!isLoggedIn && (
        <p className="text-center">
          Para programar sesiones debes{' '}
          <a href="/login" className="font-bold text-primary">
            ingresar
          </a>{' '}
          con tu usuario y contraseña. Si no tienes cuenta, puedes registrarte.
        </p>
      )}

      {isLoggedIn && (
        <div className="space-y-6">
          <p className="text-lg">Hola, {user?.name}</p>

          {pendingPayment > 0 && (
            <p className="rounded bg-yellow-50 p-4 text-sm">
              Tienes {formatCurrency(pendingPayment)} pendientes de confirmación de pago. Si ya pagaste y no has
              enviado el comprobante, por favor envíalo a <strong>rodrigosabbie@gmail.com</strong> o al Whatsapp
              +57 3142452458
            </p>
          )}

          {numSesionesDisponibles === 0 && (
            <p>No tienes sesiones disponibles. Debes adquirir al menos una para programar una sesión.</p>
          )}

          {numSesionesDisponibles > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              <p>Tienes {sesionesDisponiblesLabel()} para programar.</p>
              <button
                type="button"
                onClick={programarSesion}
                className="rounded bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Programar sesión
              </button>
            </div>
          )}

          <form className="max-w-sm space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-secondary" htmlFor="numSesiones">
                No. de sesiones:
              </label>
              <input
                id="numSesiones"
                type="number"
                min={0}
                max={10}
                placeholder="Escribe el No. de sesiones o usa flechas a la derecha"
                value={numSesiones}
                onChange={(e) => calcularPrecio(Number(e.target.value))}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary" htmlFor="precio">
                Precio:
              </label>
              <input
                id="precio"
                type="text"
                readOnly
                value={formatoPrecio(precio)}
                className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2"
              />
            </div>
            <button
              type="button"
              onClick={agregarACarrito}
              className="w-full rounded bg-primary py-2 font-semibold text-white hover:opacity-90"
            >
              Agregar al carrito
            </button>
          </form>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          {cart.sessions() > 0 && (
            <p>
              Tienes {numeroSesionesLabel()} en el carrito de compras. Puedes confirmar la compra{' '}
              <a href="/carrito" className="font-semibold text-primary underline">
                aquí
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

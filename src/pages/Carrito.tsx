import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buy } from '../services/api';

// Ported from agecan-front/src/app/carrito/carrito.page.ts / .html
// Note: the original checkout() had a bug (`reader.onloadend = () => async () => {...}`)
// that meant the callback was created but never invoked, so file uploads never
// actually completed the purchase. This port fixes that so uploading a receipt works.

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Carrito() {
  const cart = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setSubmitting(true);
    setError(null);
    try {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const fileData = await readFileAsBase64(file);
        await buy({ cart: cart.items, fileData });
      } else {
        await buy({ cart: cart.items });
      }
      cart.clean();
      navigate('/paquetes');
    } catch (err) {
      console.error(err);
      setError('Se produjo un error al confirmar la compra. Intente más tarde.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary">Carrito de compras</h1>

      {cart.items.length === 0 && <h2 className="mt-6 text-lg">No tienes elementos en el carrito de compras.</h2>}

      {cart.items.length > 0 && (
        <div className="mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Producto</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Precio</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 font-semibold">{item.type}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{formatCurrency(item.price)}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => cart.removeFromCart(i)}
                      aria-label="Eliminar"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-2"></td>
                <td className="py-2 font-bold">Total</td>
                <td className="py-2 font-bold">{formatCurrency(cart.total())}</td>
                <td className="py-2"></td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 space-y-3">
            <p>Por favor transfiera o consigne este valor a la siguiente cuenta:</p>
            <ul className="list-disc pl-6">
              <li>Cuenta de ahorros Bancolombia No. 46147299231</li>
              <li>Titular: Rodrigo Sabbie</li>
              <li>C.C. 79.941.123</li>
            </ul>
            <p>Si puede realizar la transferencia en línea, por favor anexe el comprobante aquí:</p>
            <input ref={fileInputRef} type="file" name="fileUpload" id="fileUpload" />
            <p>
              De lo contrario, envíe posteriormente el comprobante a <strong>rodrigosabbie@gmail.com</strong> o al
              Whatsapp +57 3142452458
            </p>
            <p>Una vez confirmado el pago habilitaremos la programación de las sesiones en esta página</p>
          </div>

          {error && <p className="mt-4 text-red-600">{error}</p>}

          <button
            type="button"
            onClick={checkout}
            disabled={submitting}
            className="mt-6 rounded bg-primary px-6 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      )}
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ported from agecan-front/src/app/auth/registro/registro.page.ts / .html
// Email regex and password strength regex ported tal cual as zod validations.

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const registroSchema = z.object({
  email: z.string().regex(emailRegex, 'Email inválido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  contrasena: z
    .string()
    .regex(passwordRegex, 'Contraseña inválida. Debe contener al menos 6 caracteres, incluyendo letras y números.'),
});

type RegistroFormValues = z.infer<typeof registroSchema>;

export default function Registro() {
  const { registerWithEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({ resolver: zodResolver(registroSchema) });

  async function onSubmit(values: RegistroFormValues) {
    setError(null);
    try {
      await registerWithEmail(values.email, values.contrasena, values.nombre, values.apellido);
      navigate('/', { replace: true });
    } catch {
      setError('Error al registrar el usuario. El email ya debe estar registrado.');
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-2xl font-bold text-primary">Completa tus datos de registro</h1>

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('nombre')}
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary" htmlFor="apellido">
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('apellido')}
          />
          {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary" htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('telefono')}
          />
          {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary" htmlFor="contrasena">
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('contrasena')}
          />
          {errors.contrasena && <p className="mt-1 text-sm text-red-600">{errors.contrasena.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-primary py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          Confirmar registro
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Al registrarte declaras que aceptas nuestras:</p>
        <p className="mt-2">
          <Link to="/privacidad" className="text-primary underline">
            Política de privacidad
          </Link>
        </p>
        <p className="mt-1">
          <Link to="/terminos" className="text-primary underline">
            Términos y condiciones de uso
          </Link>
        </p>
      </div>
    </div>
  );
}

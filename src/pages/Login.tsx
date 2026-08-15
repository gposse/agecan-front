import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FacebookIcon, GoogleIcon } from '../components/BrandIcons';

// Ported from agecan-front/src/app/auth/login/login.page.ts / .html

const loginSchema = z.object({
  email: z.string().min(1, 'Email inválido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, isLoggedIn, loginViaEmail, loginViaGoogle, loginViaFacebook } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await loginViaEmail(values.email, values.password);
      navigate('/');
    } catch {
      setError('Error al iniciar sesión. El email o la contraseña son incorrectos.');
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await loginViaGoogle();
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError('No se pudo iniciar sesión con Google.');
    }
  }

  async function handleFacebook() {
    setError(null);
    try {
      await loginViaFacebook();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo iniciar sesión con Facebook.');
    }
  }

  if (isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary">Bienvenido {user?.name}</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-2xl font-bold text-primary">Por favor ingresa tus credenciales</h1>

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
          <label className="block text-sm font-medium text-secondary" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-primary py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          Ingresar
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 font-semibold text-secondary hover:bg-gray-50"
        >
          <GoogleIcon className="h-5 w-5" /> Cuenta Google
        </button>
        <button
          type="button"
          onClick={handleFacebook}
          className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 font-semibold text-secondary hover:bg-gray-50"
        >
          <FacebookIcon className="h-5 w-5" /> Cuenta Facebook
        </button>
        <Link
          to="/registro"
          className="block w-full rounded border border-gray-300 py-2 text-center font-semibold text-secondary hover:bg-gray-50"
        >
          Regístrate con tu email
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Al registrarte o ingresar por primera vez con cuentas de Google o Facebook declaras que aceptas nuestras:</p>
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

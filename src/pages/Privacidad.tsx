// Ported tal cual from agecan-front/src/app/privacidad/privacidad.page.html

export default function Privacidad() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-primary">Política de Privacidad y Tratamiento de Datos</h1>
      </header>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">1. Información Recopilada</h2>
        <p className="mt-2">
          Recopilamos la siguiente información para agendar citas presenciales y virtuales, o para la realización de
          pedidos de productos vendidos en línea:
        </p>
        <ul className="mt-2 list-disc pl-6">
          <li>Nombre completo</li>
          <li>Dirección de correo electrónico</li>
          <li>Dirección física (si aplica)</li>
          <li>Número de teléfono</li>
          <li>Información adicional relevante para el servicio</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">2. Uso de la Información</h2>
        <p className="mt-2">Utilizamos la información recopilada para:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>Agendar citas para servicios presenciales en Colombia.</li>
          <li>Facilitar citas virtuales en cualquier parte del mundo.</li>
          <li>Enviar recordatorios y comunicaciones relacionadas con las citas.</li>
          <li>Mejorar y personalizar nuestros servicios.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">3. Seguridad</h2>
        <p className="mt-2">
          Nos comprometemos a garantizar la seguridad de la información proporcionada y tomamos medidas para
          prevenir el acceso no autorizado o divulgación.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">4. Divulgación a Terceros</h2>
        <p className="mt-2">
          No compartimos información personal con terceros, excepto cuando es necesario para proporcionar el
          servicio solicitado o cuando lo exige la ley.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">5. Derechos del Usuario</h2>
        <p className="mt-2">
          Los usuarios tienen derecho a acceder, corregir, eliminar o solicitar la portabilidad de sus datos
          personales. Pueden hacerlo a través de nuestros canales de contacto.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">6. Cambios en la Política</h2>
        <p className="mt-2">
          Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Se notificarán
          cambios significativos a los usuarios.
        </p>
      </section>

      <footer className="mt-8 text-sm text-gray-500">
        <p>Fecha de última actualización: 2 de enero de 2024</p>
      </footer>
    </div>
  );
}

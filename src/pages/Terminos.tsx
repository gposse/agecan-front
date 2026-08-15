// Ported tal cual from agecan-front/src/app/terminos/terminos.page.html

export default function Terminos() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-primary">Términos de Uso</h1>
      </header>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">1. Aceptación de los Términos</h2>
        <p className="mt-2">
          Al utilizar nuestro servicio de agendamiento de citas, aceptas estos términos de uso en su totalidad. Si no
          estás de acuerdo con alguno de estos términos, no utilices nuestro servicio.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">2. Uso Autorizado</h2>
        <p className="mt-2">
          El usuario se compromete a utilizar el servicio únicamente con fines legales y de acuerdo con estos
          términos de uso. No se permite el uso no autorizado o ilegal del servicio.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">3. Responsabilidades del Usuario</h2>
        <p className="mt-2">
          El usuario es responsable de mantener la confidencialidad de su información de cuenta y de cualquier
          actividad que ocurra bajo su cuenta.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">4. Plazo para agendamiento de citas</h2>
        <p className="mt-2">
          Una vez recibido un pago por parte del usuario, este tendrá un plazo de seis meses para agendar la cita o
          citas respectivas. Antes del vencimiento de este plazo, el usuario puede solicitar la devolución del
          dinero pagado por citas no programadas ni realizadas. Cumplidos los seis meses de este plazo, no se
          devolverá dinero.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">5. Política de cancelación</h2>
        <p className="mt-2">
          El usuario puede cancelar o reprogramar citas progradas con un mínimo de 48 horas de anticipación. Citas
          canceladas o reprogramadas con menos de 48 horas de anticipación se consideran tomadas y no tendrán
          reembolso, salvo en casos de fuerza mayor.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">6. Modificaciones del Servicio</h2>
        <p className="mt-2">
          Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento sin previo aviso.
          No seremos responsables ante el usuario ni terceros por cualquier modificación, suspensión o interrupción
          del servicio.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">7. Derechos de Propiedad Intelectual</h2>
        <p className="mt-2">
          Todos los derechos de propiedad intelectual relacionados con el servicio son propiedad exclusiva de
          Agenda Canina. El usuario no adquiere ningún derecho de propiedad al utilizar el servicio.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">8. Limitación de Responsabilidad</h2>
        <p className="mt-2">
          No seremos responsables de daños directos, indirectos, incidentales, especiales, consecuentes o
          ejemplares que resulten del uso o la imposibilidad de usar el servicio.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-secondary">9. Cambios en los Términos de Uso</h2>
        <p className="mt-2">
          Nos reservamos el derecho de actualizar estos términos de uso en cualquier momento. Se notificarán
          cambios significativos a los usuarios.
        </p>
      </section>

      <footer className="mt-8 text-sm text-gray-500">
        <p>Fecha de última actualización: 7 de enero de 2024</p>
      </footer>
    </div>
  );
}

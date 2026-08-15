import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Mic, Square } from 'lucide-react';
import { useInitialData } from '../context/InitialDataContext';
import { addresses as fetchAddresses, addAppointment } from '../services/api';
import { bogotaDateString, horasDisponibles as fetchHorasDisponibles } from '../lib/schedule';
import type { IHorasDisponibles } from '../lib/schedule';
import type { IAddress, ICityLocation } from '../types';

// Ported from agecan-front/src/app/agendar/agendar.page.ts / .html
// Wizard steps: (a) address or city/location selection, (b) date, (c) time slot,
// (d) contact form + optional audio recording, (e) submit.

interface SelectedPlace {
  id: string;
  name: string;
}

export default function Agendar() {
  const { ciudades } = useInitialData();
  const location = useLocation();
  const navigate = useNavigate();
  const idSesion = (location.state as { idSesion?: string } | null)?.idSesion;

  const [isReady, setIsReady] = useState(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLocated, setIsLocated] = useState(false);

  const [ciudadId, setCiudadId] = useState('');
  const [localidadId, setLocalidadId] = useState('');
  const [localidades, setLocalidades] = useState<ICityLocation[]>([]);
  const [ciudad, setCiudad] = useState<SelectedPlace | null>(null);
  const [localidad, setLocalidad] = useState<SelectedPlace | null>(null);
  const [ciudadNombre, setCiudadNombre] = useState('');

  const [direccionSeleccionada, setDireccionSeleccionada] = useState<IAddress | null>(null);

  const minDate = bogotaDateString();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(minDate);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [horas, setHoras] = useState<IHorasDisponibles>({ manana: [], tarde: [] });

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');

  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsReady(false);
      try {
        const list = (await fetchAddresses()) as IAddress[];
        setAddresses(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  function nombreCiudad(id: string) {
    return ciudades.find((c) => c.id === id)?.name ?? '';
  }

  function onCiudadChange(id: string) {
    setCiudadId(id);
    setLocalidadId('');
    const found = ciudades.find((c) => c.id === id);
    if (found) {
      setCiudad({ id: found.id, name: found.name });
      setCiudadNombre(found.name);
      setLocalidades(found.locations && found.locations.length > 0 ? found.locations : [{ id: found.id, name: found.name, zone: found.zone }]);
    }
  }

  function onLocalidadChange(id: string) {
    setLocalidadId(id);
    const found = localidades.find((l) => l.id === id);
    if (found) {
      setLocalidad({ id: found.id, name: found.name });
    }
  }

  async function loadHoras(fecha: string, cityId: string, locId: string) {
    const h = await fetchHorasDisponibles(fecha, cityId, locId);
    setHoras(h);
  }

  async function onConfirmar(e: React.FormEvent) {
    e.preventDefault();
    if (ciudad && localidad) {
      await loadHoras(fechaSeleccionada, ciudad.id, localidad.id);
      setIsLocated(true);
    }
  }

  async function seleccionarDireccion(address: IAddress) {
    setDireccionSeleccionada(address);
    const c = { id: address.city, name: nombreCiudad(address.city) };
    const l = { id: address.location, name: address.location };
    setCiudad(c);
    setLocalidad(l);
    setCiudadNombre(c.name);
    setCelular(address.phone);
    setDireccion(address.address);
    setEmail(address.email);
    setNombre(address.name);
    await loadHoras(fechaSeleccionada, c.id, l.id);
    setIsLocated(true);
  }

  function cambiarUbicacion() {
    setIsLocated(false);
  }

  function seleccionarHora(hora: string) {
    setHoraSeleccionada(hora);
  }

  function cancelForm() {
    setHoraSeleccionada('');
  }

  async function onDateChange(value: string) {
    setFechaSeleccionada(value);
    if (ciudad && localidad) {
      await loadHoras(value, ciudad.id, localidad.id);
    }
  }

  function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('getUserMedia is not supported');
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setRecording(true);
        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          setRecording(false);
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.onloadend = () => {
            setAudioBase64(reader.result as string);
          };
          reader.readAsDataURL(audioBlob);
        });

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error al acceder al dispositivo de grabación:', error);
      });
  }

  function stopRecording() {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async function submitForm() {
    if (!ciudad || !localidad) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const duration = ciudad.id !== '11001' ? 150 : 90;
      await addAppointment({
        datetime: `${fechaSeleccionada}T${horaSeleccionada}:00.000Z`,
        addressId: direccionSeleccionada?.id ?? null,
        city: ciudad.id,
        location: localidad.id,
        address: direccion,
        name: nombre,
        phone: celular,
        email,
        duration,
        audio: audioBase64,
        sessionId: idSesion,
      });
      setHoraSeleccionada('');
      setAudioBase64('');
      setCelular('');
      setDireccion('');
      setEmail('');
      setNombre('');
      setRecording(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
      setSubmitError('Se produjo un error al agendar la cita. Intente más tarde.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady) {
    return <div className="px-4 py-16 text-center text-secondary">Cargando...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {addresses.length > 0 && !isLocated && (
        <div className="mb-10">
          <h1 className="text-xl font-bold text-primary">Confirma si la sesión será en una dirección registrada</h1>
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Dirección</th>
                <th className="py-2">Ciudad</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="border-b border-gray-100">
                  <td className="py-2">{address.address}</td>
                  <td className="py-2">{nombreCiudad(address.city)}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => seleccionarDireccion(address)}
                      className="rounded bg-primary p-2 text-white hover:opacity-90"
                      aria-label="Seleccionar dirección"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLocated && (
        <div>
          <h1 className="text-xl font-bold text-primary">Por favor confirma tu ubicación</h1>
          <form onSubmit={onConfirmar} className="mt-4 max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary" htmlFor="ciudad">
                Ciudad
              </label>
              <select
                id="ciudad"
                value={ciudadId}
                onChange={(e) => onCiudadChange(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                <option value="" disabled>
                  Selecciona una ciudad
                </option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary" htmlFor="localidad">
                Localidad
              </label>
              <select
                id="localidad"
                value={localidadId}
                onChange={(e) => onLocalidadChange(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              >
                <option value="" disabled>
                  Selecciona una localidad
                </option>
                {localidades.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="rounded bg-primary px-6 py-2 font-semibold text-white hover:opacity-90">
              Confirmar
            </button>
          </form>
        </div>
      )}

      {isLocated && !horaSeleccionada && ciudad && localidad && (
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary" htmlFor="fecha">
                Fecha
              </label>
              <input
                id="fecha"
                type="date"
                min={minDate}
                value={fechaSeleccionada}
                onChange={(e) => onDateChange(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <p>
              Horarios disponibles para {ciudad.name} / {localidad.name}
            </p>
            <button
              type="button"
              onClick={cambiarUbicacion}
              className="w-full rounded bg-primary py-2 font-semibold text-white hover:opacity-90"
            >
              Cambiar ubicación
            </button>
          </div>
          <div className="md:col-span-3">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th>Hora AM</th>
                </tr>
              </thead>
              <tbody>
                {horas.manana.map((hora) => (
                  <tr key={hora}>
                    <td className="py-1">
                      <button
                        type="button"
                        onClick={() => seleccionarHora(hora)}
                        className="w-full rounded border border-primary py-1 text-primary hover:bg-primary hover:text-white"
                      >
                        {hora}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:col-span-3">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th>Hora PM</th>
                </tr>
              </thead>
              <tbody>
                {horas.tarde.map((hora) => (
                  <tr key={hora}>
                    <td className="py-1">
                      <button
                        type="button"
                        onClick={() => seleccionarHora(hora)}
                        className="w-full rounded border border-primary py-1 text-primary hover:bg-primary hover:text-white"
                      >
                        {hora}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isLocated && horaSeleccionada && (
        <div className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary" htmlFor="nombre">
              Tu nombre:
            </label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary" htmlFor="direccion">
              Tu dirección:
            </label>
            <input
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary" htmlFor="email">
              Tu email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary" htmlFor="celular">
              Tu celular:
            </label>
            <input
              id="celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary" htmlFor="ciudadNombre">
              Tu ciudad:
            </label>
            <input
              id="ciudadNombre"
              value={ciudadNombre}
              readOnly
              className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2"
            />
          </div>

          <p className="text-sm text-gray-600">
            Cuéntanos en un audio concreto los detalles, incluye tu nombre completo, el de tu perro, raza, edad,
            tiempo que llevas con él, cómo supiste de nosotros y una descripción de la situación a corregir
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={startRecording}
              disabled={recording}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              <Mic className="h-4 w-4" /> Grabar
            </button>
            <button
              type="button"
              onClick={stopRecording}
              disabled={!recording}
              className="flex items-center gap-2 rounded bg-secondary px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              <Square className="h-4 w-4" /> Detener
            </button>
          </div>
          {audioBase64 && <audio controls src={audioBase64} className="w-full" />}

          {submitError && <p className="text-red-600">{submitError}</p>}

          <button
            type="button"
            onClick={submitForm}
            disabled={submitting}
            className="w-full rounded bg-primary py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Enviando...' : 'Enviar'}
          </button>
          <button
            type="button"
            onClick={cancelForm}
            className="w-full rounded border border-gray-300 py-2 font-semibold text-secondary hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

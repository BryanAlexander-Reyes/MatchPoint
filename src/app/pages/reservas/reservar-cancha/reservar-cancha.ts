import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CanchaModel, FranjaModel, ReservaModel } from '../../../models/reservas/model-reserva';
import { ReservasService } from '../../../service/servicio-reservas/reservasService';
import { IconComponent } from '../../../shared/components/icon/icon';
import { fechaCorta, fechaLarga } from '../../../shared/utils/fechas';
import { DetalleCancha } from '../detalle-cancha/detalle-cancha';
import { DisponibilidadCancha } from '../disponibilidad-cancha/disponibilidad-cancha';
import { ResumenReserva } from '../resumen-reserva/resumen-reserva';
import { ConfirmacionReserva } from '../confirmacion-reserva/confirmacion-reserva';

type CampoValidado = 'hora' | 'nombre' | 'jugadores' | 'correo';

interface Mensaje {
  tipo: 'exito' | 'error';
  texto: string;
}

const CANCHA_POR_DEFECTO = 2;
const DURACION_MENSAJE_MS = 3500;
const LATENCIA_SIMULADA_MS = 900; // Simula la espera de la API al confirmar

@Component({
  selector: 'app-reservar-cancha',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    DetalleCancha,
    DisponibilidadCancha,
    ResumenReserva,
    ConfirmacionReserva,
  ],
  templateUrl: './reservar-cancha.html',
  styleUrl: './reservar-cancha.css',
})
export class ReservarCancha implements OnInit {
  constructor(
    private reservasService: ReservasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // La cancha llega por la URL: /reservar-cancha/2
    const id = Number(this.route.snapshot.paramMap.get('canchaId') ?? CANCHA_POR_DEFECTO);
    this.cancha =
      this.reservasService.obtenerCancha(id) ??
      this.reservasService.obtenerCancha(CANCHA_POR_DEFECTO)!;

    // Valores iniciales del formulario
    this.fecha = this.reservasService.hoy;
    this.modalidad = this.cancha.modalidad;
    this.nombre = this.reservasService.usuario.nombre;
    this.correo = this.reservasService.usuario.correo;
    this.jugadores = this.cancha.capacidadMin;

    // Se preselecciona la primera franja libre desde las 16:00 (o la primera del día)
    const libres = this.franjasDisponibles;
    this.hora = (libres.find((f) => f.inicio >= '16:00') ?? libres[0])?.inicio ?? '';
  }

  // =========================
  // TEXTOS DEL COMPONENTE
  // =========================

  textoVolver: string = 'Volver a canchas';
  tituloFormulario: string = 'Completa los datos de tu reserva';
  labelFecha: string = 'Fecha';
  labelHora: string = 'Hora';
  labelModalidad: string = 'Modalidad';
  labelNombre: string = 'Nombre del responsable';
  labelJugadores: string = 'Número de jugadores';
  labelCorreo: string = 'Correo electrónico';
  labelEquipo: string = '¿Tienes equipo propio?';
  labelNotas: string = 'Notas adicionales (opcional)';
  placeholderNombre: string = 'Nombre y apellido';
  placeholderCorreo: string = 'tucorreo@mail.com';
  placeholderNotas: string = 'Escribe aquí cualquier solicitud especial...';

  // =========================
  // MODELO DEL FORMULARIO
  // =========================

  cancha!: CanchaModel;

  fecha: string = '';
  hora: string = ''; // Inicio de la franja elegida ('' = ninguna)
  modalidad: string = '';
  nombre: string = '';
  jugadores: number | null = null;
  correo: string = '';
  equipoPropio: 'si' | 'no' = 'si';
  notas: string = '';

  errores: Partial<Record<CampoValidado, string>> = {};

  // Estos tres cambian dentro de setTimeout, por eso son signals (la app no usa zone.js)
  procesando = signal(false);
  reservaConfirmada = signal<ReservaModel | null>(null);
  mensaje = signal<Mensaje | null>(null);
  private temporizadorMensaje?: ReturnType<typeof setTimeout>;

  // =========================
  // DATOS CALCULADOS
  // =========================

  get modalidades(): string[] {
    return this.reservasService.modalidades;
  }

  get franjas(): FranjaModel[] {
    return this.reservasService.obtenerFranjas(this.cancha.id, this.fecha);
  }

  get franjasDisponibles(): FranjaModel[] {
    return this.franjas.filter((franja) => franja.estado === 'disponible');
  }

  get fechaMinima(): string {
    return this.reservasService.hoy;
  }

  get fechaMaxima(): string {
    return this.reservasService.fechaMaxima;
  }

  get fechaLarga(): string {
    return fechaLarga(this.fecha);
  }

  get fechaCorta(): string {
    return fechaCorta(this.fecha);
  }

  get textoDuracion(): string {
    const horas = this.reservasService.duracionHoras;
    return `${horas} hora${horas > 1 ? 's' : ''}`;
  }

  get textoHora(): string {
    if (!this.hora) return 'Sin seleccionar';
    return `${this.hora} - ${this.reservasService.calcularHoraFin(this.hora)} (${this.textoDuracion})`;
  }

  get total(): number {
    return this.hora ? this.cancha.precioHora * this.reservasService.duracionHoras : 0;
  }

  // =========================
  // ACCIONES
  // =========================

  volver(): void {
    // TODO: navegar al listado de canchas cuando exista la ruta del módulo DEPORTES.
    this.mostrarMensaje('error', 'El listado de canchas todavía no está disponible.');
  }

  seleccionarFranja(franja: FranjaModel): void {
    if (franja.estado !== 'disponible') {
      const motivo = franja.estado === 'reservada' ? 'ya está reservado' : 'no está disponible';
      this.mostrarMensaje('error', `El horario ${franja.inicio} ${motivo}. Elige uno en verde.`);
      return;
    }
    this.seleccionarHora(franja.inicio);
  }

  seleccionarHora(inicio: string): void {
    this.hora = inicio;
    delete this.errores.hora;
  }

  cambiarFecha(input: HTMLInputElement): void {
    const nuevaFecha = input.value;
    if (!nuevaFecha || nuevaFecha < this.fechaMinima || nuevaFecha > this.fechaMaxima) {
      input.value = this.fecha;
      this.mostrarMensaje(
        'error',
        `Solo puedes reservar entre hoy y los próximos ${this.reservasService.diasMaxAnticipacion} días.`
      );
      return;
    }

    this.fecha = nuevaFecha;
    // Si la hora elegida no está libre en la nueva fecha, se limpia
    if (this.hora && !this.reservasService.estaDisponible(this.cancha.id, this.fecha, this.hora)) {
      this.hora = '';
    }
  }

  limpiarError(campo: CampoValidado): void {
    delete this.errores[campo];
  }

  confirmar(): void {
    if (this.procesando()) return;

    this.errores = this.validar();
    const campos = Object.keys(this.errores);
    if (campos.length > 0) {
      document.getElementById(campos[0])?.focus();
      this.mostrarMensaje('error', 'Revisa los campos marcados en rojo.');
      return;
    }

    const reserva: ReservaModel = {
      codigo: this.reservasService.generarCodigo(),
      canchaId: this.cancha.id,
      cancha: this.cancha.nombre,
      fecha: this.fecha,
      horaInicio: this.hora,
      horaFin: this.reservasService.calcularHoraFin(this.hora),
      modalidad: this.modalidad,
      responsable: this.nombre.trim(),
      correo: this.correo.trim(),
      jugadores: this.jugadores ?? 0,
      equipoPropio: this.equipoPropio === 'si',
      notas: this.notas.trim(),
      total: this.total,
      estado: 'Confirmada',
      creadaEn: new Date().toISOString(),
    };

    this.procesando.set(true);

    // TODO: reemplazar por la llamada POST /reservas cuando exista el backend.
    setTimeout(() => {
      this.reservasService.agregarReserva(reserva);
      console.log('[MATCH POINT] Reserva creada:', reserva);

      this.hora = '';
      this.notas = '';
      this.procesando.set(false);
      this.reservaConfirmada.set(reserva);
    }, LATENCIA_SIMULADA_MS);
  }

  cerrarModal(): void {
    this.reservaConfirmada.set(null);
  }

  verMisReservas(): void {
    this.cerrarModal();
    // TODO: navegar a "Mis reservas" cuando exista esa pantalla.
    this.mostrarMensaje(
      'exito',
      `Tienes ${this.reservasService.reservas.length} reserva(s). La vista "Mis reservas" está en construcción.`
    );
  }

  // =========================
  // VALIDACIÓN Y MENSAJES
  // =========================

  private validar(): Partial<Record<CampoValidado, string>> {
    const errores: Partial<Record<CampoValidado, string>> = {};

    if (!this.hora) {
      errores.hora = 'Selecciona un horario disponible.';
    }
    if (this.nombre.trim().length < 3) {
      errores.nombre = 'Ingresa el nombre del responsable (mínimo 3 caracteres).';
    }
    const jugadores = Number(this.jugadores);
    if (!Number.isInteger(jugadores) || jugadores < 1 || jugadores > this.cancha.capacidadMax) {
      errores.jugadores = `Debe estar entre 1 y ${this.cancha.capacidadMax} jugadores.`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.correo.trim())) {
      errores.correo = 'Ingresa un correo electrónico válido.';
    }
    return errores;
  }

  private mostrarMensaje(tipo: Mensaje['tipo'], texto: string): void {
    this.mensaje.set({ tipo, texto });
    clearTimeout(this.temporizadorMensaje);
    this.temporizadorMensaje = setTimeout(() => this.mensaje.set(null), DURACION_MENSAJE_MS);
  }
}

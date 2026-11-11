import { Component, OnInit, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ProductService } from "../../servicios/product";
import { TicketService } from "../../servicios/ticket";
import { Producto } from "../../models/producto";

type Seccion = "productos" | "usuarios" | "ventas";

@Component({
  selector: "app-admin",
  imports: [FormsModule],
  templateUrl: "./admin.html",
  styleUrl: "./admin.css"
})
export class AdminComponent implements OnInit {

  seccion = signal<Seccion>("productos");

  productos = signal<Producto[]>([]);   // lista de productos para editar/borrar
  usuarios = signal<any[]>([]);         // usuarios registrados
  ventas = signal<any[]>([]);           // todas las compras (con su ticket)

  // Datos del formulario. Si tiene "id", estamos editando; si no, creando.
  form = signal<Partial<Producto>>(this.formVacio());
  archivoElegido: File | null = null;   // imagen elegida (si eligió alguna)
  vistaPrevia = signal("");             // vista previa de la imagen elegida
  guardando = signal(false);
  mensaje = signal("");
  error = signal("");

  totalVendido = computed(() =>
    this.ventas().reduce((suma, v) => suma + Number(v.total), 0)
  );

  private api = "http://localhost/API_PROYECTOB/public";
  private carpetaImagenes = "/assets/";   // carpeta donde están las fotos
  private inputArchivo: HTMLInputElement | null = null;

  constructor(
    private productService: ProductService,
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarUsuarios();
    this.cargarVentas();
  }

  // ---------- CARGA DE LISTAS (el interceptor agrega el token) ----------

  cargarProductos(): void {
    this.productService.listar().subscribe({
      next: (l) => this.productos.set(l),
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  cargarUsuarios(): void {
    this.http.get<any[]>(`${this.api}/usuarios/todos`).subscribe({
      next: (l) => this.usuarios.set(l),
      error: (err) => console.error("Error al cargar usuarios:", err)
    });
  }

  cargarVentas(): void {
    this.http.get<any[]>(`${this.api}/compras/todas`).subscribe({
      next: (lista) => {
        if (lista.length === 0) {
          this.ventas.set([]);
          return;
        }

        // Pedimos el ticket de cada compra; si no tiene, queda en null
        const pedidos = lista.map((v) =>
          this.ticketService.ver(v.id_compra).pipe(
            catchError(() => of(null))
          )
        );

        forkJoin(pedidos).subscribe((tickets) => {
          this.ventas.set(
            lista.map((v, i) => {
              const t: any = tickets[i];
              return {
                ...v,
                numero_ticket: t?.numero_ticket ?? null,
                pdf_path: t?.pdf_path ?? null
              };
            })
          );
        });
      },
      error: (err) => console.error("Error al cargar ventas:", err)
    });
  }

  // ---------- FORMULARIO ----------

  private formVacio(): Partial<Producto> {
    return { nombre: "", descripcion: "", precio: 0, imagen: "" };
  }

  // Actualiza un campo del formulario
  cambiar(campo: string, valor: any): void {
    this.form.update((f) => ({ ...f, [campo]: valor } as Partial<Producto>));
  }

  // Se ejecuta cuando el admin elige un archivo
  alElegirArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.inputArchivo = input;
    this.archivoElegido = input.files && input.files.length ? input.files[0] : null;
    this.vistaPrevia.set(
      this.archivoElegido ? URL.createObjectURL(this.archivoElegido) : ""
    );
  }

  // Botón Guardar: primero sube la imagen (si hay) y después guarda el producto
  guardar(): void {
    const f = this.form();

    if (!f.nombre?.trim() || !(Number(f.precio) > 0)) {
      this.error.set("Completá el nombre y un precio mayor a 0.");
      this.mensaje.set("");
      return;
    }

    this.error.set("");
    this.mensaje.set("");
    this.guardando.set(true);

    if (this.archivoElegido) {
      this.productService.subirImagen(this.archivoElegido).subscribe({
        next: (r) => {
          this.cambiar("imagen", r.imagen);
          this.guardarProducto();
        },
        error: (err) => {
          console.error("Error al subir la imagen:", err);
          this.error.set("No se pudo subir la imagen.");
          this.guardando.set(false);
        }
      });
    } else {
      this.guardarProducto(); // sin imagen nueva: conserva la que ya tenía
    }
  }

  // Crea (POST) o edita (PUT) según el formulario tenga id o no
  private guardarProducto(): void {
    const f = this.form();
    const editando = !!f.id;

    const accion = f.id
      ? this.productService.editar(f.id, f)
      : this.productService.crear(f);

    accion.subscribe({
      next: () => {
        this.limpiar();
        this.mensaje.set(editando ? "Producto actualizado." : "Producto creado.");
        this.cargarProductos();
      },
      error: (err) => {
        console.error("Error al guardar el producto:", err);
        this.error.set(err.error?.error ?? "No se pudo guardar el producto.");
        this.guardando.set(false);
      }
    });
  }

  // Botón Editar: copia el producto al formulario
  editar(p: Producto): void {
    this.form.set({ ...p });
    this.archivoElegido = null;
    this.vistaPrevia.set("");
    if (this.inputArchivo) this.inputArchivo.value = "";
    this.error.set("");
    this.mensaje.set("");
    this.seccion.set("productos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Botón Cancelar (al editar)
  cancelar(): void {
    this.limpiar();
    this.error.set("");
    this.mensaje.set("");
  }

  // Botón Eliminar: pide confirmación, borra y recarga
  eliminar(id: number): void {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    this.productService.eliminar(id).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => {
        console.error("Error al eliminar:", err);
        this.error.set(err.error?.error ?? "No se pudo eliminar el producto.");
      }
    });
  }

  private limpiar(): void {
    this.form.set(this.formVacio());
    this.archivoElegido = null;
    this.vistaPrevia.set("");
    this.guardando.set(false);
    if (this.inputArchivo) this.inputArchivo.value = "";
  }

  // ---------- AYUDAS PARA LA PANTALLA ----------

  formato(valor: number | string): string {
    return Number(valor).toLocaleString("es-AR");
  }

  imagenUrl(nombre?: string): string {
    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;
    return this.carpetaImagenes + nombre;
  }

  // Link completo al PDF del ticket
  urlPdf(venta: any): string {
    const ruta = String(venta.pdf_path ?? "").replace(/^\/+/, "");
    return this.ticketService.baseArchivos + ruta;
  }
}
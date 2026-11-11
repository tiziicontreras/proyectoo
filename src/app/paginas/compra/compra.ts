import { Component, OnInit, computed, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CarritoService } from "../../servicios/carrito.service";
import { CompraService } from "../../servicios/compra";
import { TicketService } from "../../servicios/ticket";

@Component({
  selector: "app-compra",
  imports: [RouterLink],
  templateUrl: "./compra.html",
  styleUrl: "./compra.css"
})
export class CompraComponent implements OnInit {

  items = signal<any[]>([]);   // resumen: lo que hay en el carrito
  enviando = signal(false);
  error = signal("");

  total = computed(() =>
    this.items().reduce(
      (suma, i) => suma + Number(i.cantidad) * Number(i.precio_unitario),
      0
    )
  );

  constructor(
    private carrito: CarritoService,
    private compraService: CompraService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrito.ver().subscribe({
      next: lista => this.items.set(lista),
      error: err => console.error("Error al cargar el carrito:", err)
    });
  }

  formato(valor: number): string {
    return valor.toLocaleString("es-AR");
  }

  // Arma la ruta completa de la imagen
  imagenUrl(item: any): string {
    const nombre = item.imagen ?? item.img ?? "";
    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;
    return "/assets/" + nombre;
  }

  // Botón "Confirmar compra"
  finalizar(): void {
    if (this.enviando()) return;
    this.enviando.set(true);
    this.error.set("");

    this.compraService.finalizar().subscribe({
      next: respuesta => {
        // La compra ya se registró: el carrito quedó vacío en la base
        this.items.set([]);
        this.carrito.actualizarContador();

        this.ticketService.generar(respuesta.id_compra).subscribe({
          next: () => {
            this.router.navigate(["/paginas/ticket", respuesta.id_compra]);
          },
          error: err => {
            console.error("Error al generar el ticket:", err);
            this.error.set("La compra se registró, pero falló el ticket.");
            this.enviando.set(false);
          }
        });
      },
      error: err => {
        console.error("Error al finalizar la compra:", err);
        this.error.set(err.error?.error ?? "No se pudo finalizar la compra.");
        this.enviando.set(false);
      }
    });
  }
}
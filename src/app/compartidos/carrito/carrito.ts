import { Component, OnInit, computed, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CarritoService } from "../../servicios/carrito.service";

@Component({
  selector: "app-carrito",
  imports: [RouterLink],
  templateUrl: "./carrito.component.html",
  styleUrl: "./carrito.css"
})
export class CarritoComponent implements OnInit {

  items = signal<any[]>([]);

  // Carpeta donde están las fotos
  private carpetaImagenes = "/assets/";

  // Precio total del carrito (se recalcula solo cuando cambia la lista)
  total = computed(() =>
    this.items().reduce(
      (suma, i) => suma + Number(i.cantidad) * this.precioDe(i),
      0
    )
  );

  constructor(
    private carrito: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // CARGAMOS LOS PRODUCTOS DEL CARRITO
  cargar(): void {
    this.carrito.ver().subscribe({
      next: (lista) => this.items.set(lista),
      error: (err) => console.error("Error al cargar el carrito:", err)
    });
  }

  // Id del producto (la API lo manda como id_producto)
  idDe(item: any): number {
    return item.id_producto ?? item.id;
  }

  // Precio unitario (la API lo manda como texto: "249999.00")
  precioDe(item: any): number {
    return Number(item.precio_unitario ?? item.precio ?? 0);
  }

  // Arma la ruta completa de la imagen
  imagenUrl(item: any): string {
    const nombre = item.imagen ?? item.img ?? "";
    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;
    return this.carpetaImagenes + nombre;
  }

  formato(valor: number): string {
    return valor.toLocaleString("es-AR");
  }

  // AUMENTAMOS LA CANTIDAD
  aumentar(item: any): void {
    this.cambiarCantidad(item, Number(item.cantidad) + 1);
  }

  // DISMINUIMOS LA CANTIDAD
  disminuir(item: any): void {
    this.cambiarCantidad(item, Number(item.cantidad) - 1);
  }

  // CAMBIAMOS LA CANTIDAD DEL PRODUCTO
  cambiarCantidad(item: any, cantidad: number): void {
    if (cantidad < 1) return;

    this.carrito.actualizar(this.idDe(item), cantidad).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error("Error al actualizar:", err)
    });
  }

  // ELIMINAMOS UN PRODUCTO
  eliminar(item: any): void {
    this.carrito.eliminar(this.idDe(item)).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error("Error al eliminar:", err)
    });
  }

  // VACIAMOS EL CARRITO
  vaciar(): void {
    this.carrito.vaciar().subscribe(() => this.cargar());
  }

  // FINALIZAMOS LA COMPRA
  finalizarCompra(): void {
    this.router.navigate(["/paginas/compra"]);
  }
}
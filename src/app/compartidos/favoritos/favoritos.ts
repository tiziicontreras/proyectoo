import { Component, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FavoritoService } from "../../servicios/favoritoService";
import { CarritoService } from "../../servicios/carrito.service";

@Component({
  selector: "app-favoritos",
  imports: [RouterLink],
  templateUrl: "./favoritos.component.html",
  styleUrl: "./favoritos.css"
})
export class FavoritosComponent implements OnInit {

  favoritos = signal<any[]>([]);

  // Carpeta donde están las fotos
  private carpetaImagenes = "/assets/";

  constructor(
    private favoritoService: FavoritoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // CARGAMOS LOS FAVORITOS
  cargar(): void {
    this.favoritoService.listar().subscribe({
      next: (lista) => this.favoritos.set(lista),
      error: (err) => console.error("Error al cargar favoritos:", err)
    });
  }

  // Id del producto
  idDe(item: any): number {
    return item.id_producto ?? item.id;
  }

  // Precio (puede llegar como texto)
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

  // AGREGAMOS UN FAVORITO AL CARRITO
  agregarCarrito(item: any): void {
    this.carritoService.agregar(this.idDe(item), 1).subscribe({
      next: () => alert("Agregado al carrito"),
      error: (err) => alert(err.error?.error ?? "No se pudo agregar al carrito")
    });
  }

  // ELIMINAMOS UN FAVORITO
  eliminar(item: any): void {
    this.favoritoService.eliminar(this.idDe(item)).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error("Error al eliminar favorito:", err)
    });
  }
}
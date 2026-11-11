
import { Component, OnInit, signal } from "@angular/core";
import { ProductService } from "../../servicios/product";
import { CarritoService } from "../../servicios/carrito.service";
import { FavoritoService } from "../../servicios/favoritoService";
import { Producto } from "../../models/producto";

@Component({
  selector: "app-ofertas",
  imports: [],
  templateUrl: "./ofertas.html",
  styleUrl: "./ofertas.css"
})
export class Ofertas implements OnInit {

  productos = signal<Producto[]>([]);

  private carpetaImagenes = "/assets/";

  constructor(
    private productService: ProductService,
    private carrito: CarritoService,
    private favoritoService: FavoritoService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // Carga los productos desde la API y filtra las ofertas
  cargar(): void {
    this.productService.listar("").subscribe({
      next: (lista) => {
        const ofertas = lista.filter(p =>
          p.precioOferta != null &&
          Number(p.precioOferta) > 0 &&
          Number(p.precioOferta) < Number(p.precio)
        );

        this.productos.set(ofertas);
      },
      error: (err) => console.error("Error al cargar ofertas:", err)
    });
  }

  // Ruta de la imagen
  imagenUrl(p: Producto): string {
    const nombre = p.imagen ?? p.img ?? "";

    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;

    return this.carpetaImagenes + nombre;
  }

  // Formato de precios
  formatoPrecio(precio: number): string {
    return Number(precio).toLocaleString("es-AR");
  }

  agregarCarrito(producto: Producto): void {
    this.carrito.agregar(producto.id, 1).subscribe({
      next: () => alert("Agregado al carrito"),
      error: (err) => {
        console.error("Error al agregar al carrito:", err);
        alert(err.status === 401
          ? "Iniciá sesión para agregar productos al carrito"
          : (err.error?.error ?? "No se pudo agregar al carrito"));
      }
    });
  }

  agregarFavoritos(producto: Producto): void {
    this.favoritoService.agregar(producto.id).subscribe({
      next: () => alert("Agregado a favoritos"),
      error: (err) => {
        console.error("Error al agregar a favoritos:", err);
        alert(err.status === 401
          ? "Iniciá sesión para guardar favoritos"
          : (err.error?.error ?? "No se pudo agregar a favoritos"));
      }
    });
  }
}

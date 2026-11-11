import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../servicios/product";
import { CarritoService } from "../../servicios/carrito.service";
import { FavoritoService } from "../../servicios/favoritoService";
import { Producto } from "../../models/producto";

@Component({
  selector: "app-productos",
  imports: [FormsModule],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.css"
})
export class ProductosComponent implements OnInit {

  productos = signal<Producto[]>([]);
  buscar = "";

  // Carpeta donde están las fotos (si están en otro lugar, cambiá solo esto)
  private carpetaImagenes = "/assets/";

  constructor(
    private productService: ProductService,
    private carrito: CarritoService,
    private favoritoService: FavoritoService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // Carga los productos desde la API
  cargar(): void {
    this.productService.listar(this.buscar).subscribe({
      next: (lista) => this.productos.set(lista),
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  // Arma la ruta completa de la imagen a partir del nombre del archivo
  imagenUrl(p: Producto): string {
    const nombre = p.imagen ?? p.img ?? "";
    if (!nombre) return "";
    if (nombre.startsWith("http")) return nombre;
    return this.carpetaImagenes + nombre;
  }

  // El precio llega como texto ("249999.00"): lo mostramos con formato
  formatoPrecio(p: Producto): string {
    return Number(p.precio).toLocaleString("es-AR");
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